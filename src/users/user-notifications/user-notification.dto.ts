import { API } from '@sanctuaryteam/shared';
import { ItemListingBid } from 'src/item-listings/item-listing-bids/item-listing-bid.entity';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';
import { fromEntity as serviceSlotDtoFromEntity } from './../../services/service-slots/service-slots.dto';
import { ServiceSlot } from './../../services/service-slots/service-slots.entity';
import { fromEntity as userVouchFromEntity, UserVouchDto } from './../user-vouch/user-vouch-dto';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { fromEntity as userDtoFromEntity } from './../user.dto';
import { User } from '../users.entity';

export interface UserNotificationDto {
    id: string;
    recipient: API.UserDto;
    recipientId?: string;
    reference: API.ServiceSlotDto | UserVouchDto; // | API.ItemListingBidDto
    referenceId?: string;
    referenceType: string;
    message: string;
    createdAt: Date;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

const referenceNotification = (
    entity: ServiceSlot | UserVouch | ItemListingBid,
    notification: UserNotificationDto,
    options: FromEntityOptions = {},
    client?: User,
    vouchReference?: Service | ItemListing,
): UserNotificationDto => {
    const { hideDiscriminator } = options;

    // ServiceSlot Related Notifications
    if (entity instanceof ServiceSlot) {
        const clientDto = client && userDtoFromEntity(client, { hideDiscriminator });
        notification.referenceType = 'ServiceSlot';
        notification.id = entity.uuid;
        switch (entity.state) {
            case API.ServiceSlotStates.Accepted:
                if (notification.recipient.id == entity.client.uuid) {
                    notification.message = 'Your purhase was approved. Please mark when the service has ended.';
                } else {
                    notification.message = 'Please mark when the service has ended.';
                }
                break;
            case API.ServiceSlotStates.Rejected:
                break;
            case API.ServiceSlotStates.Ended:
                return null;
            default: // API.ServiceSlotStates.Pending
                if (notification.recipient.id == entity.serviceOwner.uuid) {
                    notification.message = `User with a score of ${clientDto.vouchScore} purchased your service.`;
                }
                break;
        }
        return notification;
    } // UserVouch Related Notifications
    else if (entity instanceof UserVouch) {
        notification.referenceType = 'UserVouch';
        notification.id = entity.uuid;

        // const recipient = entity.recipient;
        const author = entity.author;
        const reference = vouchReference;
        switch (entity.state) {
            case 1:
                break;
            default: // Default Open (0)
                if (reference instanceof Service) {
                    if (author.id == reference.userId) {
                        if (
                            notification.recipientId == author.uuid
                        ) {
                            notification.message = `Please rate the client.`;
                        } else {
                            notification.message = `Please rate the service.`;
                        }
                    }
                } else {
                    if (author.id == reference.sellerId) {
                        notification.message = `Please rate the client.`;
                    } else {
                        notification.message = `Please rate the item.`;
                    }
                }
                break;
        }
        return notification;
    }
};

export const fromEntity = (
    entity: UserVouch | ServiceSlot | ItemListingBid,
    recipient: User,
    options: FromEntityOptions = {},
    reference?: Service | ItemListing,
): UserNotificationDto => {
    const {
        client,
    } = entity instanceof ServiceSlot && entity;

    const {} = entity instanceof UserVouch && entity;

    const user = recipient && userDtoFromEntity(recipient);
    const referenceEntity = ((entity instanceof UserVouch && reference instanceof Service)
        && userVouchFromEntity(entity, reference, { hideDiscriminator: false }))
        || entity instanceof ServiceSlot
            && serviceSlotDtoFromEntity(entity, { hideDiscriminator: entity.state === API.ServiceSlotStates.Pending });

    let notification: UserNotificationDto = {
        id: '',
        recipient: user,
        recipientId: recipient.uuid,
        reference: referenceEntity,
        referenceId: referenceEntity.id,
        referenceType: 'unknown',
        message: 'null',
        createdAt: new Date(),
    };

    let fullNotification: UserNotificationDto | null;

    try {
        fullNotification = referenceNotification(entity, notification, options, client, reference ?? undefined);

        if (fullNotification !== null) {
            return {
                id: fullNotification.id,
                recipient: fullNotification.recipient,
                recipientId: fullNotification.recipientId,
                reference: fullNotification.reference,
                referenceType: fullNotification.referenceType,
                referenceId: fullNotification.referenceId,
                message: fullNotification.message,
                createdAt: fullNotification.createdAt,
            };
        } else {
            // Handle the case where referenceNotification returns null.
            // You can return a default value or take appropriate action.
            // console.log("Info: " + JSON.stringify(fullNotification));
            console.error('Reference notification is null.');
            // Return a default value or throw an error if necessary.
        }
    } catch (error) {
        // Handle any errors that might occur during the referenceNotification call.
        // You can log the error or take appropriate action as needed.
        console.error('Error while creating full notification:', error);
        // Throw the error if necessary.
    }
};
