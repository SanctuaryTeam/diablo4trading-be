import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REPORT_STATES, Report } from './report.entity';
//import { ReportReason } from './report-reason/report-reason.entity';
//import { ReportType } from './report-type/report-type.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { COMMON_ERROR_CODES, ServiceResponseException } from 'src/common/exceptions';
import { UsersService } from 'src/users/users.service';

export enum REPORT_ERROR_CODES {
    REPORT_NOT_FOUND = 'SLOT_NOT_FOUND',
    INVALID_STATE = 'INVALID_STATE',
}

@Injectable()
export class ReportService {

    private readonly STATE_TRANSITIONS_MAP = {
        [REPORT_STATES.PENDING]: [REPORT_STATES.REVIEWING, REPORT_STATES.CANCELLED],
        [REPORT_STATES.REVIEWING]: [REPORT_STATES.CANCELLED, REPORT_STATES.CLOSED],
    };

    private readonly DEFAULT_OFFSET: number = 0;
    private readonly DEFAULT_LIMIT: number = 25;

    constructor(

        // TODO : ANDREW : Remove if this isn't needed
        //@InjectRepository(ReportType, 'memory')
        //private readonly reportTypeRepository: Repository<ReportType>,

        //@InjectRepository(ReportReason, 'memory')
        //private readonly reportReasonRepository: Repository<ReportReason>,

        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,

        // TODO : ANDREW : Should I change this?
        private readonly userService: UsersService,

    ) { }

    createQuery() {
        return new CustomQueryBuilder(
            this.reportRepository.createQueryBuilder('report'),
        );
    }

    // Sample Documentation
    /*
     * Find (One) Report by Id
     *
     * @example
     * `let report = findOneByReportId(1234);`
     * 
     * @param id - 'id' from an already existing report
    */

    //#region - CREATE

    // TODO : ANDREW : Add documentation
    async createReport(report: Partial<Report>): Promise<Report> {
        this.reportRepository.create(report);
        return await this.reportRepository.save(report);
    }

    //#endregion - CREATE

    //#region - READ

    // TODO : ANDREW : Add documentation
    async findOneByReportId(id: number): Promise<Report> {

        const report = this.createQuery()
            .searchByReportId(id)
            .excludeDeleted()
            .includeFull()
            .getOne();

        if (!report) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                `Report with ID ${id} not found`,
            );
        }

        return report;
    }

    // TODO : ANDREW : Add documentation
    async findAllByUser(userId: number): Promise<Report[]> {

        const user = await this.userService.findById(userId);

        if (!user) {
            throw new ServiceResponseException(
                COMMON_ERROR_CODES.NOT_FOUND,
                `User with ID ${userId} not found`,
            );
        }

        // Limiting this with defaults for now to prevent really long query times
        // As more users create more reports, we should include this as a parameter
        return this.createQuery()
            .searchByReportedByUserId(userId)
            .excludeDeleted()
            .includeFull()
            .paginate(this.DEFAULT_OFFSET, this.DEFAULT_LIMIT)
            .orderBy('createdAt', 'DESC')
            .getMany();
    }

    // TODO : ANDREW : Add documentation
    async findAllByReportedUser(userId: number): Promise<Report[]> {

        const user = await this.userService.findById(userId);

        if (!user) {
            throw new ServiceResponseException(
                COMMON_ERROR_CODES.NOT_FOUND,
                `User with ID ${userId} not found`,
            );
        }

        // Limiting this with defaults for now to prevent really long query times
        // As more users create more reports, we should include this as a parameter
        return this.createQuery()
            .searchByReportedUserId(userId)
            .excludeDeleted()
            .includeFull()
            .paginate(this.DEFAULT_OFFSET, this.DEFAULT_LIMIT)
            .orderBy('createdAt', 'DESC')
            .getMany();
    }

    // TODO : ANDREW : Add documentation
    async findAllOpenReports(): Promise<Report[]> {

        // Limiting this with defaults for now to prevent really long query times
        // As more users create more reports, we should include this as a parameter
        return this.createQuery()
            .excludeDeleted()
            .excludeClosed()
            .includeFull()
            .paginate(this.DEFAULT_OFFSET, this.DEFAULT_LIMIT)
            .orderBy('createdAt', 'DESC')
            .getMany();
    }

    //#endregion - READ

    //#region - UPDATE

    // TODO : ANDREW : Add documentation
    async updateReport(id: number, dto: Partial<Report>): Promise<Report> {

        const report = await this.findOneByReportId(id);

        if (!report) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                `Report with ID ${id} not found`,
            );
        }

        if (!(dto.state in REPORT_STATES)) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.INVALID_STATE,
                `Invalid state "${dto.state}"`,
            );
        }

        if (!this.STATE_TRANSITIONS_MAP[report.state]?.includes(dto.state)) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.INVALID_STATE,
                `Invalid state transition "${dto.state}"`,
            );
        }

        // Currently only checking the 'state' is valid
        // We may want to add more validation later

        await this.reportRepository.update(id, dto);
        return await this.reportRepository.findOneBy({ id });
    }

    //#endregion - UPDATE

    //#region - DELETE

    // TODO : ANDREW : Add documentation - (For all functions)
    async deleteReport(id: number): Promise<void> {

        const report = await this.findOneByReportId(id);

        if (!report) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                `Report with ID ${id} not found`,
            );
        }

        await this.reportRepository.delete(id);
    }

    async softDeleteReport(id: number): Promise<void> {

        const report = await this.findOneByReportId(id);

        if (!report) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                `Report with ID ${id} not found`,
            );
        }

        await this.reportRepository.update(id, { deleted: true });
    }

    async undoSoftDeleteReport(id: number): Promise<void> {

        const report = await this.findOneByReportId(id);

        if (!report) {
            throw new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                `Report with ID ${id} not found`,
            );
        }

        await this.reportRepository.update(id, { deleted: false });
    }

    //#endregion - DELETE
}

