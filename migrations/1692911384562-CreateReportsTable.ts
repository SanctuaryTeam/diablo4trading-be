import {MigrationInterface, QueryRunner, Table} from 'typeorm'

export class CreateReportsTable1692911384562 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'report',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'reporting_user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'reported_user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'reported_entity_type',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'reported_entity_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'note',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'action_taken',
                        type: 'int',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                    // Add other columns as needed.
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('report');
    }

}
