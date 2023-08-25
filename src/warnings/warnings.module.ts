import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UsersService} from '../users/users.service';
import {User} from '../users/users.entity';
import {WarningsService} from './warnings.service';
import {Warning} from './warning.entity';
import {WarningsController} from './warnings.controller';
import {ReportsService} from '../reports/reports.service';
import {Report} from '../reports/report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Warning, User, Report])],
    providers: [WarningsService, UsersService, ReportsService],
    exports: [WarningsService],
    controllers: [WarningsController],
})
export class ReportsModule {}
