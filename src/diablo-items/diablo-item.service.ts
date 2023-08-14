import { Assets } from '@diablosnaps/assets';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
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

    createQuery() {
        return new DiabloItemQueryBuilder(
            this.diabloItemRepository.createQueryBuilder('diabloItem'),
        );
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

class DiabloItemQueryBuilder {
    private queryBuilder: SelectQueryBuilder<DiabloItem>;

    constructor(queryBuilder: SelectQueryBuilder<DiabloItem>) {
        this.queryBuilder = queryBuilder;
    }

    searchByAffixes(
        affixConditions: { id: number; value: number }[],
        requiredAffixAmount: number,
    ): DiabloItemQueryBuilder {
        const parameters = {
            ...affixConditions.reduce<{ [key: string]: any }>(
                (obj, affix, index) => ({ ...obj, [`affixId${index}`]: affix.id, [`affixValue${index}`]: affix.value }),
                {},
            ),
            requiredAffixAmount,
        };
        const queryAffixCase = (affixIndex: number) =>
            `CASE WHEN (` + Array.from({ length: 6 }, (_, index) => {
                const affixIdKey = `${index < 2 ? 'inherent_a' : 'a'}ffix${index < 2 ? index : index - 2}_id`;
                const affixValueKey = `${index < 2 ? 'inherent_a' : 'a'}ffix${index < 2 ? index : index - 2}_value`;

                return `(diabloItem.${affixIdKey} = :affixId${affixIndex} AND diabloItem.${affixValueKey} >= :affixValue${affixIndex})`;
            }).join(' OR ') + `) THEN 1 ELSE 0 END`;
        const conditionsQuery = affixConditions.map((_, index) => queryAffixCase(index)).join(' + ');
        this.queryBuilder = this.queryBuilder.setParameters(parameters);
        this.queryBuilder = this.queryBuilder.where(`${conditionsQuery} >= :requiredAffixAmount`);
        return this;
    }

    paginate(offset?: number, limit?: number): DiabloItemQueryBuilder {
        if (typeof offset === 'number') {
            this.queryBuilder = this.queryBuilder.skip(offset);
        }
        if (typeof limit === 'number') {
            this.queryBuilder = this.queryBuilder.take(limit);
        }
        return this;
    }

    orderBy(
        field: keyof DiabloItem,
        order: 'ASC' | 'DESC' = 'DESC',
    ): DiabloItemQueryBuilder {
        this.queryBuilder = this.queryBuilder.orderBy(`diabloItem.${field}`, order);
        return this;
    }

    getMany(): Promise<DiabloItem[]> {
        return this.queryBuilder.getMany();
    }

    getOne(): Promise<DiabloItem> {
        return this.queryBuilder.getOne();
    }

    getQuery(): SelectQueryBuilder<DiabloItem> {
        return this.queryBuilder;
    }
}
