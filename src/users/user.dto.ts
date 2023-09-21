import { API } from '@sanctuaryteam/shared';
import { User } from './users.entity';

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

const formatBattleNetTag = (tag: string, hideDiscriminator?: boolean): string => {
    return hideDiscriminator ? tag.split('#')[0] : tag;
};

export const fromEntity = (entity: User, options: FromEntityOptions = {}): API.UserDto => {
    const { hideDiscriminator } = options;
    const { discordName, battleNetTag, vouchCalculation, uuid } = entity;
    const vouchScore = vouchCalculation?.score || 0;
    const vouchRating = vouchCalculation?.rating || 0;

    return {
        id: uuid,
        discordName,
        battleNetTag: formatBattleNetTag(battleNetTag, hideDiscriminator),
        vouchScore,
        vouchRating,
    };
};
