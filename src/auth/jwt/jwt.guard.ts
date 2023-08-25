import {ExecutionContext, ImATeapotException, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from '../../users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService, private userService: UsersService) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const secret = process.env.JWT_SECRET;
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            request['auth'] = await this.jwtService.verifyAsync(
                token,
                {
                    secret: secret,
                }
            );

        } catch {
            throw new UnauthorizedException();
        }

        if (!await this.userService.validateUserFromJWT(request['auth'].user)) {
            // JWT token is valid, but there is a state difference between the JWT user object and the database. The user should be logged out.
            throw new ImATeapotException();
        }

        return true;
    }

    private extractTokenFromHeader(request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
