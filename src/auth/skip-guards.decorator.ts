// skip-guards.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const SKIP_GUARDS_KEY = 'SkipGuards';
export const SkipGuards = () => SetMetadata(SKIP_GUARDS_KEY, true);
