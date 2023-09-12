// diablo-item.mock.ts
import { Game } from '@diablosnaps/common';
import { faker } from '@faker-js/faker';
import { DiabloItemAffix } from '../../src/diablo-items/diablo-item-affix.interface';
import { IDiabloItem } from '../../src/diablo-items/diablo-item.interface';
import { GenerateMock } from './mock.interface';

// Function to generate random IDiabloItem mock data
export const generateMock: GenerateMock<IDiabloItem> = (count: number, diabloItemAffixes: DiabloItemAffix[]) => {
    const mockItems: IDiabloItem[] = [];

    for (let i = 0; i < count; i++) {
        const item: IDiabloItem = {
            id: i + 1,
            uuid: faker.string.uuid(),
            quality: faker.helpers.arrayElement([
                Game.ItemQuality.Common,
                Game.ItemQuality.Magic,
                Game.ItemQuality.Rare,
            ]),
            variant: faker.helpers.arrayElement(Object.values(Game.ItemVariant)),
            name: faker.lorem.words(2),
            power: faker.number.int({ min: 100, max: 1000 }),
            type: faker.helpers.arrayElement(Object.values(Game.ItemType)),
            dps: faker.number.int({ min: 50, max: 500 }),
            armor: faker.number.int({ min: 200, max: 2000 }),
            socketCount: faker.number.int({ min: 0, max: 2 }),
            socketType: faker.helpers.arrayElement(Object.values(Game.ItemSocketType)),
            requiredLevel: faker.number.int({ min: 60, max: 100 }),
            classRestriction: faker.helpers.arrayElement(Object.values(Game.Class)),
            inherentAffix0: faker.helpers.arrayElement(diabloItemAffixes),
            inherentAffix0Value: faker.number.int({ min: 1, max: 100 }), // Adjust as needed
            inherentAffix1: faker.helpers.arrayElement(diabloItemAffixes),
            inherentAffix1Value: faker.number.int({ min: 1, max: 100 }), // Adjust as needed
            affix0: faker.helpers.arrayElement(diabloItemAffixes),
            affix0Value: faker.number.int({ min: 1, max: 100 }), // Adjust as needed
            affix1: faker.helpers.arrayElement(diabloItemAffixes),
            affix1Value: faker.number.int({ min: 1, max: 100 }), // Adjust as needed
            affix2: faker.helpers.arrayElement(diabloItemAffixes),
            affix2Value: faker.number.int({ min: 1, max: 100 }), // Adjust as needed
            affix3: faker.helpers.arrayElement(diabloItemAffixes),
            affix3Value: faker.number.int({ min: 1, max: 100 }), // Adjust as needed
            image: '',
            createdAt: faker.date.past(),
            deleted: false,
        };

        mockItems.push(item);
    }

    return mockItems;
};
