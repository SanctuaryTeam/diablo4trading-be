import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserVouchColumns1694126788000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename service_type to reference_type
        await queryRunner.renameColumn('user_vouch', 'service_type', 'reference_type');

        // Rename service_id to reference_id
        await queryRunner.renameColumn('user_vouch', 'service_id', 'reference_id');

        // Add state column
        await queryRunner.addColumn(
            'user_vouch',
            new TableColumn({
                name: 'state',
                type: 'integer',
                default: 0, // Or whatever default value you want
                isNullable: false,
            }),
        );

        // Add created_at column
        await queryRunner.addColumn(
            'user_vouch',
            new TableColumn({
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            }),
        );

        // Add updated_at column
        await queryRunner.addColumn(
            'user_vouch',
            new TableColumn({
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
                onUpdate: 'CURRENT_TIMESTAMP',
            }),
        );

        // Add deleted column
        await queryRunner.addColumn(
            'user_vouch',
            new TableColumn({
                name: 'deleted',
                type: 'boolean',
                default: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Undo: Rename reference_type back to service_type
        await queryRunner.renameColumn('user_vouch', 'reference_type', 'service_type');

        // Undo: Rename reference_id back to service_id
        await queryRunner.renameColumn('user_vouch', 'reference_id', 'service_id');

        // Remove added columns
        await queryRunner.dropColumn('user_vouch', 'state');
        await queryRunner.dropColumn('user_vouch', 'created_at');
        await queryRunner.dropColumn('user_vouch', 'updated_at');
        await queryRunner.dropColumn('user_vouch', 'deleted');
    }
}
