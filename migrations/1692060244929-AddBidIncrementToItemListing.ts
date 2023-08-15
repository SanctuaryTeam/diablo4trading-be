import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AAddBidIncrementToItemListing1692060244929 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'item_listing',
            new TableColumn({
                name: 'bid_increment',
                type: 'integer',
                default: 0,
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('item_listing', 'bid_increment');
    }

}
