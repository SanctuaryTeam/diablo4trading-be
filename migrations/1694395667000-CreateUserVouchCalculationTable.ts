import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserVouchCalculationTable1694395667000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_vouch_calculation',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'integer',
                    },
                    {
                        name: 'score',
                        type: 'integer',
                    },
                    {
                        name: 'rating',
                        type: 'float',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FK_User',
                        columnNames: ['user_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'user',
                        onDelete: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_vouch_calculation');
    }
}
