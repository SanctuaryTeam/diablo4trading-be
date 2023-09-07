import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemListingBid } from './item-listing-bid.entity';
import { ItemListingBidsService } from './item-listing-bid.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemListingBid]),
    ],
    providers: [ItemListingBidsService],
    exports: [ItemListingBidsService],
})
export class ItemListingBidsModule {}
