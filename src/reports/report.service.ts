import { ServiceResponseException } from 'src/common/exceptions';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REPORT_STATES, Report } from './report.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { USER_ERROR_CODES, USER_ERROR_MESSAGES, UsersService } from 'src/users/users.service';

export enum REPORT_ERROR_CODES {
    REPORT_NOT_FOUND = 'REPORT_NOT_FOUND',
    INVALID_STATE = 'INVALID_STATE',
    SQL_ERROR = 'SQL_ERROR',
}

export const REPORT_ERROR_MESSAGES = {
    REPORT_NOT_FOUND: (reportId: number) => `Report with ID ${reportId} not found`,
    INVALID_STATE: (state: REPORT_STATES) => `Invalid state ${state}`,
    INVALID_STATE_TRANSITION: (state: REPORT_STATES) => `Invalid state transition "${state}"`,
};

@Injectable()
export class ReportService {
    private readonly logger = new Logger(ReportService.name);

    private readonly STATE_TRANSITIONS_MAP = {
        // They should be able to 'transition' to themselves, or to another valid state
        [REPORT_STATES.PENDING]: [REPORT_STATES.PENDING, REPORT_STATES.REVIEWING, REPORT_STATES.CANCELLED],
        [REPORT_STATES.REVIEWING]: [REPORT_STATES.REVIEWING, REPORT_STATES.CANCELLED, REPORT_STATES.CLOSED],
    };

    private readonly DEFAULT_OFFSET: number = 0;
    private readonly DEFAULT_LIMIT: number = 25;

    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,

