import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'diabloItemAffix' })
export class DiabloItemAffix {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
