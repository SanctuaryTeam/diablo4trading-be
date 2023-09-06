import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportSeverity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'severity_description', length: '100', nullable: false})
    severityDescription: string;
}
