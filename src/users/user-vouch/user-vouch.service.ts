import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { CloseUserVouchDto } from './close-user-vouch.dto';
import { UserVouchCalculation } from './user-vouch-calculation.entity';
import { UserVouchState } from './user-vouch-state.enum';
import { UserVouch } from './user-vouch.entity';

@Injectable()
export class UserVouchService {
    constructor(
        @InjectRepository(UserVouch) private userVouchRepository: Repository<UserVouch>,
        @InjectRepository(ItemListing) private itemListingRepository: Repository<ItemListing>,
        @InjectRepository(Service) private serviceRepository: Repository<Service>,
        @InjectRepository(UserVouchCalculation) private readonly userVouchCalculationRepository: Repository<
            UserVouchCalculation
        >,
    ) {}

    async getOpenVouches(user: User): Promise<UserVouch[]> {
        return await this.userVouchRepository.find({
            where: {
                author: user,
                state: UserVouchState.Open,
            },
        });
    }

    private async referenceExists(referenceType: 'ItemListing' | 'Service', referenceId: number): Promise<boolean> {
        switch (referenceType) {
            case 'ItemListing':
                return this.itemListingRepository.exist({ where: { id: referenceId } });
            case 'Service':
                return this.serviceRepository.exist({
                    where: { id: referenceId },
                });
            default:
                return false;
        }
    }

    async createVouch(
        referenceType: 'ItemListing' | 'Service',
        referenceId: number,
        recipient: User,
        author: User,
    ): Promise<UserVouch> {
        if (!await this.referenceExists(referenceType, referenceId)) {
            throw new NotFoundException(`The reference ${referenceType} with ID ${referenceId} does not exist`);
        }

        const userVouch = this.userVouchRepository.create({
            referenceType,
            referenceId,
            recipient,
            author,
            state: UserVouchState.Open,
        });

        return this.userVouchRepository.save(userVouch);
    }

    async updateUserVouchCalculations(updatedVouch: UserVouch): Promise<void> {
        const recipientId = updatedVouch.recipientId;

        // Get vouchScore
        const vouchScore = await this.userVouchRepository.createQueryBuilder('uv')
            .select('SUM(CASE WHEN uv.isPositive THEN 1 ELSE -1 END)', 'score')
            .where('uv.recipientId = :recipientId', { recipientId })
            .andWhere('uv.state = :state', { state: UserVouchState.Closed })
            .getRawOne();

        // Get vouchRating
        const vouchRating = await this.userVouchRepository.createQueryBuilder('uv')
            .select('AVG(uv.rating)', 'averageRating')
            .where('uv.recipientId = :recipientId', { recipientId })
            .andWhere('uv.state = :state', { state: UserVouchState.Closed })
            .getRawOne();

        // Update or insert UserVouchCalculation
        const existingCalculation = await this.userVouchCalculationRepository.findOne({
            where: { userId: recipientId },
        });

        if (existingCalculation) {
            existingCalculation.score = vouchScore?.score || 0;
            existingCalculation.rating = vouchRating?.averageRating || 0;
            await this.userVouchCalculationRepository.save(existingCalculation);
        } else {
            const newCalculation = this.userVouchCalculationRepository.create({
                userId: recipientId,
                score: vouchScore?.score || 0,
                rating: vouchRating?.averageRating || 0,
            });

            await this.userVouchCalculationRepository.save(newCalculation);
        }
    }

    async closeVouch(data: CloseUserVouchDto, user: User): Promise<UserVouch> {
        if (data.rating < 0 || data.rating > 10) {
            throw new BadRequestException('Rating should be between 0 and 10');
        }

        const existingVouch = await this.userVouchRepository.findOne({ where: { id: data.id } });

        if (!existingVouch) {
            throw new NotFoundException('User Vouch not found');
        }

        if (existingVouch.state !== UserVouchState.Open) {
            throw new BadRequestException('Service should be open');
        }

        if (existingVouch.authorId !== user.id) {
            throw new BadRequestException('You cannot close a user vouch you do not own');
        }

        Object.assign(existingVouch, {
            state: UserVouchState.Closed,
            rating: data.rating,
            isPositive: data.isPositive,
            description: data.description,
        });

        await this.updateUserVouchCalculations(existingVouch);
        return this.userVouchRepository.save(existingVouch);
    }
}
