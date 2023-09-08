import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RequestModel } from 'src/auth/request.model';
import { CloseUserVouchDto } from './close-user-vouch.dto';
import { UserVouchService } from './user-vouch.service';

@Controller('user/vouch')
export class UserVouchController {
    constructor(private readonly userVouchService: UserVouchService) {}

    @Post('/')
    @UseGuards(JwtAuthGuard)
    async closeVouch(@Body() createVouchDto: CloseUserVouchDto, @Request() req: RequestModel) {
        const user = req.user;
        return await this.userVouchService.closeVouch(createVouchDto, user);
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    async openVouches(@Request() req: RequestModel) {
        const user = req.user;
        return await this.userVouchService.getOpenVouches(user);
    }
}
