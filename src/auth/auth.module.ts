import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { DiscordStrategy } from './discord/discord.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1m' },
        }),
        UsersModule,
        ConfigModule,
    ],
    providers: [DiscordStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
