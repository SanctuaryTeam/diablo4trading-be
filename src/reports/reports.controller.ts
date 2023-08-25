import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ReportsService} from './reports.service';
import {Report} from './report.entity';
import {JwtAuthGuard} from '../auth/jwt/jwt.guard';
import {User} from '../users/users.entity';
import {CreateReportDto, ResolveReportDto} from './dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {
    }

    @Get('all')
    async getReports(): Promise<Report[]> {
        return this.reportsService.getAll()
    }

    @Get('unresolved')
    async getUnresolvedReports(): Promise<Report[]> {
        return this.reportsService.getAllUnresolved()
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
        const currentUser: User = req.auth.user;
        return this.reportsService.createReport(currentUser, createReportDto.reportedUserId, createReportDto.note);
    }

    @Post('resolve')
    async resolveReport(@Req() req: any, @Body() resolveReportDto: ResolveReportDto): Promise<Report[]> {
        const currentUser: User = req.auth.user;
        return this.reportsService.resolveAllRelatedReports(currentUser, resolveReportDto.reportId, resolveReportDto.actionTaken, resolveReportDto.note);
    }
}
