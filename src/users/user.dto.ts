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
        if (entity.vouchCalculation) {
            dto.vouchScore = entity.vouchCalculation.score;
            dto.vouchRating = entity.vouchCalculation.rating;
        } else {
            dto.vouchScore = 0;
            dto.vouchRating = 0;
        }

        return dto;
    }
}
