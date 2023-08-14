import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItemModule } from 'src/diablo-items/diablo-item.module';
import { ListingsController } from './listings.controller';
import { ItemListing } from './listings.entity';
import { ListingsService } from './listings.service';

@Module({
    imports: [
        DiabloItemModule,
        TypeOrmModule.forFeature([ItemListing]),
    ],
    controllers: [ListingsController],
    providers: [ListingsService],
})
export class ListingsModule {}
