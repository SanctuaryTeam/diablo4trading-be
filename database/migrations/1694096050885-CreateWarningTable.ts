import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateWarningTable1694096050885 implements MigrationInterface {

    tableName = 'warning';

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: this.tableName,
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
                        name: 'warning_user_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'report_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'warning_description',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['warning_user_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'user',
                        onDelete: 'CASCADE',
                    },
                    {
                        columnNames: ['report_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'report',
                        onDelete: 'CASCADE',
                    },
                ],
            }),
            true,
        );

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
