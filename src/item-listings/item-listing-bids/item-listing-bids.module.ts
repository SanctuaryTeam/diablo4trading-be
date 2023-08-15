import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemListingBidsService } from './item-listing-bid.service';
import { ItemListingBid } from './item-listing-bid.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemListingBid]),
    ],
    providers: [ ItemListingBidsService],
    exports: [ItemListingBidsService],
})
export class ItemListingBidsModule {}
