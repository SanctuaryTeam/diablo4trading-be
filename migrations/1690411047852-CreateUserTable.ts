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
                name: 'discordName',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'battleNetTag',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'username',
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
                type: 'integer',
                isNullable: false,
                default: 0
              },
              {
                name: 'banned_until',
                type: 'datetime',
                isNullable: true,
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
