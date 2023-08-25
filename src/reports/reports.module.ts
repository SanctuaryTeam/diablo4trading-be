
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import {UsersService} from '../users/users.service';
import {User} from '../users/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Report, User])],
    providers: [ReportsService, UsersService],
    exports: [ReportsService],
    controllers: [ReportsController],
})
export class ReportsModule {}
