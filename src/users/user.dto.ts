import { User } from './users.entity';

export interface UserDto {
    id?: number;
    discordName: string;
    discordId?: string;
    email?: string;
    battleNetTag: string;
    vouchScore?: number;
    vouchRating?: number;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

const formatBattleNetTag = (tag: string, hideDiscriminator?: boolean): string => {
    return hideDiscriminator ? tag.split('#')[0] : tag;
};

export const fromEntity = (entity: User, options: FromEntityOptions = {}): UserDto => {
    const { hideDiscriminator } = options;
    const { discordName, battleNetTag, vouchCalculation } = entity;
    const vouchScore = vouchCalculation?.score || 0;
    const vouchRating = vouchCalculation?.rating || 0;

    return {
        discordName,
        battleNetTag: formatBattleNetTag(battleNetTag, hideDiscriminator),
        vouchScore,
        vouchRating,
    };
};
