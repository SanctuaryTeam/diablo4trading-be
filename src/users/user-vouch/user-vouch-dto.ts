import { API } from '@sanctuaryteam/shared';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';
import { fromEntity as serviceDtoFromEntity } from './../../services/service.dto';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { fromEntity as userDtoFromEntity } from './../user.dto';
import { UserVouchState } from './user-vouch-state.enum';

export interface UserVouchDto {
    id: string;
    recipient: API.UserDto;
    recipientId: string;
    author: API.UserDto;
    authorId: string;
    reference: API.ServiceDto | ItemListing; // || API.ItemListingDto
    referenceId: string;
    referenceType: string;
    isPositive: boolean;
    rating: number;
    state: UserVouchState;
    description: string;
    createdAt: Date;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: UserVouch, reference: Service, options: FromEntityOptions = {}): UserVouchDto => {
    const {
        uuid,
        recipient,
        author,
        state,
        referenceType,
        isPositive,
        rating,
        description,
        createdAt,
    } = entity;

    const { hideDiscriminator } = options;
    const recipientDto = recipient && userDtoFromEntity(recipient, { hideDiscriminator });
    const authorDto = author && userDtoFromEntity(author, { hideDiscriminator });
    const referenceDto = serviceDtoFromEntity(reference, { hideDiscriminator: false });

    return {
        id: uuid,
        recipient: recipientDto,
        recipientId: recipientDto?.id,
        author: authorDto,
        authorId: authorDto ? authorDto.id : author?.uuid,
        reference: referenceDto,
        referenceId: referenceDto ? referenceDto.id : reference?.uuid,
        referenceType,
        description,
        rating,
        state,
        createdAt,
        isPositive,
    };
};
