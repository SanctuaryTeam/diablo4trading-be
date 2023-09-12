import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database.module';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { SeederService } from './seeder.service';
import { ServiceSeeder } from './service.seeder';
import { UserSeeder } from './user.seeder';
import { ServiceSlotSeeder } from './service-slot.seeder';
import { ServiceSlotsService } from 'src/services/service-slots/service-slots.service';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
            User,
            Service,
            ServiceSlot
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
        ServiceSlotsService,
        {
            provide: 'ServiceSlotSeeder',
            useClass: ServiceSlotSeeder
        },
    ],
})
export class SeederModule {}
