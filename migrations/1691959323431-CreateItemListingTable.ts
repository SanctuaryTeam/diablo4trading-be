import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateItemListingTable1691959323431 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'item_listing',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
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
                        name: 'seller_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'diablo_item_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'reserve_price',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'minimum_bid',
                        type: 'integer',
                        default: 0,
                        isNullable: false,
                    },
                    {
                        name: 'duration',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'buy_now_price',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'current_bid_price',
                        type: 'integer',
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
