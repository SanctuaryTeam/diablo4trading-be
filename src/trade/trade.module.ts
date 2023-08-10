import { Module } from '@nestjs/common';
import { DiabloItemModule } from 'src/diablo-items/diablo-item.module';
import { TradeController } from './trade.controller';

@Module({
    imports: [DiabloItemModule],
    controllers: [TradeController],
})
export class TradeModule {}
