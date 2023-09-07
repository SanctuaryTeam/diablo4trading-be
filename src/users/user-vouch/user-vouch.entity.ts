import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users.entity'; // import the User entity

@Entity('user_vouch')
export class UserVouch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    recipient_id: number;

    @Column()
    author_id: number;

    @Column()
    service_type: string;

    @Column()
    service_id: number;

    @Column()
    is_positive: boolean;

    @Column()
    rating: number;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;
}
