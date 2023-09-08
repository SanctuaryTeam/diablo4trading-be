import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';
import { Repository } from 'typeorm';
import { User } from '../users.entity';
import { CloseUserVouchDto } from './close-user-vouch.dto';
import { UserVouchState } from './user-vouch-state.enum';
import { UserVouch } from './user-vouch.entity';

@Injectable()
export class UserVouchService {
    constructor(
        @InjectRepository(UserVouch) private userVouchRepository: Repository<UserVouch>,
        @InjectRepository(ItemListing)
         private itemListingRepository: Repository<ItemListing>,
        @InjectRepository(Service)
         private serviceRepository: Repository<Service>,
    ) {}

    async getOpenVouches(user: User): Promise<UserVouch[]> {
        return await this.userVouchRepository.find({
            where: {
                author: user,
                state: UserVouchState.Open,
            },
        });
    }

    async createVouch(
        referenceType: 'ItemListing' | 'Service',
        referenceId: number,
        recipient: User,
        author: User,
    ): Promise<UserVouch> {
        let referenceExists = false;

        if (referenceType === 'ItemListing') {
            referenceExists = !!(await this.itemListingRepository.findOne({ where: { id: referenceId } }));
        } else if (referenceType === 'Service') {
            referenceExists = !!(await this.serviceRepository.findOne({ where: { id: referenceId } }));
        }

        if (!referenceExists) {
            throw new Error(`The reference ${referenceType} with ID ${referenceId} does not exist`);
        }

        const userVouch = new UserVouch();
        userVouch.referenceType = referenceType;
        userVouch.referenceId = referenceId;
        userVouch.recipient = recipient;
        userVouch.author = author;
        userVouch.state = UserVouchState.Open;

        return await this.userVouchRepository.save(userVouch);
    }

    async closeVouch(data: CloseUserVouchDto, user: User): Promise<UserVouch> {
        // Ensure rating is between 0 and 10
        if (data.rating < 0 || data.rating > 10) {
            throw new Error('Rating should be between 0 and 10');
        }

        const existingVouch = await this.userVouchRepository.findOne(
            { where: { id: data.id } },
        );

        if (!existingVouch) {
            throw new Error('User Vouch not found');
        }

        // Ensure the service is open
        if (existingVouch.state !== UserVouchState.Open) {
            throw new Error('Service should be open');
        }

        // Ensure the author Id matches the authenticated user's Id
        if (existingVouch.authorId !== user.id) {
            throw new Error('You cannot close a user vouch you do not own');
        }

        // Set the state to Closed
        existingVouch.state = UserVouchState.Closed;
        existingVouch.rating = data.rating;
        existingVouch.isPositive = data.isPositive;
        existingVouch.description = data.description;

        return await this.userVouchRepository.save(existingVouch);
    }
}
