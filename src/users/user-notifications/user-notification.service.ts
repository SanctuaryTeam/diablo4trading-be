import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { ItemListingBid } from 'src/item-listings/item-listing-bids/item-listing-bid.entity';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { ServicesService } from 'src/services/services.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { User } from '../users.entity';

@Injectable()
export class UserNotificationService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Service) public readonly serviceRepository: Repository<Service>,
        @InjectRepository(ItemListing) public readonly itemListingRepository: Repository<ItemListing>,
    ) {
    }

    createQuery() {
        return new CustomQueryBuilder(
            this.userRepository.createQueryBuilder('user'),
        );
    }
}

class CustomQueryBuilder<T> {
    private readonly servicesService: ServicesService;
    private readonly itemListingRepository: Repository<ItemListing>;
    private queryBuilder: SelectQueryBuilder<T>;

    constructor(queryBuilder: SelectQueryBuilder<T>, private repository?: Repository<T>) {
        this.queryBuilder = queryBuilder;
    }

    async findItemListingById(
        itemListingRepository: Repository<ItemListing>,
        id: number,
    ): Promise<ItemListing | undefined> {
        return itemListingRepository.findOne({ where: { id } });
    }

    async findServiceById(serviceRepository: Repository<Service>, id: number): Promise<Service | undefined> {
        return serviceRepository.findOne({ where: { id } });
    }

    async getMany(): Promise<T[]> {
        return await this.queryBuilder.getMany();
    }

    // Usage example for slots
    async getSlotsByUserUuid(serviceSlotRepository: Repository<ServiceSlot>, userUuid?: string) {
        const serviceSlotQueryBuilder = serviceSlotRepository.createQueryBuilder('service_slot')
            .leftJoinAndSelect('service_slot.client', 'client')
            .leftJoinAndSelect('service_slot.serviceOwner', 'serviceOwner')
            .leftJoinAndSelect('service_slot.service', 'service')
            .where('client.uuid = :userUuid OR serviceOwner.uuid = :userUuid', { userUuid })
            .andWhere('service_slot.state != :ended AND service_slot.state != :rejected', {
                rejected: API.ServiceSlotStates.Rejected,
                ended: API.ServiceSlotStates.Ended,
            });

        const customQueryBuilder = new CustomQueryBuilder<ServiceSlot>(serviceSlotQueryBuilder, serviceSlotRepository);

        return await customQueryBuilder.getMany();
    }

    async getVouchesByUserUuid(
        userVouchRepository: Repository<UserVouch>,
        serviceRepository: Repository<Service>,
        serviceSlotRepository: Repository<ServiceSlot>,
        userUuid?: string,
    ): Promise<{ userVouch: UserVouch; reference: Service | ItemListing }[]> {
        let vouchList: { userVouch: UserVouch; reference: Service | ItemListing }[] = [];

        // Fetch UserVouch records
        const userVouches = await userVouchRepository.createQueryBuilder('user_vouch')
            .leftJoinAndSelect('user_vouch.recipient', 'recipient')
            .leftJoinAndSelect('user_vouch.author', 'author')
            .where('author.uuid = :userUuid', { userUuid })
            .getMany();

        for (const userVouch of userVouches) {
            let reference: ItemListing | Service;

            if (userVouch.referenceType === 'ItemListing') {
                const itemListing = await this.itemListingRepository.findOneBy({ id: userVouch.referenceId });
                reference = itemListing;
            } else if (userVouch.referenceType === 'Service') {
                const service = await serviceRepository.findOneBy({ id: userVouch.referenceId });
                const slots = await serviceSlotRepository.find({
                    where: [
                        { serviceOwnerUserId: userVouch.authorId, serviceId: service.id },
                        { clientUserId: userVouch.authorId, serviceId: service.id },
                    ],
                });

                if (slots && slots.length > 0) {
                    reference = service;
                }
            }

            if (reference) {
                vouchList.push({ userVouch, reference });
            }
        }

        return vouchList;
    }

    // Usage example for bids
    async getBidsByUserUuid(itemListingBidRepository: Repository<ItemListingBid>, userUuid?: string) {
        const itemListingBidQueryBuilder = itemListingBidRepository.createQueryBuilder('item_listing_bid')
            .leftJoinAndSelect('item_listing_bid.user', 'bid_user')
            .where('bid_user.uuid = :userUuid', { userUuid });

        const customQueryBuilder = new CustomQueryBuilder<ItemListingBid>(
            itemListingBidQueryBuilder,
            itemListingBidRepository,
        );

        return await customQueryBuilder.getMany();
    }
}
