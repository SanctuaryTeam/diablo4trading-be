import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ReportType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'type_description', length: '100', nullable: false })
    typeDescription: string;
}
