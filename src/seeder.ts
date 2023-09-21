import { NestFactory } from '@nestjs/core';
import { SeederModule } from 'database/seeders/seeder.module';
import { SeederService } from 'database/seeders/seeder.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeederModule);
    const seederArg = process.argv.find(arg => arg.startsWith('--seeder='));
    const seederNames = seederArg ? seederArg.split('=')[1] : null;

    if (!seederNames) {
        console.error('Please provide a SeederName using --seeder=SeederName1,SeederName2 format.');
        process.exit(1);
    }

    const seeders = seederNames.split(',');

    const seederService = app.get(SeederService);
    for (const seeder of seeders) {
        await seederService.runSeeder(seeder);
    }
    await app.close();
}
bootstrap();
