import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserVouchCalculation } from './user-vouch/user-vouch-calculation.entity';
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

    @OneToOne(() => UserVouchCalculation, vouchCalculation => vouchCalculation.user, { eager: true, cascade: true })
    @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
    vouchCalculation: UserVouchCalculation;
}
