import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { DiabloItemModule } from './diablo-items/diablo-item.module';
import { ServiceSlotsModule } from './services/service-slots/service-slots.module';
import { ServicesModule } from './services/services.module';
import { TradeModule } from './trade/trade.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        DiabloItemModule,
        TradeModule,
        ServicesModule,
        ServiceSlotsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
