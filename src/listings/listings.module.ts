import { Module } from '@nestjs/common';
import { DiabloItemModule } from 'src/diablo-items/diablo-item.module';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';

@Module({
    imports: [DiabloItemModule],
    controllers: [ListingsController],
    providers: [ListingsService],
})
export class ListingsModule {}
