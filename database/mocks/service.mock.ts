// service.mock.ts

import { Game } from '@diablosnaps/common';
import { faker } from '@faker-js/faker';
import { API } from '@sanctuaryteam/shared';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { GenerateMock } from './mock.interface';

const generateRandomTags = (): number =>
    Object.values(API.TAGS).reduce((result, tag) => faker.datatype.boolean() ? result |= tag : result);

export const generateMock: GenerateMock<Service> = (count: number, users: User[]) => {
    const services: Partial<Service>[] = [];

    for (let i = 0; i < count; i++) {
        const service: Partial<Service> = {
            uuid: faker.string.uuid(),
            realmType: faker.helpers.arrayElement(Object.values(Game.ServerType)),
            title: faker.commerce.productName(),
            content: faker.commerce.productDescription(),
            userId: faker.helpers.arrayElement(users).id,
            tags: generateRandomTags(),
            maxAcceptedSlots: faker.number.int({ min: 1, max: 4 }),
        };

        services.push(service);
    }

    return services;
};
