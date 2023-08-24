import {MigrationInterface, QueryRunner, Table, TableColumnOptions} from 'typeorm';

export class CreateDiabloItemTable1690990054725 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'diablo_item',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'uuid',
                        type: 'varchar',
                        isNullable: false,
                        length: '36',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'power',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'power_type',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'dps',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'armor',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'socket_count',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'seasonal_affix',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'required_level',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'class_requirement',
                        type: 'varchar',
                        isNullable: true,
                    },
                    ...Array.from({ length: 6 }, (_, index) => {
                        const affixIdKey = `${index < 2 ? 'inherent_a' : 'a'}ffix${index < 2 ? index : index - 2}_id`;
                        const affixValueKey = `${index < 2 ? 'inherent_a' : 'a'}ffix${
                            index < 2 ? index : index - 2
                        }_value`;

                        const columns: TableColumnOptions[] = [
                            {
                                name: affixIdKey,
                                type: 'int',
                                isNullable: true,
                            },
                            {
                                name: affixValueKey,
                                type: 'decimal',
                                precision: 6,
                                scale: 2,
                                isNullable: true,
                            },
                        ];

                        return columns;
                    }).flat(),
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false,
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('diablo_item');
    }
}
