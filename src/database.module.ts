// database.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.config';
import { DiabloItemAffix } from './diablo-items/diablo-item-affix.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            name: 'memory',
            useFactory: async () => ({
                type: 'sqlite',
                database: ':memory:',
                entities: [DiabloItemAffix],
                synchronize: true,
                logging: false,
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], // Import the ConfigModule for using the ConfigService
            inject: [ConfigService], // Inject the ConfigService into the factory function
            name: 'default',
            useFactory: async (configService: ConfigService) => {
                await ConfigModule.envVariablesLoaded;
                return typeOrmConfig(configService);
            },
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {
    constructor() {}
}
