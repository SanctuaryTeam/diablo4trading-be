import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1690411047852 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
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
                    // Add other columns as needed.
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}
