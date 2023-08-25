import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateUserTable1690411047852 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'discord_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'discord_name',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'battle_net_tag',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'role',
                        type: 'int',
                        isNullable: false,
                        default: 0,
                    },
                    {
                        name: 'banned_until',
                        type: 'datetime',
                        isNullable: true,
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
        await queryRunner.dropTable('user');
    }
}
