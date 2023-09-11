import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SKIP_GUARDS_KEY } from './skip-guards.decorator';

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
    }

    return AuthGuard;
};
