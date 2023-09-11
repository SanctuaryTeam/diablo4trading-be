import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateMock } from 'database/mocks/service.mock';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceSeeder implements Seeder {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    ) {}

    async seed(count: number): Promise<void> {
        const users = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.services', 'service')
            .groupBy('user.id')
            .having('COUNT(service.id) < 4')
            .getMany();

        const services = generateMock(count, users);
        await this.serviceRepository.save(services);
    }
}
