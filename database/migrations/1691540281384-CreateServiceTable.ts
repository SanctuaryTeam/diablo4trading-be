import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateServiceTable1691540281384 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'service',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'realm_type',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'content',
                        type: 'varchar',
                        length: '1000',
                        default: "''",
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'max_slots',
                        type: 'integer',
                        default: 3,
                        isNullable: false,
                    },
                    {
                        name: 'available_slots',
                        default: 3,
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'tags',
                        type: 'integer',
                        default: 1,
                        isNullable: false,
                    },
                    {
                        name: 'bumped_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_by',
                        type: 'integer',
                        isNullable: true,
                    },
                    {
                        name: 'deleted',
                        type: 'boolean',
                        default: false,
                    },
                ],
            }),
        );

        // Create foreign key constraints
        await queryRunner.createForeignKey(
            'service',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'service',
            new TableForeignKey({
                columnNames: ['updated_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('service');
    }
}
