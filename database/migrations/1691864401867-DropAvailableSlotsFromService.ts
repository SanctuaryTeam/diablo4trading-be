import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DropAvailableSlotsFromService1691864401867 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('service', 'available_slots');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'service',
            new TableColumn({
                name: 'available_slots',
                default: 3,
                type: 'integer',
                isNullable: false,
            }),
        );
    }
}
