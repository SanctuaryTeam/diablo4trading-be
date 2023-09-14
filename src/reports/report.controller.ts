import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Put,
} from '@nestjs/common';

import { Report } from './report.entity';
import { REPORT_ERROR_CODES, ReportService } from './report.service';
import { COMMON_ERROR_CODES } from 'src/common/exceptions';

@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) {
    }

    //#region - CREATE

    /*
        async createReport(report: Partial<Report>): Promise<Report>
    */

    //#endregion - CREATE

    //#region - READ

    /*
        findAllByReportedUser(userId: number): Promise<Report[]>
        findAllOpenReports(): Promise<Report[]> 
    */


    @Get(':id')
    async getById(
        @Param('id') id: number,
    ): Promise<Report> {
        try {
            return await this.reportService.findOneByReportId(id);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get(':userId')
    async getAllByUser(
        @Param('userId') userId: number,
    ): Promise<Report[]> {
        try {
            return await this.reportService.findAllByUser(userId);
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get(':reportedUserId')
    async getAllByReportedUser(
        @Param('reportedUserId') reportedUserId: number,
    ): Promise<Report[]> {
        try {
            return await this.reportService.findAllByReportedUser(reportedUserId);
        } catch (error) {
            this.handleError(error);
        }
    }

    //#endregion - READ

    //#region - UPDATE

    // TODO : ANDREW : Add documentation
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateDto: Partial<Report>,
    ): Promise<Report> {
        try {
            return await this.reportService.updateReport(id, updateDto);
        } catch (error) {
            this.handleError(error);
        }
    }

    //#endregion - UPDATE

    //#region - DELETE

    // TODO : ANDREW : Add documentation
    @Delete(':id/delete')
    async delete(@Param('id') id: number): Promise<void> {
        try {
            return await this.reportService.deleteReport(id);
        } catch (error) {
            this.handleError(error);
        }
    }

    // TODO : ANDREW : Add documentation
    @Delete(':id/soft-delete')
    async softDelete(@Param('id') id: number): Promise<void> {
        try {
            return await this.reportService.softDeleteReport(id);
        } catch (error) {
            this.handleError(error);
        }
    }

    // TODO : ANDREW : Add documentation
    @Put(':id/undo-soft-delete')
    async undoSoftDelete(@Param('id') id: number): Promise<void> {
        try {
            return await this.reportService.undoSoftDeleteReport(id);
        } catch (error) {
            this.handleError(error);
        }
    }

    //#endregion - DELETE

    // TODO : Anyone : Might want to make a Base/Generic controller to handle errors
    private async handleError(error) {

        if (error?.code === REPORT_ERROR_CODES.INVALID_STATE) {
            throw new BadRequestException(error.message);
        }
        else if (error?.code === REPORT_ERROR_CODES.REPORT_NOT_FOUND ||
                 error?.code === COMMON_ERROR_CODES.NOT_FOUND) {
            throw new NotFoundException(error.message);
        }

        throw new HttpException(
            error?.message || 'Unknown error',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
