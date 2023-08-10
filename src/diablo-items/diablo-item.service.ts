import { Assets } from '@diablosnaps/assets';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiabloItemAffix } from './diablo-item-affix.entity';

@Injectable()
export class DiabloItemService implements OnModuleInit {
    constructor(
        @InjectRepository(DiabloItemAffix, 'memory') private readonly diabloItemAffixRepository: Repository<
            DiabloItemAffix
        >,
    ) {}

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

    async getAffixes() {
        return this.diabloItemAffixRepository.find();
    }
}
