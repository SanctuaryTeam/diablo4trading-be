import { UserDto } from '../users/user.dto';
import { ServiceSlot } from './service-slots/service-slots.entity'; // Update this path as needed
import { IService } from './service.interface'; // Assuming you've named your interface IService
import { Service } from './services.entity';

export class ServiceDto implements IService {
    id: number;
    realmType: string;
    title: string;
    content: string;
    user: UserDto;
    userId: number;
    tags: number;
    maxAcceptedSlots: number;
    slots: ServiceSlot[]; // Consider creating a ServiceSlotDto if needed
    bumpedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    deleted: boolean;

    static fromEntity(entity: Service): ServiceDto {
        const dto = new ServiceDto();
        dto.id = entity.id;
        dto.realmType = entity.realmType;
        dto.title = entity.title;
        dto.content = entity.content;
        dto.userId = entity.userId;
        dto.tags = entity.tags;
        dto.maxAcceptedSlots = entity.maxAcceptedSlots;
        dto.slots = entity.slots; // Consider using ServiceSlotDto.fromEntity() if a DTO exists for ServiceSlot
        dto.bumpedAt = entity.bumpedAt;
        dto.createdAt = entity.createdAt;
        dto.updatedAt = entity.updatedAt;
        dto.updatedBy = entity.updatedBy;
        dto.deleted = entity.deleted;

        // Using UserDto.fromEntity to convert the User entity to UserDto
        if (entity.user) {
            dto.user = UserDto.fromEntity(entity.user);
        }

        return dto;
    }
}
