import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateMock } from 'database/mocks/user.mock';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeeder implements Seeder {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async seed(numberOfUsers: number): Promise<void> {
        const users = generateMock(numberOfUsers);
        await this.userRepository.save(users);
    }
}
