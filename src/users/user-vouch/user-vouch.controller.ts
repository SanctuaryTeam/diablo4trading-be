import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RequestModel } from 'src/auth/request.model';
import { CloseUserVouchDto } from './close-user-vouch.dto';
import { UserVouch } from './user-vouch.entity';
import { UserVouchService } from './user-vouch.service';

@UseGuards(JwtAuthGuard)
@Controller('user/vouch')
export class UserVouchController {
    constructor(private readonly userVouchService: UserVouchService) {}

    @Post('/close')
    async closeVouch(@Body() closeVouchDto: CloseUserVouchDto, @Request() req: RequestModel): Promise<UserVouch> {
        const user = req.user;
        return await this.userVouchService.closeVouch(closeVouchDto, user);
    }

    @Get('/')
    async openVouches(@Request() req: RequestModel) {
        const user = req.user;
        return await this.userVouchService.getOpenVouches(user);
    }
}
