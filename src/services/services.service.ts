import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ServiceResponseException } from '../common/exceptions';
import { Service } from './services.entity';

// Minutes
const MIN_BUMP_INTERVAL = 30;

export enum SERVICE_ERROR_CODES {
    SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
    BUMP_TOO_SOON = 'BUMP_TOO_SOON',
}

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service) private readonly serviceRepository: Repository<Service>,
    ) {
    }

    createQuery() {
        return new CustomQueryBuilder(
            this.serviceRepository.createQueryBuilder('service'),
        );
    }

    async countNotDeletedServices(): Promise<number> {
        return await this.serviceRepository.count({ where: { deleted: false } });
    }

    async createService(data: Partial<Service>): Promise<Service> {
        const service = this.serviceRepository.create(data);
        return await this.serviceRepository.save(service);
    }

    async updateService(id: number, dto: Partial<Service>): Promise<Service> {
        const existingService = await this.serviceRepository.findOneBy({ id });
        if (!existingService) {
            throw new ServiceResponseException(
                SERVICE_ERROR_CODES.SERVICE_NOT_FOUND,
                `Service with ID ${id} not found`,
            );
        }

        await this.serviceRepository.update(id, dto);
        return await this.serviceRepository.findOneBy({ id });
    }

    async deleteService(id: number): Promise<void> {
        await this.serviceRepository.delete(id);
    }

    async softDeleteService(id: number): Promise<void> {
        await this.serviceRepository.update(id, { deleted: true });
    }

    async undoSoftDeleteService(id: number): Promise<void> {
        await this.serviceRepository.update(id, { deleted: false });
    }

    async bumpService(id: number): Promise<void> {
        const service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) {
            throw new ServiceResponseException(
                SERVICE_ERROR_CODES.SERVICE_NOT_FOUND,
                `Service with ID ${id} not found`,
            );
        }

        const nextBumpAvailableTime = new Date(Date.now() - MIN_BUMP_INTERVAL * 60 * 1000);
        if (service.bumpedAt > nextBumpAvailableTime) {
            throw new ServiceResponseException(
                SERVICE_ERROR_CODES.BUMP_TOO_SOON,
                `Service was bumped less than ${MIN_BUMP_INTERVAL} minutes ago`,
            );
        }

        await this.serviceRepository.update(id, { bumpedAt: new Date() });
    }
}

class CustomQueryBuilder {
    private queryBuilder: SelectQueryBuilder<Service>;

    constructor(queryBuilder: SelectQueryBuilder<Service>) {
        this.queryBuilder = queryBuilder;
    }

    searchById(id: number): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere('service.id = :id', { id });
        return this;
    }

    searchByTitle(title?: string): CustomQueryBuilder {
        if (title) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'service.title LIKE :title',
                { title: `%${title}%` },
            );
        }
        return this;
    }

    searchByTags(tags?: number): CustomQueryBuilder {
        if (typeof tags === 'number') {
            this.queryBuilder = this.queryBuilder.orWhere(
                `(service.tags & :tags) = :tags`,
                { tags },
            );
        }
        return this;
    }

    includeSlots(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('service.slots', 'service_slot');
        return this;
    }

    paginate(offset?: number, limit?: number): CustomQueryBuilder {
        if (typeof offset === 'number') {
            this.queryBuilder = this.queryBuilder.skip(offset);
        }
        if (typeof limit === 'number') {
            this.queryBuilder = this.queryBuilder.take(limit);
        }
        return this;
    }

    orderBy(
        field: keyof Service,
        order: 'ASC' | 'DESC' = 'DESC',
    ): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.orderBy(`service.${field}`, order);
        return this;
    }

    getMany(): Promise<Service[]> {
        return this.queryBuilder.getMany();
    }

    getOne(): Promise<Service> {
        return this.queryBuilder.getOne();
    }

    searchByDeleted(deleted?: boolean): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            `service.deleted = :deleted`,
            { deleted },
        );        return this;
    }
}
