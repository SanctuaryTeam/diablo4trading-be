import {MigrationInterface, QueryRunner, Table} from 'typeorm'

export class CreateWarningsTable1692911937341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'warnings',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'user_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'reason',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'note',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'is_ban',
                        type: '',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'issued_by',
                        type: '',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        isNullable: false,
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('warnings');
    }

}
