import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt/jwt.guard';

@Controller('debug')
@UseGuards(JwtAuthGuard)
export class DebugController {
    @Get('jwt')
    async jwtDebug(@Req() req): Promise<any> {
        console.log(req.auth)
        return req.auth;
    }
}
