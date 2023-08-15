import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStateColumnToItemListing1692060229931 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'item_listing',
            new TableColumn({
                name: 'state',
                default: `'ACTIVE'`,
                type: 'varchar',
                isNullable: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('item_listing', 'state');
    }

}
