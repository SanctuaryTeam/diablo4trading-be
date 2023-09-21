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
        const selectedColumns = [
            'user.id',
            'user.discord_id',
            'user.discord_name',
            'user.battle_net_tag',
            'user.email',
        ];

        const query = this.userRepository.createQueryBuilder('user')
            .select(selectedColumns)
            .leftJoin('user.services', 'service');

        selectedColumns.forEach(column => query.addGroupBy(column));

        const users = await query
            .having('COUNT(service.id) < 4')
            .getMany();

        const services = generateMock(count, users);
        await this.serviceRepository.save(services);
    }
}
