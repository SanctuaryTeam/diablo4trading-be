import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';

import { Report } from './report.entity';
import { REPORT_ERROR_CODES, ReportService } from './report.service';
import { USER_ERROR_CODES } from 'src/users/users.service';

@Controller('reports')
export class ReportController {
    private readonly logger = new Logger(ReportController.name);

    constructor(private readonly reportService: ReportService) {
    }

    //#region - CREATE

    @Post('')
    async createReport(
        @Body() createDto: Partial<Report>,
    ): Promise<Report> {
        try {
            return await this.reportService.createReport(createDto);
        } catch (error) {
            await this.handleError(error);
        }
    }

    //#endregion - CREATE

    //#region - READ

    @Get('')
    async getAllOpenReports(
    ): Promise<Report[]> {
        try {
            return await this.reportService.findAllOpenReports();
        } catch (error) {
            await this.handleError(error);
        }
    }

    @Get(':id')
    async getById(
        @Param('id') id: number,
    ): Promise<Report> {
        try {
            return await this.reportService.findOneByReportId(id);
        } catch (error) {
            await this.handleError(error);
        }
    }

    @Get('user/:userId')
    async getAllByUser(
        @Param('userId') userId: number,
    ): Promise<Report[]> {
        try {
            return await this.reportService.findAllByUser(userId);
        } catch (error) {
            await this.handleError(error);
        }
    }

    @Get('reportedUser/:userId')
    async getAllByReportedUser(
        @Param('userId') userId: number,
    ): Promise<Report[]> {
        try {
            return await this.reportService.findAllByReportedUser(userId);
        } catch (error) {
            await this.handleError(error);
        }
    }

    //#endregion - READ

    //#region - UPDATE

    // TODO : ANDREW : Test all the same scenarios with 'UPDATE' as with 'CREATE'

    // TODO : ANDREW : Add documentation
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateDto: Partial<Report>,
    ): Promise<Report> {
        try {
            return await this.reportService.updateReport(id, updateDto);
        } catch (error) {
            await this.handleError(error);
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
            await this.handleError(error);
        }
    }

    // TODO : ANDREW : Add documentation
    @Put(':id/soft-delete')
    async softDelete(@Param('id') id: number): Promise<void> {
        try {
            return await this.reportService.softDeleteReport(id);
        } catch (error) {
            await this.handleError(error);
        }
    }

    // TODO : ANDREW : Add documentation
    @Put(':id/undo-soft-delete')
    async undoSoftDelete(@Param('id') id: number): Promise<void> {
        try {
            return await this.reportService.undoSoftDeleteReport(id);
        } catch (error) {
            await this.handleError(error);
        }
    }

    //#endregion - DELETE

    // TODO : Anyone : Might want to make a Base/Generic controller to handle errors
    private async handleError(error) {
        const errorMessage = error?.message || 'Unknown error';
        const errorCode = error?.code || '';
        const errorStack = error?.stack || '';

        if (errorCode === REPORT_ERROR_CODES.INVALID_STATE) {
            throw new BadRequestException(errorMessage);
        }
        else if (errorCode === REPORT_ERROR_CODES.REPORT_NOT_FOUND ||
            errorCode === USER_ERROR_CODES.USER_NOT_FOUND) {
            throw new NotFoundException(errorMessage);
        }
        else if (errorCode === REPORT_ERROR_CODES.SQL_ERROR) {
            throw new InternalServerErrorException(errorMessage);
        }

        this.logger.error(errorMessage, errorStack);

        throw new HttpException(
            errorMessage,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
