import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ServiceResponseException } from '../common/exceptions';
import { Service } from './services.entity';
// Minutes
const MIN_BUMP_INTERVAL = 30;

export enum SERVICE_ERROR_CODES {
    SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
    BUMP_TOO_SOON = 'BUMP_TOO_SOON',
}

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    ) {
    }

    createQuery() {
        return new CustomQueryBuilder(
            this.serviceRepository.createQueryBuilder('service'),
        );
    }

    async countNotDeletedServices(user: User): Promise<number> {
        return await this.serviceRepository.count({ where: { deleted: false, userId: user.id } });
    }

    async createService(data: Partial<Service>): Promise<Service> {
        const service = this.serviceRepository.create(data);
        return await this.serviceRepository.save(service);
    }

    async updateService(uuid: string, dto: Partial<Service>): Promise<Service> {
        const existingService = await this.serviceRepository.findOneBy({ uuid });
        if (!existingService) {
            throw new ServiceResponseException(
                SERVICE_ERROR_CODES.SERVICE_NOT_FOUND,
                `Service with ID ${uuid} not found`,
            );
        }

        await this.serviceRepository.update(uuid, dto);
        return await this.serviceRepository.findOneBy({ uuid });
    }

    async deleteService(uuid: string): Promise<void> {
        await this.serviceRepository.delete(uuid);
    }

    async softDeleteService(uuid: string): Promise<void> {
        await this.serviceRepository.update(uuid, { deleted: true });
    }

    async undoSoftDeleteService(uuid: string): Promise<void> {
        await this.serviceRepository.update(uuid, { deleted: false });
    }

    async bumpService(uuid: string): Promise<void> {
        const service = await this.serviceRepository.findOne({ where: { uuid } });
        if (!service) {
            throw new ServiceResponseException(
                SERVICE_ERROR_CODES.SERVICE_NOT_FOUND,
                `Service with ID ${uuid} not found`,
            );
        }

        const nextBumpAvailableTime = new Date(Date.now() - MIN_BUMP_INTERVAL * 60 * 1000);
        if (service.bumpedAt > nextBumpAvailableTime) {
            throw new ServiceResponseException(
                SERVICE_ERROR_CODES.BUMP_TOO_SOON,
                `Service was bumped less than ${MIN_BUMP_INTERVAL} minutes ago`,
            );
        }

        await this.serviceRepository.update(uuid, { bumpedAt: new Date() });
    }
}

class CustomQueryBuilder {
    private queryBuilder: SelectQueryBuilder<Service>;

    constructor(queryBuilder: SelectQueryBuilder<Service>) {
        this.queryBuilder = queryBuilder;
    }

    withUser(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.innerJoinAndSelect('service.user', 'user')
            .leftJoinAndSelect('user.vouchCalculation', 'vouchCalculation');
        return this;
    }

    searchById(id: number): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere('service.id = :id', { id });
        return this;
    }

    searchByServiceUuid(serviceUuid: string): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere('service.uuid = :serviceUuid', { serviceUuid });
        return this;
    }

    searchByRealmType(serverType?: string): CustomQueryBuilder {
        if (serverType) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service.realmType = :serverType',
                { serverType },
            );
        }
        return this;
    }

    searchByTitle(title?: string): CustomQueryBuilder {
        if (title) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service.title LIKE :title',
                { title: `%${title}%` },
            );
        }
        return this;
    }

    searchByTags(tags?: number): CustomQueryBuilder {
        if (typeof tags === 'number') {
            this.queryBuilder = this.queryBuilder.andWhere(
                `(service.tags & :tags) = :tags`,
                { tags },
            );
        }
        return this;
    }

    searchByUserUuid(userUuid?: string): CustomQueryBuilder {
        if (typeof userUuid === 'string') {
            this.queryBuilder = this.queryBuilder
                .innerJoin('service.user', 'service_user')
                .andWhere('service_user.uuid = :userUuid', { userUuid });
        }
        return this;
    }

    searchByDeleted(deleted?: boolean): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            `service.deleted = :deleted`,
            { deleted },
        );
        return this;
    }

    includeSlots(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('service.slots', 'service_slot');
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
        field: keyof Service,
        order: 'ASC' | 'DESC' = 'DESC',
    ): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.orderBy(`service.${field}`, order);
        return this;
    }

    getMany(): Promise<Service[]> {
        return this.queryBuilder.getMany();
    }

    getOne(): Promise<Service> {
        return this.queryBuilder.getOne();
    }
}
