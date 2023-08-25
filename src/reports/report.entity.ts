import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reportingUserId: number;

  @Column()
  reportedUserId: number;

  @Column()
  reportedEntityType: number;

  @Column()
  reportedEntityId: number;

  @Column()
  note: string;

  @Column()
  actionTaken: number;

  @Column()
  createdAt: string;
}
