import { API } from '@sanctuaryteam/shared';
import { fromEntity as serviceSlotDtoFromEntity } from 'src/services/service-slots/service-slots.dto';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { User } from '../users.entity';
import { fromEntity, UserNotificationDto } from './user-notification.dto';

describe('User Notifications', () => {
    const user = new User();
    user.id = 1;
    // Fun thing to look at: comment this out and watch things break
    user.battleNetTag = 'test';
    user.discordId = '395248731257044992';
    user.discordName = 'sparkyonyx';
    user.email = 'dennis@digitalflavors.net';
    user.uuid = '871f2e77-28cb-4e00-b6e4-7bece27ff04b';
    let serviceSlot: ServiceSlot;

    beforeEach(() => {
        serviceSlot = new ServiceSlot();
        serviceSlot.uuid = 'some-uuid';
        serviceSlot.state = API.ServiceSlotStates.Pending;
        serviceSlot.client = user;
        serviceSlot.serviceOwner = user;
        // Fun thing to look at: comment this out and watch things break
        serviceSlot.updatedAt = new Date();
    });

    describe('fromEntity', () => {
        it('should return a UserNotificationDto object', () => {
            const result: UserNotificationDto = fromEntity(serviceSlot, user, { hideDiscriminator: false });
            const referenceCheck: API.ServiceSlotDto = serviceSlotDtoFromEntity(serviceSlot, {
                hideDiscriminator: false,
            });
            expect(result).toBeDefined();
            expect(result.id).toEqual(serviceSlot.uuid);
            expect(result.recipientId).toEqual(user.uuid);
            expect(result.referenceType).toEqual('ServiceSlot');
            expect(result.referenceId).toEqual(serviceSlot.uuid);
            expect(result.reference).toEqual(referenceCheck);
            expect(result.message).toEqual('User with a score of 0 purchased your service.');
        });
    });
});
