import { UserDto } from 'src/users/user.dto';
import { ServiceSlot } from './service-slots/service-slots.entity';

export interface IService {
    id: number;
    realmType: string;
    title: string;
    content: string;
    user: UserDto;
    userId: number;
    tags: number;
    maxAcceptedSlots: number;
    slots: ServiceSlot[];
    bumpedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    deleted: boolean;
}
