import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItemModule } from 'src/diablo-items/diablo-item.module';
import { ItemListingBid } from './item-listing-bid.entity';
import { ItemListing } from './item-listing.entity';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
    imports: [
        DiabloItemModule,
        TypeOrmModule.forFeature([ItemListing, ItemListingBid]),
    ],
    controllers: [ListingsController],
    providers: [ListingsService],
})
export class ListingsModule {}
