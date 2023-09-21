import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { API } from '@sanctuaryteam/shared';
import { v4 as uuid } from 'uuid';
import { User } from '../../users/users.entity';
import { Service } from '../services.entity';

@Entity({ name: 'service_slot' })
export class ServiceSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuid();
    }

    @Column({ type: 'uuid', nullable: false })
    uuid: string;

    @Column({
        nullable: false,
        default: API.ServiceSlotStates.Pending,
    })
    state: API.ServiceSlotStates;

    @ManyToOne(() => Service, { nullable: false })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ type: 'int', name: 'service_id' })
    serviceId: number;

    /*
     This is 'redundant' information, but fetching service slots for a service owner will be a very common operation.
     Worth the tradeoff vs doing joins every time.
     */
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'service_owner_user_id' })
    serviceOwner: User;

    @Column({ type: 'int', name: 'service_owner_user_id' })
    serviceOwnerUserId: number;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'client_user_id' })
    client: User;

    @Column({ type: 'int', name: 'client_user_id' })
    clientUserId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
