import { fromEntity as userDtoFromEntity, UserDto } from '../users/user.dto';
import { fromEntity as serviceSlotDtoFromEntity, ServiceSlotDto } from './service-slots/service-slots.dto'; // Update this path as needed
import { Service } from './services.entity';

export interface ServiceDto {
    id: number;
    realmType: string;
    title: string;
    content: string;
    user: UserDto;
    userId: number;
    tags: number;
    maxAcceptedSlots: number;
    slots: ServiceSlotDto[];
    bumpedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    deleted: boolean;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: Service, options: FromEntityOptions = {}): ServiceDto => {
    const {
        id,
        realmType,
        title,
        content,
        userId,
        tags,
        maxAcceptedSlots,
        slots,
        bumpedAt,
        createdAt,
        updatedAt,
        updatedBy,
        deleted,
        user,
    } = entity;

    const { hideDiscriminator } = options;

    const userDto = user ? userDtoFromEntity(user, { hideDiscriminator }) : undefined;
    const serviceSlotsDto: ServiceSlotDto[] = [];

    Array.isArray(slots)
        && slots.forEach(slot => serviceSlotsDto.push(serviceSlotDtoFromEntity(slot, { hideDiscriminator })));

    return {
        id,
        realmType,
        title,
        content,
        userId,
        tags,
        maxAcceptedSlots,
        slots: serviceSlotsDto,
        bumpedAt,
        createdAt,
        updatedAt,
        updatedBy,
        deleted,
        user: userDto,
    };
};
