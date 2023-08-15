import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DiabloItem } from '../diablo-items/diablo-item.entity';
import { User } from '../users/users.entity';

export enum ItemListingState {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    CLOSED = 'CLOSED',
}

@Entity('item_listing')
export class ItemListing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'integer', name: 'seller_id', nullable: false })
    sellerId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'seller_id' })
    seller: User;

    @Column({ type: 'integer', name: 'diablo_item_id', nullable: false })
    diabloItemId: number;

    @OneToOne(() => DiabloItem)
    @JoinColumn({ name: 'diablo_item_id' })
    diabloItem: DiabloItem;

    @Column({ type: 'integer', nullable: true })
    reservePrice: number;

    @Column({ type: 'integer', nullable: false, default: 0 })
    openingBid: number;

    @Column({ type: 'integer', nullable: true, default: 0 })
    bidIncrement: number;

    @Column({ type: 'integer', nullable: false })
    duration: number;

    @Column({ type: 'integer', nullable: true })
    buyNowPrice: number;

    @Column({ type: 'integer', nullable: true })
    currentBidPrice: number;

    @Column({ type: 'varchar', nullable: false, default: 'ACTIVE' })
    state: ItemListingState;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
