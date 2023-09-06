import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'status_description', length: '100', nullable: false})
    statusDescription: string;
}
