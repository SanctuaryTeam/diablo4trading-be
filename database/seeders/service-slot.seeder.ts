import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { generateMock as generateServiceSlotMock } from 'database/mocks/service-slot.mock';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { ServiceSlotCreationData, ServiceSlotsService } from 'src/services/service-slots/service-slots.service';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceSlotSeeder {
    constructor(
        private readonly serviceSlotService: ServiceSlotsService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    ) {}

    async seed(count: number): Promise<void> {
        const users = await this.userRepository.find();

        // Get services without pending slots
        const servicesWithoutPendingSlots = await this.serviceRepository
            .createQueryBuilder('service')
            .leftJoin(ServiceSlot, 'serviceSlot', 'serviceSlot.service_id = service.id')
            .where('serviceSlot.state != :state OR serviceSlot.id IS NULL', { state: API.ServiceSlotStates.Pending })
            .getMany();

        const mockServiceSlots = generateServiceSlotMock(count, servicesWithoutPendingSlots, users);

        for (let mockSlot of mockServiceSlots) {
            await this.serviceSlotService.createServiceSlot(mockSlot as ServiceSlotCreationData);
        }
    }
}
