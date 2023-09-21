// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

// TODO : ANDREW : Look at moving this to 'Share' per PR Request
export enum USER_ERROR_CODES {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
}

export const USER_ERROR_MESSAGES = {
    USER_NOT_FOUND: (userId: number) =>
        `User with ID ${userId} not found`,
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async findById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findOne(discordId: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { discordId } });
    }

    async findOrCreateUser(profile: Partial<User>): Promise<User> {
        const { discordName, discordId, email, battleNetTag } = profile;

        // Check if the user already exists based on Discord ID
        let user = await this.userRepository.findOne({ where: { discordId } });

        if (!user) {
            // If the user doesn't exist, create a new user with the provided information
            user = this.userRepository.create({
                discordName,
                discordId,
                email,
                battleNetTag, // Add other relevant properties here
            });

            await this.userRepository.save(user);
        }

        return user;
    }
}
