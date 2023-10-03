import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { UserVouchService } from 'src/users/user-vouch/user-vouch.service';
import { Brackets, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { ServiceResponseException } from '../../common/exceptions';
import { ServiceSlot } from './service-slots.entity';

export enum SERVICE_SLOT_ERROR_CODES {
    SLOT_NOT_FOUND = 'SLOT_NOT_FOUND',
    INVALID_STATE = 'INVALID_STATE',
    MAX_SLOTS_EXCEEDED = 'MAX_SLOTS_EXCEEDED',
}

export type ServiceSlotCreationData = Pick<ServiceSlot, 'serviceOwnerUserId' | 'clientUserId' | 'serviceId'>;

@Injectable()
export class ServiceSlotsService {
    constructor(
        @InjectRepository(ServiceSlot) private readonly serviceSlotRepository: Repository<ServiceSlot>,
        private readonly userVouchService: UserVouchService,
    ) {
    }

    createQuery() {
        return new CustomQueryBuilder(
            this.serviceSlotRepository.createQueryBuilder('service_slot'),
        );
    }

    async findById(uuid: string): Promise<ServiceSlot> {
        return this.serviceSlotRepository.findOneBy({ uuid });
    }

    async createServiceSlot(data: ServiceSlotCreationData): Promise<ServiceSlot> {
        /*
         Don't want the user to be able to spam slot requests, but we do want them to be able to rerun the same service if it successfully ended
         If the service user doesn't want to rerun the same user they can just reject their next request, and all subsequent requests will error here
         TODO - Business logic TBD, maybe also allow them request the same service if it was rejected?
         */
        const existingSlot = await this.serviceSlotRepository.findOne({
            where: {
                clientUserId: data.clientUserId,
                serviceId: data.serviceId,
                state: Not(API.ServiceSlotStates.Ended),
            },
        });

        if (existingSlot) {
            throw new ConflictException(
                'A service slot for the provided client and service, which has not ended, already exists.',
            );
        }

        const serviceSlot = this.serviceSlotRepository.create({
            ...data,
            state: API.ServiceSlotStates.Pending,
        });

        return await this.serviceSlotRepository.save(serviceSlot);
    }

    async updateServiceSlotState(slotUuid: string, state: API.ServiceSlotStates): Promise<ServiceSlot> {
        // Check the validity of the state before proceeding
        if (!Object.values(API.ServiceSlotStates).includes(state)) {
            throw new ServiceResponseException(
                SERVICE_SLOT_ERROR_CODES.INVALID_STATE,
                `Invalid state "${state}"`,
            );
        }

        /*
         If we're transitioning a slot to the accepted state, we need to check that we're not going above the Service's
         maxAcceptedSlots limit. We use a transaction to prevent a potential race condition where multiple slots are simultaneously/rapidly
         accepted and the limit is exceeded.
         */
        return await this.serviceSlotRepository.manager.transaction(async transactionalEntityManager => {
            const slotQueryBuilder = transactionalEntityManager.createQueryBuilder(ServiceSlot, 'service_slot');

            const slot = await slotQueryBuilder
                .where('service_slot.uuid = :slotUuid', { slotUuid })
                .getOne();

            if (!slot) {
                throw new ServiceResponseException(SERVICE_SLOT_ERROR_CODES.SLOT_NOT_FOUND, 'Slot not found');
            }

            if (state === API.ServiceSlotStates.Ended) {
                await this.userVouchService.createVouch(
                    'Service',
                    slot.serviceId,
                    slot.clientUserId,
                    slot.serviceOwnerUserId,
                );
                await this.userVouchService.createVouch(
                    'Service',
                    slot.serviceId,
                    slot.serviceOwnerUserId,
                    slot.clientUserId,
                );
                await slotQueryBuilder.execute();
            }

            if (state === API.ServiceSlotStates.Accepted) {
                const acceptedSlotsCount = await slotQueryBuilder
                    .leftJoinAndSelect('service_slot.service', 'service')
                    .where('service.uuid = :serviceId', { serviceId: slot.service.uuid })
                    .andWhere('service_slot.state = :state', { state: API.ServiceSlotStates.Accepted })
                    .getCount();

                if (acceptedSlotsCount >= slot.service.maxAcceptedSlots) {
                    throw new ServiceResponseException(
                        SERVICE_SLOT_ERROR_CODES.MAX_SLOTS_EXCEEDED,
                        'Maximum number of accepted slots exceeded',
                    );
                }
                // Update all the CLIENT's slots to REJECTED if they have state PENDING or ACCEPTED
                // TODO - business logic might be questionable here
                await slotQueryBuilder
                    .update()
                    .set({ state: API.ServiceSlotStates.Rejected })
                    .where('service_slot.client_user_id = :clientId', { clientId: slot.clientUserId })
                    .andWhere('service_slot.state IN (:...states)', {
                        states: [API.ServiceSlotStates.Pending, API.ServiceSlotStates.Accepted],
                    })
                    .execute();
            }

            await slotQueryBuilder
                .update()
                .set({ state })
                .where('service_slot.uuid = :slotUuid', { slotUuid })
                .execute();

            return await slotQueryBuilder.where('service_slot.uuid = :slotUuid', { slotUuid }).getOne();
        });
    }
}

class CustomQueryBuilder {
    private queryBuilder: SelectQueryBuilder<ServiceSlot>;

    constructor(queryBuilder: SelectQueryBuilder<ServiceSlot>) {
        this.queryBuilder = queryBuilder;
    }

    excludeEnded(exclude: boolean): CustomQueryBuilder {
        if (exclude) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service_slot.state != :excludedState',
                { excludedState: API.ServiceSlotStates.Ended },
            );
        }

        return this;
    }

    excludeRejected(exclude: boolean): CustomQueryBuilder {
        if (exclude) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service_slot.state != :excludedState',
                { excludedState: API.ServiceSlotStates.Rejected },
            );
        }

        return this;
    }

    searchByServiceOwner(id: number): CustomQueryBuilder {
        if (typeof id === 'number') {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service_slot.service_owner_user_id = :id',
                { id },
            );
        }
        return this;
    }

    searchBySlotClient(id: number): CustomQueryBuilder {
        if (typeof id === 'number') {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service_slot.client_user_id = :id',
                { id },
            );
        }
        return this;
    }

    searchByUserUuid(userUuid: string): CustomQueryBuilder {
        if (typeof userUuid === 'string') {
            this.queryBuilder = this.queryBuilder
                .where(
                    new Brackets(queryBuilder => {
                        queryBuilder.where('client.uuid = :userUuid', { userUuid })
                            .orWhere('serviceOwner.uuid = :userUuid', { userUuid });
                    }),
                );
        }
        return this;
    }

    searchByState(state: API.ServiceSlotStates): CustomQueryBuilder {
        if (typeof state === 'string') {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service_slot.state = :state',
                { state },
            );
        }
        return this;
    }

    includeService(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('service_slot.service', 'service');
        return this;
    }

    includeOwner(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('service_slot.serviceOwner', 'serviceOwner');
        return this;
    }

    includeClient(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('service_slot.client', 'client');
        return this;
    }

    paginate(offset?: number, limit?: number): CustomQueryBuilder {
        if (typeof offset === 'number') {
            this.queryBuilder = this.queryBuilder.skip(offset);
        }
        if (typeof limit === 'number') {
            this.queryBuilder = this.queryBuilder.take(limit);
        }
        return this;
    }

    orderBy(
        field: keyof ServiceSlot,
        order: 'ASC' | 'DESC' = 'DESC',
    ): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.orderBy(`service_slot.${field}`, order);
        return this;
    }

    getMany(): Promise<ServiceSlot[]> {
        return this.queryBuilder.getMany();
    }
}
