import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSlotsController } from './service-slots.controller';
import { ServiceSlotsCronService } from './service-slots.cron';
import { ServiceSlot } from './service-slots.entity';
import { ServiceSlotsService } from './service-slots.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceSlot])],
    providers: [ServiceSlotsService, ServiceSlotsCronService],
    controllers: [ServiceSlotsController],
})
export class ServiceSlotsModule {}
