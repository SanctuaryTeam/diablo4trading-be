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

    @Column({ nullable: false })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: false })
    itemListingId: number;

    @OneToOne(() => ItemListing)
    @JoinColumn({ name: 'item_listing_id' })
    itemListing: ItemListing;

    @Column({ nullable: true })
    bidAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
