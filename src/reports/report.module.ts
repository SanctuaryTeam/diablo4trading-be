import { Module } from '@nestjs/common';
import { Report } from './report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Report, User]),
    ],
    providers: [ReportService, UsersService],
    controllers: [ReportController],
})
export class ReportModule {}
