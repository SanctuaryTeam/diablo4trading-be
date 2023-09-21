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
export class Ban {
    @PrimaryColumn({ generated: true, update: false })
    id: number;

    @Column({ type: 'integer', name: 'ban_user_id', nullable: false })
    banUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'ban_user_id' })
    banUser: User;

    @Column({ type: 'integer', name: 'report_id', nullable: true })
    reportId: number;

    @OneToOne(() => Report)
    @JoinColumn({ name: 'report_id' })
    report: Report;

    @Column({ type: 'varchar', name: 'ban_description', length: 500, nullable: true })
    banDescription: string;

    @Column({ type: 'datetime', name: 'ban_end_date', nullable: true })
    banEndDate: Date;

    @Column({ type: 'boolean', name:'permanent_ban', default: false })
    permanentBan: boolean;

    @Column({ type: 'boolean', name: 'deleted', default: false })
    deleted: boolean;
}
