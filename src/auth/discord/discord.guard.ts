import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { OAuth2Exception } from '../oauth2.exception';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err: Error, user: any, info: any, context: ExecutionContext) {
        if (err && err.name == 'TokenError') {
            throw new OAuth2Exception('Failed to authenticate with Discord. Please try again.');
        }

        return super.handleRequest(err, user, info, context);
    }
}
