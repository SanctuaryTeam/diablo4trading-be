// reports.service.ts
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Report} from './report.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
    ) {
    }

    createReport(): string {
        return 'test';
    }

    async getById(id: number): Promise<Report | undefined> {
        return this.reportRepository.findOne({where: { id }});
    }

    async getByReportedUserId(reportedUserId: number): Promise<Report[] | undefined> {
        return this.reportRepository.find({where: { reportedUserId : reportedUserId }});
    }

    async getByReportingUserId(reportingUserId: number): Promise<Report[] | undefined> {
        return this.reportRepository.find({where: { reportingUserId : reportingUserId }});
    }

    async getAll(): Promise<Report[]> {
        return this.reportRepository.query('SELECT * FROM report');
    }
}
