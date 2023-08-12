import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/users.entity';
import { Service } from '../services.entity';

export enum SERVICE_SLOT_STATES {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    ENDED = 'ENDED',
}

@Entity({ name: 'service_slot' })
export class ServiceSlot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        default: SERVICE_SLOT_STATES.PENDING,
    })
    state: SERVICE_SLOT_STATES;

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
