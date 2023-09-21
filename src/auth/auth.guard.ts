import { ExecutionContext, Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as PassportAuthGuard, IAuthGuard } from '@nestjs/passport';
import { SKIP_GUARDS_KEY } from './skip-guards.decorator';

export const AuthGuard = (type?: string | string[]): Type<IAuthGuard> => {
    @Injectable()
    class AuthGuard extends PassportAuthGuard(type) {
        constructor(readonly _reflector: Reflector) {
            super(type);
        }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const skipGuards = this._reflector.getAllAndOverride<boolean>(SKIP_GUARDS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (skipGuards) {
                try {
                    // add the user by invoking the super context
                    await super.canActivate(context);
                } catch {
                    // do nothing on errors
                } finally {
                    return true;
                }
            }
            return super.canActivate(context) as Promise<boolean>;
        }
    }

    return AuthGuard;
};
