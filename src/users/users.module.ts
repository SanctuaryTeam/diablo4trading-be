import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVouch } from './user-vouch/user-vouch.entity';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserVouch])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
