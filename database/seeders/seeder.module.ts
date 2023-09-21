import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { ServiceSlotsService } from 'src/services/service-slots/service-slots.service';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';
import { DatabaseModule } from '../database.module';
import { SeederService } from './seeder.service';
import { ServiceSlotSeeder } from './service-slot.seeder';
import { ServiceSeeder } from './service.seeder';
import { UserSeeder } from './user.seeder';

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([
            User,
            Service,
            ServiceSlot,
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
            useClass: ServiceSlotSeeder,
        },
    ],
})
export class SeederModule {}
