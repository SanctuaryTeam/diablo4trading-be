import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserVouch } from './user-vouch/user-vouch.entity';
import { IUser } from './user.interface';

@Entity()
export class User implements IUser {
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

    @OneToMany(() => UserVouch, userVouch => userVouch.recipient)
    receivedVouches: UserVouch[];

    @OneToMany(() => UserVouch, userVouch => userVouch.author)
    givenVouches: UserVouch[];
}
