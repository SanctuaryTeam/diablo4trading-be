import { Game } from '@diablosnaps/common';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DiabloItemAffix } from './diablo-item-affix.entity';

@Entity({ name: 'diablo_item' })
export class DiabloItem {
    @PrimaryGeneratedColumn()
    id: number;

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuid();
    }

    @Column({ type: 'uuid', nullable: false, default: 'uuid_generate_v4()' })
    uuid: string;

    @Column({ nullable: true })
    quality: Game.ItemQuality;

    @Column({ nullable: true })
    variant: Game.ItemVariant;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    power: number;

    @Column({ nullable: true })
    type: Game.ItemType;

    @Column({ nullable: true })
    dps: number;

    @Column({ nullable: true })
    armor: number;

    @Column({ nullable: true })
    socketCount: number;

    @Column({ nullable: true })
    socketType: Game.ItemSocketType;

    @Column({ nullable: true })
    requiredLevel: number;

    @Column({ nullable: true })
    classRestriction: Game.Class;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'inherent_affix0_id' })
    inherentAffix0: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    inherentAffix0Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'inherent_affix1_id' })
    inherentAffix1: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    inherentAffix1Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix0_id' })
    affix0: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix0Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix1_id' })
    affix1: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix1Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix2_id' })
    affix2: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix2Value: number;

    @ManyToOne(() => DiabloItemAffix, { nullable: true })
    @JoinColumn({ name: 'affix3_id' })
    affix3: DiabloItemAffix;

    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    affix3Value: number;

    @Column({
        type: 'blob',
        transformer: {
            to: (value: string) => Buffer.from(value),
            from: (value: Buffer) => value.toString(),
        },
    })
    image: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
