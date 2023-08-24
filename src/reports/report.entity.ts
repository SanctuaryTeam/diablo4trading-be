import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ReportingUserId: number;

  @Column()
  ReportedEntityType: number;

  @Column()
  ReportedEntityId: number;

  @Column()
  Note: string;

  @Column()
  ActionTaken: number;

  @Column()
  CreatedAt: string;
  // Add other columns or properties as needed.
}