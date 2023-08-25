
import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import {UsersService} from '../users/users.service';
import {User} from '../users/users.entity';
import {Warning} from '../warnings/warning.entity';
import {WarningsService} from '../warnings/warnings.service';

@Module({
    imports: [TypeOrmModule.forFeature([Report, User, Warning])],
    providers: [ReportsService, UsersService, WarningsService],
    exports: [ReportsService],
    controllers: [ReportsController],
})
export class ReportsModule {}
