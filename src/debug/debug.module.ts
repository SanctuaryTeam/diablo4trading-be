import {Injectable, Module} from '@nestjs/common';
import {DebugController} from './debug.controller';

@Module({
    imports: [],
    providers: [],
    exports: [],
    controllers: [DebugController],
})
export class DebugModule {}