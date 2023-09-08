import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { UserVouchService } from './user-vouch.service';
import { RequestModel } from 'src/auth/request.model';
import { CloseUserVouchDto } from './close-user-vouch.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('user-vouch')
export class UserVouchController {
    constructor(private readonly userVouchService: UserVouchService) {}

    @Post('/close')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createVouchDto: CloseUserVouchDto, @Request() req: RequestModel) {
        const user = req.user;
        return await this.userVouchService.closeVouch(createVouchDto, user);
    }
}
