import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { ReportType } from '../report-type/report-type.entity';

@Entity()
export class ReportReason {
    @PrimaryColumn({ generated: true, update: false })
    id: number;

    @Column ( { type: 'integer', name: 'report_type_id', nullable: false } )
    reportTypeId: number;

    @OneToOne ( () => ReportType )
    @JoinColumn ( { name: 'report_type_id' } )
    reportType: ReportType;

    @Column({ type: 'varchar', name: 'reason_description', length: '100', nullable: false })
    reasonDescription: string;
}
