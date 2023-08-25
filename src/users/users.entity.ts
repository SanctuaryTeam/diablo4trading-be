import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    discordId: string;

    @Column()
    discordName: string;

    @Column()
    battleNetTag: string;

    @Column()
    email: string;

    @Column()
    role: number

    @Column()
    bannedUntil: string

    @CreateDateColumn()
    createdAt: Date
}
