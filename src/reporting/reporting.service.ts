// reporting.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportingService {
  constructor() {}

  getHello(): string {
    return 'hw';
  }

  createReport(): string {
    return "test";
  }
}
