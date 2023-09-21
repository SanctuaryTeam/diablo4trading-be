import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMinimumBidToOpeningBid1692060244928 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('item_listing', 'minimum_bid', 'opening_bid');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('item_listing', 'opening_bid', 'minimum_bid');
    }
}
