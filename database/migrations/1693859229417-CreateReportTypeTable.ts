import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ReportType } from '../../src/reports/report-type/report-type.entity'

export class CreateReportTypeTable1693859229417 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'report_type',
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isNullable: false,
                    },
                    {
                        name: 'type_description',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        const reportTypeRepository = queryRunner.connection.getRepository(ReportType);
        const reportTypes = reportTypeRepository.create([
            {
                typeDescription: 'User',
            },
            {
                typeDescription: 'Service',
            },
            {
                typeDescription: 'Item',
            },
        ]);

        await reportTypeRepository.save(reportTypes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('report_type');
    }
}
