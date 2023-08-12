import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSlotsController } from './service-slots.controller';
import { ServiceSlot } from './service-slots.entity';
import { ServiceSlotsService } from './service-slots.service';

@Module({
    imports: [TypeOrmModule.forFeature([ServiceSlot])],
    providers: [ServiceSlotsService],
    controllers: [ServiceSlotsController],
})
export class ServiceSlotsModule {}
