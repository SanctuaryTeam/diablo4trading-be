import { Injectable, Logger, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { v4 as uuid } from 'uuid';
import { RequestModel } from '../request.model';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    private readonly logger = new Logger(DiscordStrategy.name);

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        configService: ConfigService,
    ) {
        super({
            clientID: configService.get<string>('DISCORD_CLIENT_ID'),
            clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
            callbackURL: `${configService.get<string>('WEB_APP_URL')}/auth/discord/callback/`,
            scope: ['identify', 'email', 'connections'],
            passReqToCallback: true,
        });
    }

    async validate(
        @Request() request: RequestModel,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<User> {
        // Custom validation logic here, you can save or retrieve the user from the database
        // For example, you can check if the user exists and return the user object.
        // This user object will be available in the request object after successful authentication.

        // Access the user's connections (linked accounts)
        const connections = profile.connections;
        let battleNetTag = null;
        // You can loop through the connections and extract relevant information
        for (const connection of connections) {
            if (connection.type === 'battlenet') {
                // The user has a Battle.net account linked
                // You can perform additional logic here or save this information to the user's profile.
                battleNetTag = connection.id;
                break;
            }
        }

        if (!battleNetTag) {
            return null;
        }

        const userInformation: Partial<User> = {
            discordName: profile.username,
            discordId: profile.id,
            email: profile.email,
            battleNetTag,
            uuid: uuid(),
            // Add other relevant properties you want to store or use for your application.
        };

        const user = await this.usersService.findOrCreateUser(userInformation);

        const token = this.jwtService.sign({ user });

        request.token = token;

        return user;
    }
}
