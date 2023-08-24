
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ReportsController} from "./reports.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  providers: [ReportsService],
  exports: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}