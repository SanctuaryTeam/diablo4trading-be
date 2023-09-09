import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { SKIP_GUARDS_KEY } from './skip-guards.decorator';
import { Observable } from 'rxjs';

export const AuthGuard = (type?: string | string[]) => {
    @Injectable()
    class AuthGuard extends PassportAuthGuard(type) {
        constructor(readonly _reflector: Reflector) {
            super(type);
        }

        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const skipGuards = this._reflector.getAllAndOverride<boolean>(SKIP_GUARDS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (skipGuards) {
                return true;
            }
            return super.canActivate(context);
        }

        handleRequest(err, user, info?, context?, status?) {
            // handle error, user, info as needed
            if (err || !user) {
                throw err;
            }
            return user;
        }
    }

    return AuthGuard;
}
