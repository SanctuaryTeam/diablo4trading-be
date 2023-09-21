import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImageColumnToDiabloItem1691966170713 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'diablo_item',
            new TableColumn({
                name: 'image',
                type: 'blob',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('diablo_item', 'image');
    }
}
