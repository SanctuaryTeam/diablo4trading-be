import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVouch } from './user-vouch.entity';
import { UserVouchState } from './user-vouch-state.enum';
import { User } from '../users.entity';
import { CloseUserVouchDto } from './close-user-vouch.dto';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';

@Injectable()
export class UserVouchService {
    constructor(
        @InjectRepository(UserVouch) 
        private userVouchRepository: Repository<UserVouch>,
        @InjectRepository(ItemListing) // Assuming you have an entity named ItemListing
        private itemListingRepository: Repository<ItemListing>,
        @InjectRepository(Service) // Assuming you have an entity named Service
        private serviceRepository: Repository<Service>
    ) {}

    async createVouch(referenceType: 'ItemListing' | 'Service', referenceId: number, recipient: User, author: User): Promise<UserVouch> {
        let referenceExists = false;

        if (referenceType === 'ItemListing') {
            referenceExists = !!(await this.itemListingRepository.findOne({ where: { id: referenceId }}));
        } else if (referenceType === 'Service') {
            referenceExists = !!(await this.serviceRepository.findOne({ where: { id: referenceId }}));
        }

        if (!referenceExists) {
            throw new Error(`The reference ${referenceType} with ID ${referenceId} does not exist`);
        }

        const userVouch = new UserVouch();
        userVouch.referenceType = referenceType;
        userVouch.referenceId = referenceId;
        userVouch.recipient = recipient;
        userVouch.author = author;
        userVouch.state = UserVouchState.Open; // Assuming you want the initial state to be open

        return await this.userVouchRepository.save(userVouch);
    }

    async closeVouch(data: CloseUserVouchDto, user: User): Promise<UserVouch> {
        // Ensure rating is between 0 and 10
        if (data.rating < 0 || data.rating > 10) {
            throw new Error("Rating should be between 0 and 10");
        }

        const existingVouch = await this.userVouchRepository.findOne(
            { where: { id: data.id } });

        if (!existingVouch) {
            throw new Error("User Vouch not found");
        }

        // Ensure the service is open
        if (existingVouch.state !== UserVouchState.Open) {
            throw new Error("Service should be open");
        }

        // Ensure the author_id matches the authenticated user's ID
        if (existingVouch.authorId !== user.id) {
            throw new Error("You cannot close a user vouch you do not own");
        }

        // Set the state to Closed
        existingVouch.state = UserVouchState.Closed;
        existingVouch.rating = data.rating;
        existingVouch.isPositive = data.isPositive;
        existingVouch.description = data.description;

        return await this.userVouchRepository.save(existingVouch);
    }
}
