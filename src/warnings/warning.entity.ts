import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Warning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  reason: number;

  @Column()
  note: string;

  @Column()
  isBan: number;

  @Column()
  issuedBy: number;

  @CreateDateColumn()
  createdAt: Date;
}
