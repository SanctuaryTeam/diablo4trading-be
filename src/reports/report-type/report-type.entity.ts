import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ReportType {
    @PrimaryColumn({ generated: true, update: false })
    id: number;

    @Column({ type: 'varchar', name: 'type_description', length: '100', nullable: false })
    typeDescription: string;
}
