import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discordName: string;

  @Column()
  battleNetTag: string;

  @Column()
  username: string;

  @Column()
  email: string;
  // Add other columns or properties as needed.
}