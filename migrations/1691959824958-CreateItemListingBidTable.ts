import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateItemListingBidTable1691959824958 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'item_listing_bid',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                    },
                    {
                        name: 'item_listing_id',
                        type: 'int',
                    },
                    {
                        name: 'bid_amount',
                        type: 'int',
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
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'item_listing_bid',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'item_listing_bid',
            new TableForeignKey({
                columnNames: ['item_listing_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'item_listing',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('item_listing_bid');
        if (table) {
            const foreignKeys = table.foreignKeys.filter(
                fk => fk.columnNames.indexOf('user_id') !== -1 || fk.columnNames.indexOf('item_listing_id') !== -1,
            );
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('item_listing_bid', fk);
            }
        }

        await queryRunner.dropTable('item_listing_bid');
    }
}
