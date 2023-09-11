import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database.module';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { SeederService } from './seeder.service';
import { ServiceSeeder } from './service.seeder';
import { UserSeeder } from './user.seeder';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
            User,
            Service,
        ]),
    ],
    providers: [
        SeederService,
        {
            provide: 'UserSeeder',
            useClass: UserSeeder,
        },
        {
            provide: 'ServiceSeeder',
            useClass: ServiceSeeder,
        },
    ],
})
export class SeederModule {}
