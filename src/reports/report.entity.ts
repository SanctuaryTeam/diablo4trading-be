import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

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
  type: number;

  @Column()
  note: string;

  @Column()
  actionTaken: number;

  @Column()
  issuedWarningId: number;

  @Column()
  resolvedBy: number;

  @UpdateDateColumn()
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
