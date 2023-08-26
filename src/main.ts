import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Get the WEB_APP_URL from the ConfigService
    const webAppUrl = configService.get<string>('WEB_APP_URL');

    const corsOptions: CorsOptions = {
        origin: webAppUrl,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    };
    app.enableCors(corsOptions);

    const backendPort = configService.get<number>('BACKEND_PORT', 3000);
    await app.listen(backendPort);
}

bootstrap();
