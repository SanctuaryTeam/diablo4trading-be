import { faker } from '@faker-js/faker';
import { API } from '@sanctuaryteam/shared';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { GenerateMock } from './mock.interface';

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
            uuid: faker.string.uuid(),
            serviceId: selectedService.id,
            serviceOwnerUserId: selectedService.userId,
            clientUserId: randomUser.id,
        };

        serviceSlots.push(serviceSlot);
    }

    return serviceSlots;
};
