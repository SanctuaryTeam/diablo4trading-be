import { Controller, Get } from '@nestjs/common';
import {ReportsService} from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

  @Get('asdf4')
    getHello(): string {
        return this.reportsService.getHello();
    }

  @Get('all')
  async getReports() {
      return this.reportsService.findById(1)
  }
}
