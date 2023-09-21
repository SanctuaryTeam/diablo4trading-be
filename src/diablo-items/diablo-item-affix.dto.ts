import { DiabloItemAffix } from './diablo-item-affix.entity';

export interface DiabloItemAffixDto {
    id: number;
    name: string;
}

export const fromEntity = (entity: DiabloItemAffix): DiabloItemAffixDto => {
    const { id, name } = entity;
    return { id, name };
};