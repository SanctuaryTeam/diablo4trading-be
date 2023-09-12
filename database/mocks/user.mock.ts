// user.mock.ts

import { faker } from '@faker-js/faker';
import { IUser } from 'src/users/user.interface';
import { GenerateMock } from './mock.interface';

export const generateMock: GenerateMock<IUser> = (count: number) => {
    const users: Partial<IUser>[] = [];

    for (let i = 0; i < count; i++) {
        const user: Partial<IUser> = {
            discordId: '1' + faker.string.numeric(12),
            discordName: faker.internet.userName() + '#' + faker.number.int({ min: 1000, max: 9999 }),
            battleNetTag: faker.internet.userName() + '#' + faker.number.int({ min: 1000, max: 9999 }),
            email: faker.internet.email(),
        };

        users.push(user);
    }

    return users;
};
