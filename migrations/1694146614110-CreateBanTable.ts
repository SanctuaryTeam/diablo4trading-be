import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBanTable1694146614110 implements MigrationInterface {

    tableName = 'ban';

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
                        name: 'ban_user_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'report_id',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'ban_description',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'ban_end_date',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'permanent_ban',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['ban_user_id'],
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
