import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { DiabloItem } from 'src/diablo-items/diablo-item.entity';
import { ReportReason } from './report-reason/report-reason.entity';
import { ReportType } from './report-type/report-type.entity';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';

// TODO : ANDREW : Do we move these to 'shared'?
export enum REPORT_STATES {
    PENDING = 'PENDING',
    REVIEWING = 'REVIEWING',
    CANCELLED = 'CANCELLED',
    CLOSED = 'CLOSED',
}

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column ( { type: 'integer', name: 'report_type_id', nullable: false } )
    reportTypeId: number;

    @OneToOne ( () => ReportType )
    @JoinColumn ( { name: 'report_type_id' } )
    reportType: ReportType;

    @Column ( { type: 'integer', name: 'report_reason_id', nullable: false } )
    reportReasonId: number;

    @OneToOne ( () => ReportReason )
    @JoinColumn ( { name: 'report_reason_id' } )
    reportReason: ReportReason;

    @Column({ type: 'varchar', length: 500, nullable: false, default: '' })
    reportDescription: string;

    @Column({ type: 'integer', name: 'reported_by_user_id', nullable: false })
    reportedByUserId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'reported_by_user_id' })
    reportedByUser: User;

    @Column({ type: 'boolean', name: 'user_accepted_terms_of_use', default: false })
    userAcceptedTermsOfUse: boolean;

    // We should check for at least 1 NOT null (User, Item, Service)
    @Column({ type: 'integer', name: 'reported_user_id', nullable: true })
    reportedUserId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'reported_user_id' })
    reportedUser: User;

    @Column ( { type: 'integer', name: 'reported_diablo_item_id', nullable: true } )
    reportedDiabloItemId: number;

    @OneToOne ( () => DiabloItem )
    @JoinColumn ( { name: 'reported_diablo_item_id' } )
    reportedDiabloItem: DiabloItem;

    @Column({ type: 'integer', name: 'reported_service_id', nullable: true })
    reportedServiceId: number;

    @OneToOne(() => Service)
    @JoinColumn({ name: 'reported_service_id' })
    reportedService: Service;

    @Column({
        type: 'varchar',
        name: 'state',
        nullable: false,
        default: REPORT_STATES.PENDING,
    })
    state: REPORT_STATES;

    @Column({ type: 'integer', name: 'assigned_user_id', nullable: true })
    assignedUserId: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'assigned_user_id' })
    assignedUser: User;

    @CreateDateColumn({ type: 'datetime', name: 'created_at', nullable: false, default: 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @UpdateDateColumn({ type: 'datetime', name: 'updated_at', nullable: false, default: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: string;

    @Column({ type: 'boolean', name: 'deleted', default: false })
    deleted: boolean;
}
