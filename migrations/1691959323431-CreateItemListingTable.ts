import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateItemListingTable1691959323431 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'item_listing',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'seller_id',
                        type: 'uuid',
                    },
                    {
                        name: 'diablo_item_id',
                        type: 'uuid',
                    },
                    {
                        name: 'reserve_price',
                        type: 'decimal',
                    },
                    {
                        name: 'minimum_bid',
                        type: 'decimal',
                    },
                    {
                        name: 'duration',
                        type: 'int',
                    },
                    {
                        name: 'buy_now_price',
                        type: 'decimal',
                    },
                    {
                        name: 'current_bid_price',
                        type: 'decimal',
                        isNullable: true, // It can be nullable if no bid has been placed yet
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'item_listing',
            new TableForeignKey({
                columnNames: ['seller_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'item_listing',
            new TableForeignKey({
                columnNames: ['diablo_item_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'diablo_item',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('item_listing');
        if (table) {
            const foreignKeys = table.foreignKeys.filter(
                fk => fk.columnNames.indexOf('seller_id') !== -1 || fk.columnNames.indexOf('diablo_item_id') !== -1,
            );
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('item_listing', fk);
            }
        }

        await queryRunner.dropTable('item_listing');
    }
}
