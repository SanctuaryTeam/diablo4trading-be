import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt/jwt.guard';
import {WarningsService} from './warnings.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class WarningsController {
    constructor(private readonly warningsService: WarningsService) {
    }
}
