import { User } from 'src/users/users.entity';
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
import { ItemListing } from '../item-listing.entity';

@Entity('item_listing_bid')
export class ItemListingBid {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'user_id', nullable: false })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'uuid', name: 'item_listing_id', nullable: false })
    itemListingId: string;

    @OneToOne(() => ItemListing)
    @JoinColumn({ name: 'item_listing_id' })
    itemListing: ItemListing;

    @Column({ type: 'integer', nullable: true })
    bidAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
