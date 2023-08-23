import { Controller, Get } from '@nestjs/common';
import {ReportingService} from "./reporting.service";

@Controller('reporting')
export class ReportingController {
  constructor(private readonly repoortingService: ReportingService) {}

  @Get('asdf4')
  getHello(): string {
    return this.repoortingService.getHello();
  }
}
