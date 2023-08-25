// reports.service.ts
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
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

    async getReportedUser(id: number): Promise<User> {
        const report: Report = await this.getById(id);
        return await this.usersService.findById(report.reportedUserId)
    }

    async getReportingUser(id: number): Promise<User> {
        const report: Report = await this.getById(id);
        return await this.usersService.findById(report.reportingUserId)
    }

    async createReport(reportingUser: User, reportedUserId: number, note: string): Promise<Report> {
        const report = this.reportRepository.create({
            reportingUserId: reportingUser.id,
            reportedUserId,
            reportedEntityType: 0,
            reportedEntityId: 0,
            note,
            actionTaken: 0,
        });

        await this.reportRepository.save(report);
        return report;
    }
}
