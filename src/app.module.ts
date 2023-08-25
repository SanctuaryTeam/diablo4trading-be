import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/database.config';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {ReportsModule} from './reports/reports.module';
import {DebugModule} from './debug/debug.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], // Import the ConfigModule for using the ConfigService
            inject: [ConfigService], // Inject the ConfigService into the factory function
            useFactory: async (configService: ConfigService) => {
                await ConfigModule.envVariablesLoaded;
                return typeOrmConfig(configService);
            },
        }),
        ConfigModule.forRoot(),
        ReportsModule,
        DebugModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
