import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateReportTable1693867595928 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'report',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isNullable: false,
                    },
                    {
                        name: 'report_type_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'report_reason_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'report_description',
                        type: 'varchar',
                        length: '500',
                        isNullable: false,
                    },
                    {
                        name: 'reported_by_user_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'user_accepted_terms_of_use',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'reported_user_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'reported_diablo_item_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'reported_service_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'report_status_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'report_severity_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_by',
                        type: 'integer',
                        isNullable: false,
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
            'report',
            new TableForeignKey({
                columnNames: ['report_type_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'report_type',
                onDelete: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['report_reason_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'report_reason',
                onDelete: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['reported_by_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['reported_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['reported_diablo_item_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'diablo_item',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['reported_service_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'service',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['report_status_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'report_status',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['report_severity_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'report_severity',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'report',
            new TableForeignKey({
                columnNames: ['updated_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createIndex(
            'report',
            new TableIndex({
                name: 'reportStatusIdIndex',
                columnNames: ['report_status_id'],
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable('report');
        if (table) {
            const foreignKeys = table.foreignKeys.filter(
                fk =>
                    fk.columnNames.indexOf('report_type_id') !== -1 ||
                    fk.columnNames.indexOf('report_reason_id') !== -1 ||
                    fk.columnNames.indexOf('reported_by_user_id') !== -1 ||
                    fk.columnNames.indexOf('reported_user_id') !== -1 ||
                    fk.columnNames.indexOf('reported_diablo_item_id') !== -1 ||
                    fk.columnNames.indexOf('reported_service_id') !== -1 ||
                    fk.columnNames.indexOf('report_status_id') !== -1 ||
                    fk.columnNames.indexOf('report_severity_id') !== -1 ||
                    fk.columnNames.indexOf('updated_by') !== -1
            );
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('report', fk);
            }
        }

        await queryRunner.dropTable('report');
    }
}
