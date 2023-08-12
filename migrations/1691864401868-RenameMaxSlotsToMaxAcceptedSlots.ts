import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMaxSlotsToMaxAcceptedSlots1691864401868 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('service', 'max_slots', 'max_accepted_slots');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('service', 'max_accepted_slots', 'max_slots');
    }
}
