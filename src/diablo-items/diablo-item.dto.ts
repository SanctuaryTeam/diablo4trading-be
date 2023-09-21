import { DiabloItem } from './diablo-item.entity';
import { fromEntity as diabloItemAffixDtoFromEntity, DiabloItemAffixDto } from './diablo-item-affix.dto';
import { Game } from '@diablosnaps/common';

export interface DiabloItemDto {
    // TODO : ANDREW : Add this back if it is needed
    // We likely don't want people to include this in update or create
    //id: number;
    uuid: string;
    quality?: Game.ItemQuality;
    variant?: Game.ItemVariant;
    name?: string;
    power?: number;
    type?: Game.ItemType;
    dps?: number;
    armor?: number;
    socketCount?: number;
    socketType?: Game.ItemSocketType;
    requiredLevel?: number;
    classRestriction?: Game.Class;
    inherentAffix0?: DiabloItemAffixDto;
    inherentAffix0Value?: number;
    inherentAffix1?: DiabloItemAffixDto;
    inherentAffix1Value?: number;
    affix0?: DiabloItemAffixDto;
    affix0Value?: number;
    affix1?: DiabloItemAffixDto;
    affix1Value?: number;
    affix2?: DiabloItemAffixDto;
    affix2Value?: number;
    affix3?: DiabloItemAffixDto;
    affix3Value?: number;
    image?: string;
    deleted: boolean;
}

export const fromEntity = (entity: DiabloItem): DiabloItemDto => {
    const {
        //id,
        uuid,
        quality,
        variant,
        name,
        power,
        type,
        dps,
        armor,
        socketCount,
        socketType,
        requiredLevel,
        classRestriction,
        inherentAffix0,
        inherentAffix0Value,
        inherentAffix1,
        inherentAffix1Value,
        affix0,
        affix0Value,
        affix1,
        affix1Value,
        affix2,
        affix2Value,
        affix3,
        affix3Value,
        image,
        deleted,
    } = entity;

    const inherentAffix0Dto = inherentAffix0 ? diabloItemAffixDtoFromEntity(inherentAffix0) : undefined;
    const inherentAffix1Dto = inherentAffix1 ? diabloItemAffixDtoFromEntity(inherentAffix1) : undefined;

    const affix0Dto = affix0 ? diabloItemAffixDtoFromEntity(affix0) : undefined;
    const affix1Dto = affix1 ? diabloItemAffixDtoFromEntity(affix1) : undefined;
    const affix2Dto = affix2 ? diabloItemAffixDtoFromEntity(affix2) : undefined;
    const affix3Dto = affix3 ? diabloItemAffixDtoFromEntity(affix3) : undefined;

    return {
        //id,
        uuid,
        quality,
        variant,
        name,
        power,
        type,
        dps,
        armor,
        socketCount,
        socketType,
        requiredLevel,
        classRestriction,
        inherentAffix0: inherentAffix0Dto,
        inherentAffix0Value,
        inherentAffix1: inherentAffix1Dto,
        inherentAffix1Value,
        affix0: affix0Dto,
        affix0Value,
        affix1: affix1Dto,
        affix1Value,
        affix2: affix2Dto,
        affix2Value,
        affix3: affix3Dto,
        affix3Value,
        image,
        deleted,
    };
};