import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItemModule } from 'src/diablo-items/diablo-item.module';
import { ItemListingBid } from './item-listing-bids/item-listing-bid.entity';
import { ItemListingBidsService } from './item-listing-bids/item-listing-bid.service';
import { ItemListing } from './item-listing.entity';
import { ItemListingsController } from './item-listings.controller';
import { ItemListingsService } from './item-listings.service';

@Module({
    imports: [
        DiabloItemModule,
        TypeOrmModule.forFeature([ItemListing, ItemListingBid]),
    ],
    controllers: [ItemListingsController],
    providers: [ItemListingsService, ItemListingBidsService],
})
export class ItemListingsModule {}
