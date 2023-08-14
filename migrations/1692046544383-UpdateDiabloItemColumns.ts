import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateDiabloItemColumns1692046544383 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('diablo_item', 'power_type', 'variant');
        await queryRunner.renameColumn('diablo_item', 'class_requirement', 'class_restriction');
        await queryRunner.addColumn(
            'diablo_item',
            new TableColumn({
                name: 'quality',
                type: 'varchar',
                isNullable: true,
            }),
        );
        await queryRunner.addColumn(
            'diablo_item',
            new TableColumn({
                name: 'socket_type',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('diablo_item', 'variant', 'power_type');
        await queryRunner.renameColumn('diablo_item', 'class_restriction', 'class_requirement');
        await queryRunner.dropColumn('diablo_item', 'quality');
        await queryRunner.dropColumn('diablo_item', 'socket_type');
    }
}
