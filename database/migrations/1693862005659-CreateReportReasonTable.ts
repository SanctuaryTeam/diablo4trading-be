import { ReportReason } from 'src/reports/report-reason/report-reason.entity';
import { ReportType } from 'src/reports/report-type/report-type.entity';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateReportReasonTable1693862005659 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'report_reason',
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
                        name: 'report_type_id',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'reason_description',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'report_reason',
            new TableForeignKey({
                columnNames: ['report_type_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'report_type',
                onDelete: 'CASCADE',
            }),
        )

        const reportTypeRepository = queryRunner.connection.getRepository(ReportType);
        const userTypeId = (await reportTypeRepository.findOne({ where: { typeDescription: 'User' } })).id;
        const serviceTypeId = (await reportTypeRepository.findOne({ where: { typeDescription: 'Service' } })).id;
        const itemTypeId = (await reportTypeRepository.findOne({ where: { typeDescription: 'Item' } })).id;

        const reportTypeIds: Array<number> = [userTypeId, serviceTypeId, itemTypeId];

        const reportReasonDescriptions: Array<string> = [
            'Exploits',
            'Real Money Trading (RMT)',
            'Edited Bids',
            'Unethical Trades',
            'Abuse/Harrassment',
            'Vouch Abuse',
        ];

        const reportReasons = new Array<Partial<ReportReason>>;

        reportTypeIds.forEach(typeId => {
            reportReasonDescriptions.forEach(reasonDescription => {
                const temp: Partial<ReportReason> = {
                    reportTypeId: typeId,
                    reasonDescription: reasonDescription,
                };

                reportReasons.push(temp);
            })
        });

        const reportReasonRepository = queryRunner.connection.getRepository(ReportReason);
        const reportTypes = reportReasonRepository.create(reportReasons);

        await reportReasonRepository.save(reportTypes);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const table = await queryRunner.getTable('report_reason');
        if (table) {
            const foreignKeys = table.foreignKeys.filter(
                fk => fk.columnNames.indexOf('report_type_id') !== -1,
            );
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey('report_reason', fk);
            }
        }

        await queryRunner.dropTable('report_reason');
    }
}
