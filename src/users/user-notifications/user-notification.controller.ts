import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RequestModel } from 'src/auth/request.model';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { ServicesService } from 'src/services/services.service';
import { Repository } from 'typeorm';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { User } from '../users.entity';
import { fromEntity as userNotificationFromEntity, UserNotificationDto } from './user-notification.dto';
import { UserNotificationService } from './user-notification.service';

@UseGuards(JwtAuthGuard)
@Controller('users/notifications')
export class UserNotificationController {
    constructor(
        @InjectRepository(Service) public readonly serviceRepository: Repository<Service>,
        @InjectRepository(ServiceSlot) public readonly serviceSlotRepository: Repository<ServiceSlot>,
        @InjectRepository(UserVouch) public readonly userVouchRepository: Repository<UserVouch>,
        @InjectRepository(User) public readonly userRepository: Repository<User>,
        private readonly userNotificationService: UserNotificationService,
    ) {}

    @Get('/')
    async search(@Request() req: RequestModel): Promise<UserNotificationDto[]> {
        const { uuid } = req.user;

        const serviceSlotsPromise: Promise<UserNotificationDto[]> = this.userNotificationService
            .createQuery()
            .getSlotsByUserUuid(this.serviceSlotRepository, uuid)
            .then(slots =>
                slots.map(slot =>
                    userNotificationFromEntity(slot, req.user, {
                        hideDiscriminator: slot.state === API.ServiceSlotStates.Pending,
                    })
                )
            );

        const userVouchesPromise: Promise<UserNotificationDto[]> = this.userNotificationService
            .createQuery()
            .getVouchesByUserUuid(this.userVouchRepository, this.serviceRepository, this.serviceSlotRepository, uuid)
            .then(userVouches =>
                userVouches.map(vouch =>
                    userNotificationFromEntity(vouch.userVouch, req.user, { hideDiscriminator: false }, vouch.reference)
                )
            );

        const [serviceSlots, userVouches] = await Promise.all([serviceSlotsPromise, userVouchesPromise]);

        const combinedResults = [...serviceSlots, ...userVouches];

        return combinedResults;
    }
}
