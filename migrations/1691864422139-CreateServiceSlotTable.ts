import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateServiceSlotTable1691864422139 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'service_slot',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'state',
                        type: 'varchar',
                        default: `'PENDING'`,
                        isNullable: false,
                    },
                    {
                        name: 'service_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'service_owner_user_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'client_user_id',
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
                ],
            }),
        );

        // Create foreign key constraints
        await queryRunner.createForeignKey(
            'service_slot',
            new TableForeignKey({
                columnNames: ['service_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'service',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'service_slot',
            new TableForeignKey({
                columnNames: ['service_owner_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'service_slot',
            new TableForeignKey({
                columnNames: ['client_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('service_slot');
    }
}