// TODO : ANDREW : Add documentation for all functions
class CustomQueryBuilder {
    private queryBuilder: SelectQueryBuilder<Report>;

    constructor(queryBuilder: SelectQueryBuilder<Report>) {
        this.queryBuilder = queryBuilder;
    }

    searchByReportId(id: number): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            'report.id = :id',
            { id }
        );
        return this;
    }

    searchByReportedByUserId(userId: number): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            'report.reportedByUserId = :userId',
            { userId }
        );
        return this;
    }

    searchByReportedUserId(userId: number): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            'report.reportedUserId = :userId',
            { userId }
        );
        return this;
    }

    excludeClosed(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            'report.state != :state',
            { state: REPORT_STATES.CLOSED },
        );
        return this;
    }

    excludeDeleted(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.andWhere(
            'report.deleted != :deleted',
            { deleted: false },
        );
        return this;
    }

    /*
     * Includes (Join) all of the `include*` functions to the queryBuilder
     *
     * @example
     * `var query = this.createQuery()
            .excludeDeleted()
            .includeFull()
            .getOne();`
    */
    includeFull(): CustomQueryBuilder {
        return this.includeReportType()
            .includeReportReason()
            .includeReportedByUser()
            .includeReportedUser()
            .includeReportedDiabloItem()
            .includeReportedService()
            .includeAssignedUser()
    }

    includeReportType(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportType', 'report_type');
        return this;
    }

    includeReportReason(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportReason', 'report_reason');
        return this;
    }

    includeReportedByUser(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportedByUser', 'user');
        return this;
    }

    includeReportedUser(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportedUser', 'user');
        return this;
    }

    includeReportedDiabloItem(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportedDiabloItem', 'diablo_item');
        return this;
    }

    includeReportedService(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportedService', 'service');
        return this;
    }

    includeAssignedUser(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.assignedUser', 'user');
        return this;
    }

    paginate(offset?: number, limit?: number): CustomQueryBuilder {
        if (typeof offset === 'number') {
            this.queryBuilder = this.queryBuilder.skip(offset);
        }
        if (typeof limit === 'number') {
            this.queryBuilder = this.queryBuilder.take(limit);
        }
        return this;
    }

    orderBy(
        field: keyof Report,
        order: 'ASC' | 'DESC' = 'DESC',
    ): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.orderBy(`report.${field}`, order);
        return this;
    }

    getMany(): Promise<Report[]> {
        return this.queryBuilder.getMany();
    }

    getOne(): Promise<Report> {
        return this.queryBuilder.getOne();
    }
}