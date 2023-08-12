import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { ServiceSlot } from './service-slots/service-slots.entity';
import { ServiceSlotsService } from './service-slots/service-slots.service';
import { ServicesController } from './services.controller';
import { Service } from './services.entity';
import { ServicesService } from './services.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Service, ServiceSlot, User]),
    ],
    providers: [ServicesService, ServiceSlotsService, UsersService],
    controllers: [ServicesController],
})
export class ServicesModule {}
