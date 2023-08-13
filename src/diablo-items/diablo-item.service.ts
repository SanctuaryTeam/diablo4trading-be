import { Assets } from '@diablosnaps/assets';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DiabloItemAffix } from './diablo-item-affix.entity';
import { DiabloItem } from './diablo-item.entity';

@Injectable()
export class DiabloItemService implements OnModuleInit {
    constructor(
        @InjectRepository(DiabloItemAffix, 'memory') private readonly diabloItemAffixRepository: Repository<
            DiabloItemAffix
        >,
        @InjectRepository(DiabloItem) private readonly diabloItemRepository: Repository<DiabloItem>,
    ) {
    }

    async onModuleInit() {
        await this.loadAffixes();
    }

    async loadAffixes() {
        // Read the affix data
        const affixData = (await Assets.loadAffixes()).definitions;

        // Get the repository for DiabloItemAffix entity
        const diabloItemAffixRepository = this.diabloItemAffixRepository;
        for (const id in affixData.basic) {
            const { name } = affixData.basic[id];
            const affix = new DiabloItemAffix();
            affix.id = parseInt(id);
            affix.name = name;
            await diabloItemAffixRepository.save(affix);
        }
    }

    async createDiabloItem(entityManager: EntityManager, data: Partial<DiabloItem>): Promise<DiabloItem> {
        const item = entityManager.create(DiabloItem, data);
        return await entityManager.save(item) as DiabloItem;
    }

    async getAffixes() {
        return this.diabloItemAffixRepository.find();
    }
}
