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

    getHello(): string {
        return 'hw';
    }

    createReport(): string {
        return 'test';
    }

    async findById(id: number): Promise<Report | undefined> {
        return this.reportRepository.query('SELECT * FROM report');
    }

    async findByUserId(userId: number): Promise<Report | undefined> {
        return this.reportRepository.findOne({where: { userId }});
    }

    async getAll(): Promise<Report | undefined> {
        return this.reportRepository.query('SELECT * FROM report');
    }
}
