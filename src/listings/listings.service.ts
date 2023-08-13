import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { Repository } from 'typeorm';
import { DiabloItem } from '../diablo-items/diablo-item.entity';
import { DiabloItemService } from '../diablo-items/diablo-item.service';
import { ItemListing } from './listings.entity';

// TODO - move into sanctuaryteam/shared
export interface TradePostCreateData {
    item: Partial<DiabloItem>;
    picture: string;
    // Get this from the auth token?
    sellerId: number;
    reservePrice: number | null;
    minimumBid: number | null;
    duration: number;
    buyNowPrice: number | null;
}

@Injectable()
export class ListingsService {
    constructor(
        @InjectRepository(ItemListing) private readonly listingRepository: Repository<ItemListing>,
        private diabloItemService: DiabloItemService,
    ) {
    }

    async createItemAndListing(data: TradePostCreateData) {
        const manager = this.listingRepository.manager;

        return await manager.transaction(async manager => {
            // Make item first so we can get the ID
            const { id: diabloItemId } = await this.diabloItemService.createDiabloItem(manager, {
                ...data.item,
                image: data.picture,
            });
            const listing = manager.create(ItemListing, {
                ...omit(data, ['item', 'picture']),
                diabloItemId,
            });

            return await manager.save(listing);
        });
    }
}
