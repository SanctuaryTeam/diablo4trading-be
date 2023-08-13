import { Game } from '@diablosnaps/common';
import { DiabloItemAffix } from './diablo-item-affix.interface';

export interface IDiabloItem {
    id: number;
    uuid: string;
    quality: Game.ItemQuality | null;
    variant: Game.ItemVariant | null;
    name: string | null;
    power: number | null;
    type: Game.ItemType | null;
    dps: number | null;
    armor: number | null;
    socketCount: number | null;
    socketType: Game.ItemSocketType | null;
    requiredLevel: number | null;
    classRestriction: Game.Class | null;
    inherentAffix0: DiabloItemAffix | null;
    inherentAffix0Value: number | null;
    inherentAffix1: DiabloItemAffix | null;
    inherentAffix1Value: number | null;
    affix0: DiabloItemAffix | null;
    affix0Value: number | null;
    affix1: DiabloItemAffix | null;
    affix1Value: number | null;
    affix2: DiabloItemAffix | null;
    affix2Value: number | null;
    affix3: DiabloItemAffix | null;
    affix3Value: number | null;
    image: string | null;
    createdAt: Date;
    deleted: boolean;
}
