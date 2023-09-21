import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { UserVouch } from 'src/users/user-vouch/user-vouch.entity';
import { User } from 'src/users/users.entity';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class AddUuidColumnToTables1695160701399 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'uuid',
                type: 'varchar',
                isNullable: true,
                length: '36',
            }),
        );
        await queryRunner.addColumn(
            'service',
            new TableColumn({
                name: 'uuid',
                type: 'varchar',
                isNullable: true,
                length: '36',
            }),
        );
        await queryRunner.addColumn(
            'service_slot',
            new TableColumn({
                name: 'uuid',
                type: 'varchar',
                isNullable: true,
                length: '36',
            }),
        );
        await queryRunner.addColumn(
            'user_vouch',
            new TableColumn({
                name: 'uuid',
                type: 'varchar',
                isNullable: true,
                length: '36',
            }),
        );

        // Update existing data (generate UUIDs for existing records)
        const userRepository = queryRunner.connection.getRepository(User);
        const users = await userRepository.find();
        for (const user of users) {
            user.uuid = uuid();
            await userRepository.update(user.id, user);
        }

        const serviceRepository = queryRunner.connection.getRepository(Service);
        const services = await serviceRepository.find();
        for (const service of services) {
            service.uuid = uuid();
            await serviceRepository.update(service.id, service);
        }

        const serviceSlotRepository = queryRunner.connection.getRepository(ServiceSlot);
        const slots = await serviceSlotRepository.find();
        for (const slot of slots) {
            slot.uuid = uuid();
            await serviceSlotRepository.update(slot.id, slot);
        }

        const userVouchRepository = queryRunner.connection.getRepository(UserVouch);
        const userVouches = await userVouchRepository.find();
        for (const userVouch of userVouches) {
            userVouch.uuid = uuid();
            await userVouchRepository.update(userVouch.id, userVouch);
        }

        const tableNames = ['user', 'service', 'service_slot', 'user_vouch']; // Add your table names here

        for (const tableName of tableNames) {
            const updatedColumn = new TableColumn({
                name: 'uuid',
                type: 'varchar',
                isNullable: false,
                length: '36',
            });
            await queryRunner.changeColumn(tableName, 'uuid', updatedColumn);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'uuid');
        await queryRunner.dropColumn('service', 'uuid');
        await queryRunner.dropColumn('service_slot', 'uuid');
        await queryRunner.dropColumn('user_vouch', 'uuid');
    }
}
