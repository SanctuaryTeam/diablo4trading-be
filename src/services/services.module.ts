import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { UserVouchCalculation } from 'src/users/user-vouch/user-vouch-calculation.entity';
import { UserVouch } from 'src/users/user-vouch/user-vouch.entity';
import { UserVouchService } from 'src/users/user-vouch/user-vouch.service';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { ServiceSlot } from './service-slots/service-slots.entity';
import { ServiceSlotsService } from './service-slots/service-slots.service';
import { ServicesController } from './services.controller';
import { Service } from './services.entity';
import { ServicesService } from './services.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Service, ServiceSlot, User, UserVouch, UserVouchCalculation, ItemListing]),
    ],
    providers: [ServicesService, ServiceSlotsService, UsersService, UserVouchService],
    controllers: [ServicesController],
})
export class ServicesModule {}
