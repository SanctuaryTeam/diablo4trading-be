// user.mock.ts

import { faker } from '@faker-js/faker';
import { User } from 'src/users/users.entity';
import { GenerateMock } from './mock.interface';

export const generateMock: GenerateMock<User> = (count: number) => {
    const users: Partial<User>[] = [];

    for (let i = 0; i < count; i++) {
        const user: Partial<User> = {
            discordId: '1' + faker.string.numeric(12),
            discordName: faker.internet.userName() + '#' + faker.number.int({ min: 1000, max: 9999 }),
            battleNetTag: faker.internet.userName() + '#' + faker.number.int({ min: 1000, max: 9999 }),
            email: faker.internet.email(),
        };

        users.push(user);
    }

    return users;
};
