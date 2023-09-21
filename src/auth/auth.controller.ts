// auth.controller.ts
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { fromEntity as userDtoFromEntity } from './../users/user.dto';
import { DiscordAuthGuard } from './discord/discord.guard';
import { RequestModel } from './request.model';

@Controller('auth')
export class AuthController {
    constructor(
        private jwtService: JwtService,
    ) {
    }

    @Get('discord')
    @UseGuards(DiscordAuthGuard)
    async login() {
        // Generate the OAuth login URL
        // const redirectUrl = this.discordStrategy._oauth2.getAuthorizeUrl();
        // Return the redirect URL as a JSON response
    }

    @Get('discord/callback')
    @UseGuards(DiscordAuthGuard)
    async callback(@Request() req: RequestModel) {
        return { user: userDtoFromEntity(req.user), token: req.token };
    }
}