        // TODO : ANDREW : Should I move this to the controller?
        private readonly userService: UsersService,
    ) { }

    createQuery() {
        return new CustomQueryBuilder(
            this.reportRepository.createQueryBuilder('report'),
        );
    }

    //#region - CREATE

    // TODO : ANDREW : When Dto objects are created, update these examples

    /*
     * Create a Report
     *
     * @example
     * `
     * let report = new Report(); // Example
     * let reportResult = createReport(report);
     * `
     * @param report - Report to add to the Database (with required fields)
    */
    async createReport(report: Partial<Report>): Promise<Report> {

        try {
            // HACK : Removing the ability to self create the 'id'
            // This causes the 'auto-increment' to skip to whatever was passed in
            // Ex. (Before Insert)
            // NEXTVAL: 10 (then 11, 12, 13, etc...)
            //
            //     (Request -> Insert into table)
            // id: 123 // Valid, non existing Id
            //
            //     (After Insert)
            // NEXTVAL: 124 (then 125, 126, 127, etc...)
            // 
            // There might be a better way to do this without causing another query to check the next val
            if (report?.id) report.id = null;

            const createdReport = this.reportRepository.create(report);
            return await this.reportRepository.save(createdReport);
        } catch (error) {

            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.SQL_ERROR,
                error.message,
            ));
        }
    }

    //#endregion - CREATE

    //#region - READ

    /*
     * Find (One) Report by Id
     *
     * @example
     * `let report = findOneByReportId(1234, true);`
     * 
     * @param id - 'id' from an already existing report.
     * @param excludeDeleted - (Default: true) true to exclude (soft) 'deleted' reports, false to include.
    */
    async findOneByReportId(id: number, excludeDeleted = true): Promise<Report> {

        const report = await this.createQuery()
            .searchByReportId(id)
            .excludeDeleted(excludeDeleted)
            .includeFull()
            .getOne();

        if (!report || report == null) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                REPORT_ERROR_MESSAGES.REPORT_NOT_FOUND(id),
            ));
        }

        return report;
    }

    /*
     * Find all the reports by the 'reportedByUser'
     *
     * @example
     * `let reports = findAllByUser(1234, true);`
     * 
     * @param userId - 'userId' from an already existing user.
     * @param excludeDeleted - (Default: true) true to exclude (soft) 'deleted' reports, false to include.
    */
    async findAllByUser(userId: number, excludeDeleted = true): Promise<Report[]> {

        const user = await this.userService.findById(userId);

        if (!user) {
            await this.handleError(new ServiceResponseException(
                USER_ERROR_CODES.USER_NOT_FOUND,
                USER_ERROR_MESSAGES.USER_NOT_FOUND(userId),
            ));
        }

        // Limiting this with defaults for now to prevent really long query times
        // As more users create more reports, we should include this as a parameter
        return this.createQuery()
            .searchByReportedByUserId(userId)
            .excludeDeleted(excludeDeleted)
            .includeFull()
            .paginate(this.DEFAULT_OFFSET, this.DEFAULT_LIMIT)
            .orderBy('id', 'DESC')
            .getMany();
    }

    /*
     * Find all the reports by the 'reportedUser'
     *
     * @example
     * `let reports = findAllByReportedUser(1234, true);`
     * 
     * @param userId - 'userId' from an already existing user.
     * @param excludeDeleted - (Default: true) true to exclude (soft) 'deleted' reports, false to include.
    */
    async findAllByReportedUser(userId: number, excludeDeleted = true): Promise<Report[]> {

        const user = await this.userService.findById(userId);

        if (!user) {
            await this.handleError(new ServiceResponseException(
                USER_ERROR_CODES.USER_NOT_FOUND,
                USER_ERROR_MESSAGES.USER_NOT_FOUND(userId),
            ));
        }

        // Limiting this with defaults for now to prevent really long query times
        // As more users create more reports, we should include this as a parameter
        return this.createQuery()
            .searchByReportedUserId(userId)
            .excludeDeleted(excludeDeleted)
            .includeFull()
            .paginate(this.DEFAULT_OFFSET, this.DEFAULT_LIMIT)
            .orderBy('id', 'DESC')
            .getMany();
    }

    /*
     * Find ALL the reports
     *
     * @example
     * `let reports = findAllOpenReports(1234, true);`
     * 
     * @param excludeDeleted - (Default: true) true to exclude (soft) 'deleted' reports, false to include.
     * @param excludeClosed - (Default: true) true to exclude 'closed' reports, false to include. (See: REPORT_STATES.CLOSED)
    */
    async findAllOpenReports(excludeDeleted = true, excludeClosed = true): Promise<Report[]> {

        // Limiting this with defaults for now to prevent really long query times
        // As more users create more reports, we should include this as a parameter
        return this.createQuery()
            .excludeDeleted(excludeDeleted)
            .excludeClosed(excludeClosed)
            .includeFull()
            .paginate(this.DEFAULT_OFFSET, this.DEFAULT_LIMIT)
            .orderBy('id', 'DESC')
            .getMany();
    }

    //#endregion - READ

    //#region - UPDATE

    // TODO : ANDREW : After testing all these scenarios, may want to add more checks/error logging

    /*
     * Update a Report with the given Id, and the Partial<Report> values
     *
     * @example
     * `
     * let report = new Report(); // Example
     * let reportResult = updateReport(1234, report);
     * `
     * @usageNotes
     * The 'state' must be a valid state and be a valid transition state (See: STATE_TRANSITIONS_MAP)
     * 
     * @param id - 'id' from an already existing report.
     * @param dto - Report (values) to update the existing report with
    */
    async updateReport(id: number, dto: Partial<Report>): Promise<Report> {

        const report = await this.reportRepository.findOneBy({ id });

        if (!report) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                REPORT_ERROR_MESSAGES.REPORT_NOT_FOUND(id),
            ));
        }

        if (!(dto.state in REPORT_STATES)) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.INVALID_STATE,
                REPORT_ERROR_MESSAGES.INVALID_STATE(dto.state),
            ));
        }

        if (!this.STATE_TRANSITIONS_MAP[report.state]?.includes(dto.state)) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.INVALID_STATE,
                REPORT_ERROR_MESSAGES.INVALID_STATE_TRANSITION(dto.state),
            ));
        }

        // Currently only checking the 'state' is valid
        // We may want to add more validation later

        await this.reportRepository.update(id, dto);
        return await this.reportRepository.findOneBy({ id });
    }

    //#endregion - UPDATE

    //#region - DELETE

    /*
     * (Hard) Delete a report by a given ID - NOT REVERSIBLE
     *
     * @example
     * `deleteReport(1234);`
     * 
     * @param id - 'id' from an already existing report.
    */
    async deleteReport(id: number): Promise<void> {

        const report = await this.reportRepository.findOneBy({ id });

        if (!report) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                REPORT_ERROR_MESSAGES.REPORT_NOT_FOUND(id),
            ));
        }

        await this.reportRepository.delete(id);
    }

    /*
     * (Soft) Delete a report by a given ID
     *
     * @example
     * `softDeleteReport(1234);`
     * 
     * @usageNotes
     * This sets the 'deleted' field on the Report and can be reversed. (See: undoSoftDeleteReport)
     * 
     * @param id - 'id' from an already existing report.
    */
    async softDeleteReport(id: number): Promise<void> {

        const report = await this.reportRepository.findOneBy({ id });

        if (!report) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                REPORT_ERROR_MESSAGES.REPORT_NOT_FOUND(id),
            ));
        }

        await this.reportRepository.update(id, { deleted: true });
    }

    /*
     * Undo (Soft) Delete a report by a given ID
     *
     * @example
     * `undoSoftDeleteReport(1234);`
     * 
     * @usageNotes
     * This sets the 'deleted' field on the Report and can be reversed. (See: softDeleteReport)
     * 
     * @param id - 'id' from an already existing report.
    */
    async undoSoftDeleteReport(id: number): Promise<void> {

        const report = await this.reportRepository.findOneBy({ id });

        if (!report) {
            await this.handleError(new ServiceResponseException(
                REPORT_ERROR_CODES.REPORT_NOT_FOUND,
                REPORT_ERROR_MESSAGES.REPORT_NOT_FOUND(id),
            ));
        }

        await this.reportRepository.update(id, { deleted: false });
    }

    //#endregion - DELETE

    // TODO : Anyone : Might want to make a Base/Generic service to handle errors
    private async handleError(error: Error) {
        this.logger.error(error, error.stack);
        throw error;
    }
}

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

    excludeClosed(exclude = true): CustomQueryBuilder {
        if (exclude) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'report.state != :state',
                { state: REPORT_STATES.CLOSED },
            );
        }
        return this;
    }

    excludeDeleted(exclude = true): CustomQueryBuilder {
        if (exclude) {
            this.queryBuilder = this.queryBuilder.andWhere(
                'report.deleted != :exclude',
                { exclude }
            );
        }
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
            .includeUpdatedByUser()
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
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportedByUser', 'user1');
        return this;
    }

    includeReportedUser(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.reportedUser', 'user2');
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
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.assignedUser', 'user3');
        return this;
    }

    includeUpdatedByUser(): CustomQueryBuilder {
        this.queryBuilder = this.queryBuilder.leftJoinAndSelect('report.updatedByUser', 'user4');
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