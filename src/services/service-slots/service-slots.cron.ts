import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { ServiceResponseException } from 'src/common/exceptions';
import { Repository } from 'typeorm';
import { ServiceSlot } from './service-slots.entity';

// 24 hours
const EXPIRATION_TIME_SECONDS = 60 * 60 * 24;

@Injectable()
export class ServiceSlotsCronService {
    private readonly logger = new Logger(ServiceSlotsCronService.name);

    constructor(
        @InjectRepository(ServiceSlot) private serviceSlotRepository: Repository<ServiceSlot>,
    ) {
    }

    /*
     * Cron that checks for outdated service slots
     * If outdated and pending, it will be rejected
     * If outdated and accepted, it will be ended
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleCron() {
        this.logger.debug('Starting to check outdated service slots...');

        try {
            await this.serviceSlotRepository.manager.transaction(async transactionalEntityManager => {
                const validTime = new Date();

                validTime.setSeconds(validTime.getSeconds() - EXPIRATION_TIME_SECONDS);

                const outdatedServiceSlots = await transactionalEntityManager
                    .createQueryBuilder(ServiceSlot, 'service_slot')
                    .where(
                        `(service_slot.state = :pending OR service_slot.state = :accepted) AND service_slot.created_at < :validTime`,
                        {
                            pending: API.ServiceSlotStates.Pending,
                            accepted: API.ServiceSlotStates.Accepted,
                            validTime,
                        },
                    )
                    .getMany();

                const promises = outdatedServiceSlots.map(slot => {
                    const newState = slot.state === API.ServiceSlotStates.Pending
                        ? API.ServiceSlotStates.Rejected
                        : API.ServiceSlotStates.Ended;
                    return transactionalEntityManager.save(ServiceSlot, { ...slot, state: newState });
                });

                await Promise.all(promises);

                this.logger.debug(`Successfully updated ${outdatedServiceSlots.length} outdated service slots.`);
            });
        } catch (error) {
            if (error instanceof ServiceResponseException) {
                this.logger.error('Error updating outdated service slots', error.stack);
            }
        }
    }
}
