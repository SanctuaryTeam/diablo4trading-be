import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserVouchTable1694052628000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_vouch',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'recipient_id',
                        type: 'integer',
                    },
                    {
                        name: 'author_id',
                        type: 'integer',
                    },
                    {
                        name: 'service_type',
                        type: 'varchar',
                    },
                    {
                        name: 'service_id',
                        type: 'integer',
                    },
                    {
                        name: 'is_positive',
                        type: 'boolean',
                    },
                    {
                        name: 'rating',
                        type: 'integer',
                    },
                    {
                        name: 'description',
                        type: 'text',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_vouch');
    }
}
