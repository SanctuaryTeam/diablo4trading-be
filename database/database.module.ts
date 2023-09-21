// database.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../src/config/database.config';
import { DiabloItemAffix } from '../src/diablo-items/diablo-item-affix.entity';

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
                name: 'memory',
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], // Import the ConfigModule for using the ConfigService
            inject: [ConfigService], // Inject the ConfigService into the factory function
            name: 'default',
            useFactory: async (configService: ConfigService) => {
                await ConfigModule.envVariablesLoaded;
                return {
                    ...typeOrmConfig(configService),
                    name: 'default',
                };
            },
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule {
    constructor() {}

    static isUniqueConstraintViolation(error: any): boolean {
        // Postgres unique violation code
        if (error?.code === '23505') {
            return true;
        }

        // MySQL/MariaDB unique entry error code
        if (error?.code === 'ER_DUP_ENTRY') {
            return true;
        }

        // SQLite unique constraint error message
        if (error?.message && error.message.includes?.('UNIQUE constraint failed')) {
            return true;
        }

        return false;
    }
}
