
import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { Report } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ReportingController} from "./reporting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportingService],
  exports: [ReportingService],
  controllers: [ReportingController],
})
export class ReportingModule {}