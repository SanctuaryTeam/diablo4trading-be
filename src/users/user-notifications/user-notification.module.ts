import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItemAffix } from 'src/diablo-items/diablo-item-affix.entity';
import { DiabloItem } from 'src/diablo-items/diablo-item.entity';
import { DiabloItemService } from 'src/diablo-items/diablo-item.service';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { ItemListingsService } from 'src/item-listings/item-listings.service';
import { ServicesService } from 'src/services/services.service';
import { UserVouchCalculation } from 'src/users/user-vouch/user-vouch-calculation.entity';
import { UserVouch } from 'src/users/user-vouch/user-vouch.entity';
import { UserVouchService } from 'src/users/user-vouch/user-vouch.service';
import { ServiceSlot } from '../../services/service-slots/service-slots.entity';
import { Service } from '../../services/services.entity';
import { User } from '../users.entity';
import { UsersService } from '../users.service';
import { UserNotificationController } from './user-notification.controller';
import { UserNotificationService } from './user-notification.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([DiabloItemAffix], 'memory'),
        TypeOrmModule.forFeature([
            Service,
            ServiceSlot,
            User,
            UserVouch,
            UserVouchCalculation,
            ItemListing,
            DiabloItem,
            DiabloItemAffix,
        ]),
    ],
    providers: [
        UserNotificationService,
        UserVouchService,
        UsersService,
        ServicesService,
        ItemListingsService,
        DiabloItemService,
    ],
    controllers: [UserNotificationController],
})
export class UserNotificationModule {}
