import { faker } from '@faker-js/faker';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { GenerateMock } from './mock.interface';
import { API } from '@sanctuaryteam/shared';

export const generateMock: GenerateMock<ServiceSlot> = (count: number, services: Service[], users: User[]) => {
    const serviceSlots: Partial<ServiceSlot>[] = [];
    
    for (let i = 0; i < count && i < services.length; i++) {
        const selectedService = services[i];
        let randomUser = faker.helpers.arrayElement(users);
        
        // Ensure the random user is not the service owner
        while (randomUser.id === selectedService.userId) {
            randomUser = faker.helpers.arrayElement(users);
        }

        const serviceSlot: Partial<ServiceSlot> = {
            serviceId: selectedService.id,
            serviceOwnerUserId: selectedService.userId,
            clientUserId: randomUser.id,
        };

        serviceSlots.push(serviceSlot);
    }

    return serviceSlots;
};
