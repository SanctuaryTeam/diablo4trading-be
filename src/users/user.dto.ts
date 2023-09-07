import { IUser } from './user.interface';
import { User } from './users.entity';

export class UserDto implements Partial<IUser> {
    id?: number;
    discordName: string;
    discordId?: string;
    email?: string;
    battleNetTag: string;

    // Vouch calculated properties
    vouchScore?: number;
    vouchRating?: number;

    static fromEntity(entity: User): UserDto {
        const dto = new UserDto();
        dto.discordName = entity.discordName;
        dto.battleNetTag = entity.battleNetTag;
        if (entity.receivedVouches && entity.receivedVouches.length > 0) {
            dto.vouchScore = entity.receivedVouches.reduce((acc, curr) => {
                return acc + (curr.is_positive ? 1 : -1);
            }, 0);

            dto.vouchRating = entity.receivedVouches.reduce((acc, curr) => {
                return acc + curr.rating;
            }, 0) / entity.receivedVouches.length;
        } else {
            dto.vouchScore = 0;
            dto.vouchRating = 0;
        }

        return dto;
    }
}
