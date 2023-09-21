import { API } from '@sanctuaryteam/shared';
import { fromEntity as userDtoFromEntity, UserDto } from '../../users/user.dto';
import { fromEntity as serviceDtoFromEntity, ServiceDto } from '../service.dto';
import { ServiceSlot } from './service-slots.entity';

export interface ServiceSlotDto {
    id: number;
    state: API.ServiceSlotStates;
    service: ServiceDto;
    serviceId?: number;
    serviceOwner: UserDto;
    serviceOwnerUserId: number;
    client: UserDto;
    clientUserId: number;
    updatedAt: Date;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: ServiceSlot, options: FromEntityOptions = {}): ServiceSlotDto => {
    const {
        id,
        state,
        service,
        serviceId,
        serviceOwner,
        serviceOwnerUserId,
        client,
        clientUserId,
        updatedAt,
    } = entity;

    const { hideDiscriminator } = options;

    const clientDto = client ? userDtoFromEntity(client, { hideDiscriminator }) : undefined;
    const serviceOwnerDto = serviceOwner ? userDtoFromEntity(serviceOwner, { hideDiscriminator }) : undefined;
    const serviceDto = service ? serviceDtoFromEntity(service, { hideDiscriminator }) : undefined;

    return {
        id,
        state,
        updatedAt,
        client: clientDto,
        clientUserId,
        serviceOwner: serviceOwnerDto,
        serviceOwnerUserId,
        service: serviceDto,
        serviceId,
    };
};
