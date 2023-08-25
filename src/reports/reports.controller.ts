import {Body, Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ReportsService} from './reports.service';
import {Report} from './report.entity';
import {JwtAuthGuard} from '../auth/jwt/jwt.guard';
import {User} from '../users/users.entity';
import {CreateReportDto} from './createReport.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {
    }

    @Get('all')
    async getReports(): Promise<Report[]> {
        return this.reportsService.getAll()
    }

    @Get('get')
    async get(
        @Query('id') id?: number
    ): Promise<Report> {
        return this.reportsService.getById(id)
    }

    @Get('get-by-reporting-user-id')
    async getByReportingUserId(
        @Query('reportingUserId') reportingUserId?: number
    ): Promise<Report[]> {
        return this.reportsService.getByReportingUserId(reportingUserId)
    }

    @Get('get-by-reported-user-id')
    async getByReportedUserId(
        @Query('reportedUserId') reportedUserId?: number
    ): Promise<Report[]> {
        return this.reportsService.getByReportedUserId(reportedUserId)
    }

    @Post('create')
    async createReport(@Req() req: any, @Body() createReportDto: CreateReportDto): Promise<Report> {
        const reportingUser: User = req.auth.user;
        return this.reportsService.createReport(reportingUser, createReportDto.reportedUserId, createReportDto.note);
    }
}
