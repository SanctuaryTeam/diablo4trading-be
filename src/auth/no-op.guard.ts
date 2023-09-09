import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class NoOpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
