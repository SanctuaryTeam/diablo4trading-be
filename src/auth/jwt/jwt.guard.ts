import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {JwtService} from '@nestjs/jwt';
import {Observable} from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private jwtService: JwtService) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const secret = process.env.JWT_SECRET;
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }


        try {
            request['auth'] = this.jwtService.verify(
                token,
                {
                    secret: secret,
                }
            );
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
