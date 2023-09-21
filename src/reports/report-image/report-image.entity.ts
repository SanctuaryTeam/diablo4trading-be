import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { Report } from '../report.entity';

@Entity()
export class ReportImage {
    @PrimaryColumn({ generated: true, update: false })
    id: number;

    @Column ( { type: 'integer', name: 'report_id', nullable: false } )
    reportId: number;

    @ManyToOne ( () => Report )
    @JoinColumn ( { name: 'report_id' } )
    report: Report;
    
    @Column({
        type: 'blob',
        name: 'image',
        transformer: {
            to: (value: string) => Buffer.from(value),
            from: (value: Buffer) => value.toString(),
        },
        nullable: false,
    })
    image: string;
}
