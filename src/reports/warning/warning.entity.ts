import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';

import { Report } from '../report.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class Warning {
    @PrimaryColumn({ generated: true, update: false })
    id: number;

    @Column({ type: 'integer', name: 'warning_user_id', nullable: false })
    warningUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'warning_user_id' })
    warningUser: User;

    @Column({ type: 'integer', name: 'report_id', nullable: true })
    reportId: number;

    @OneToOne(() => Report)
    @JoinColumn({ name: 'report_id' })
    report: Report;

    @Column({ type: 'varchar', name: 'warning_description', length: 500, nullable: true })
    warningDescription: string;

    @Column({ type: 'boolean', name: 'deleted', default: false })
    deleted: boolean;
}
