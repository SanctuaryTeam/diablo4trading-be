import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

type SupportedConnectionOptions =
    | MysqlConnectionOptions
    | SqliteConnectionOptions;
type SupportedConnectionTypes = 'mysql' | 'mariadb' | 'sqlite';
type SharedConnectionOptions =
    | 'type'
    | 'database'
    | 'entities'
    | 'synchronize'
    | 'migrations'
    | 'logging'
    | 'namingStrategy';
const DatabaseTypes: { [key: string]: SupportedConnectionTypes } = {
    Sqlite: 'sqlite',
    Mysql: 'mysql',
};

export const typeOrmConfig = (
    configService?: ConfigService,
): DataSourceOptions => {
    let typeOrmOptions: DataSourceOptions;

    if (!configService) {
        dotenvConfig();
        configService = {
            get: (property: string) => process.env[property],
        } as ConfigService;
    }

    const type = configService.get<SupportedConnectionTypes>('DATABASE_TYPE');
    const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

    const defaultOptions: Required<
        Pick<SupportedConnectionOptions, SharedConnectionOptions>
    > = {
        type,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: false,
        migrations: [__dirname + '/../../database/migrations/*.{js,ts}'],
        database: configService.get<string>('DATABASE_NAME'),
        logging: isDevelopment,
        namingStrategy: new SnakeNamingStrategy(),
    };

    switch (type) {
        case DatabaseTypes.Sqlite:
            typeOrmOptions = defaultOptions;
            break;
        case DatabaseTypes.Mysql:
            typeOrmOptions = {
                host: configService.get<string>('DATABASE_HOST'),
                port: configService.get<number>('DATABASE_PORT'),
                username: configService.get<string>('DATABASE_USERNAME'),
                password: configService.get<string>('DATABASE_PASSWORD'),
                ...defaultOptions,
            };
            break;
        default:
            throw new Error('Invalid DATABASE_TYPE configuration.');
    }

    return typeOrmOptions;
};
