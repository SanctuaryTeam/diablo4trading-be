import { Injectable } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
