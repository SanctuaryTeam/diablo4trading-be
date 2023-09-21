import { Service } from 'src/services/services.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { UserVouchCalculation } from './user-vouch/user-vouch-calculation.entity';
import { UserVouch } from './user-vouch/user-vouch.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuid();
    }

    @Column({ type: 'uuid', nullable: false })
    uuid: string;

    @Column()
    discordId: string;

    @Column()
    discordName: string;

    @Column()
    battleNetTag: string;

    @Column()
    email: string;

    @OneToMany(() => Service, service => service.user)
    services: Service[];

    @OneToMany(() => UserVouch, userVouch => userVouch.recipient)
    receivedVouches: UserVouch[];

    @OneToMany(() => UserVouch, userVouch => userVouch.author)
    authoredVouches: UserVouch[];

    @OneToOne(() => UserVouchCalculation, vouchCalculation => vouchCalculation.user, { eager: true, cascade: true })
    @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
    vouchCalculation: UserVouchCalculation;
}
