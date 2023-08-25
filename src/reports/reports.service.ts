// reports.service.ts
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, IsNull} from 'typeorm';
import {Report} from './report.entity';
import {UsersService} from '../users/users.service';
import {User} from '../users/users.entity';
import {ReportsModule} from './reports.module';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
        private usersService: UsersService,
    ) {
    }

    ACTION_NONE = 0;
    ACTION_WARNED = 1;
    ACTION_BANNED = 2;

    async getById(id: number): Promise<Report | undefined> {
        return this.reportRepository.findOne({where: {id}});
    }

    async getByReportedUserId(reportedUserId: number): Promise<Report[] | undefined> {
        return this.reportRepository.find({where: {reportedUserId: reportedUserId}});
    }

    async getByReportingUserId(reportingUserId: number): Promise<Report[] | undefined> {
        return this.reportRepository.find({where: {reportingUserId: reportingUserId}});
    }

    async getAll(): Promise<Report[]> {
        return this.reportRepository.query('SELECT * FROM report');
    }

    async getAllUnresolved(): Promise<Report[]> {
        return this.reportRepository.find({where: {resolvedAt: IsNull()}, order: {createdAt: 'ASC'}})
    }

    async getReportedUser(id: number): Promise<User> {
        const report: Report = await this.getById(id);
        return await this.usersService.findById(report.reportedUserId)
    }

    async getReportingUser(id: number): Promise<User> {
        const report: Report = await this.getById(id);
        return await this.usersService.findById(report.reportingUserId)
    }

    async getAllReportsByReportedUserIdAndEntity(reportedUserId: number, reportedEntityType: number, reportedEntityId: number): Promise<Report[]> {
        return this.reportRepository.find({where: {reportedUserId, reportedEntityType, reportedEntityId}})
    }

    async createReport(reportingUser: User, reportedUserId: number, note: string): Promise<Report> {
        const report = this.reportRepository.create({
            reportingUserId: reportingUser.id,
            reportedUserId,
            reportedEntityType: 0,
            reportedEntityId: 0,
            type: 0,
            note,
            actionTaken: this.ACTION_NONE,
        });

        await this.reportRepository.save(report);
        return report;
    }

    async resolveAllRelatedReports(currentUser: User, id: number, actionTaken: number, note?: string): Promise<Report[]> {
        const report = await this.getById(id);
        const reports = await this.getAllReportsByReportedUserIdAndEntity(report.reportedUserId, report.reportedEntityType, report.reportedEntityId);

        if (actionTaken === this.ACTION_WARNED) {
            // todo: issue a warning
        } else if (actionTaken === this.ACTION_BANNED) {
            // todo: issue a warning with `is_ban` set to true and ban the user
        }

        reports.forEach((report: Report) => {
            this.resolveReport(currentUser, report.id, actionTaken);
        });

        return await this.getAllReportsByReportedUserIdAndEntity(report.reportedUserId, report.reportedEntityType, report.reportedEntityId);
    }

    private async resolveReport(currentUser: User, id: number, actionTaken: number, issuedWarningId?: number): Promise<Report> {
        const report = await this.getById(id);
        report.actionTaken = actionTaken;
        report.resolvedBy = currentUser.id;
        report.resolvedAt = new Date();
        report.issuedWarningId = issuedWarningId;

        return await this.reportRepository.save(report);
    }
}
