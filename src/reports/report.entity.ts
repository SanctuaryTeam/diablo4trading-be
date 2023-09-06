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
import { ReportSeverity } from './report-severity/report-severity.entity';
import { ReportStatus } from './report-status/report-status.entity';
import { ReportType } from './report-type/report-type.entity';
import { Service } from 'src/services/services.entity';
import { User } from 'src/users/users.entity';

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

    @Column ( { type: 'integer', name: 'report_status_id', nullable: false } )
    reportStatusId: number;

    @OneToOne ( () => ReportStatus )
    @JoinColumn ( { name: 'report_status_id' } )
    reportStatus: ReportStatus;

    @Column ( { type: 'integer', name: 'report_severity_id', nullable: false } )
    reportSeverityId: number;

    @OneToOne ( () => ReportSeverity )
    @JoinColumn ( { name: 'report_severity_id' } )
    reportSeverity: ReportSeverity;

    @CreateDateColumn({ type: 'datetime', name: 'created_at_utc', nullable: false, default: 'CURRENT_TIMESTAMP' })
    createdAtUtc: Date;
    
    @UpdateDateColumn({ type: 'datetime', name: 'updated_at_utc', nullable: false, default: 'CURRENT_TIMESTAMP' })
    updatedAtUtc: Date;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: string;
}
