import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ItemListingBid } from './item-listing-bid.entity';
import { ItemListing, ItemListingState } from '../item-listing.entity';
import { ServiceResponseException } from '../../common/exceptions';

export type BidType = 'bid' | 'buyout';
export type BidCreationData = Pick<ItemListingBid, 'userId' | 'itemListingId' | 'bidAmount'> & { type: BidType };

const MAX_DEADLOCK_RETRIES = 10;
const DATABASE_TYPE = process.env.DATABASE_TYPE;

export enum BID_ERROR_CODES {
    ITEM_LISTING_NOT_FOUND  = 'ITEM_LISTING_NOT_FOUND',
    INVALID_BID_AMOUNT      = 'INVALID_BID_AMOUNT',
    ITEM_LISTING_NOT_ACTIVE = 'ITEM_LISTING_NOT_ACTIVE',
}

@Injectable ()
export class ItemListingBidsService {
    private readonly logger = new Logger(ItemListingBidsService.name);

    constructor (
        @InjectRepository ( ItemListingBid ) private readonly itemListingBidsRepository: Repository<ItemListingBid>
    ) {
    }

    async createBid ( data: BidCreationData ) {
        let retries = 0;

        while ( retries < MAX_DEADLOCK_RETRIES ) {
            try {
                return await this.createBidTransaction ( data );
            } catch ( error ) {
                if ( typeof error?.message === 'string' && error.message.toLowerCase ().includes ( 'deadlock' ) ) {
                    retries++;
                    await new Promise ( res => setTimeout ( res, Math.random () * 200 ) );
                } else {
                    this.logger.error ( error );
                    throw error;
                }
            }
        }

        throw new InternalServerErrorException ( 'Transaction failed after multiple retries due to deadlocks.' );
    }

    /* openingBid - the amount the seller wants to start the auction at
     * currentBidPrice - the current highest bid
     * bidIncrement - the amount the next bid must be greater than the current bid
     */
    private async createBidTransaction ( data: BidCreationData ) {
        const manager = this.itemListingBidsRepository.manager;

        return await manager.transaction ( async ( transactionalManager: EntityManager ) => {
            const itemListing = await transactionalManager.findOne ( ItemListing, {
                where: { id: data.itemListingId },
                // Lock reads and writes to this row until the transaction is complete to prevent bid race conditions
                ...( DATABASE_TYPE !== 'sqlite' ? { lock: { mode: 'pessimistic_write' } } : {} ),
            } );

            if ( !itemListing ) {
                throw new ServiceResponseException ( BID_ERROR_CODES.ITEM_LISTING_NOT_FOUND, 'Item listing not found.' );
            }

            if ( itemListing.state !== ItemListingState.ACTIVE ) {
                throw new ServiceResponseException ( BID_ERROR_CODES.ITEM_LISTING_NOT_ACTIVE, 'Item listing is not actively in auction.' );
            }

            const bidIncrement = itemListing.bidIncrement || 0;
            let validBid = false;

            // Buyouts
            if ( data.type === 'buyout' && itemListing.buyNowPrice ) {
                if ( data.bidAmount < itemListing.buyNowPrice ) {
                    throw new ServiceResponseException ( BID_ERROR_CODES.INVALID_BID_AMOUNT, 'Buyout amount must be greater than the listing\'s buy now price.' );
                }

                itemListing.state = ItemListingState.SOLD;
                validBid = true;
            }

            // Bids
            if ( !validBid && itemListing.currentBidPrice ) {
                if ( data.bidAmount <= ( itemListing.currentBidPrice + bidIncrement ) ) {
                    throw new ServiceResponseException ( BID_ERROR_CODES.INVALID_BID_AMOUNT, `Bid amount must be greater than the current bid price (${itemListing.currentBidPrice}) + minimum bid increment (${itemListing.bidIncrement}).` );
                }
            } else if ( !validBid && data.bidAmount < ( itemListing.openingBid + bidIncrement ) ) {
                throw new ServiceResponseException ( BID_ERROR_CODES.INVALID_BID_AMOUNT, `Bid amount is less than the listing's opening bid (${itemListing.openingBid}) + minimum bid increment (${itemListing.bidIncrement}).` );
            }

            itemListing.currentBidPrice = data.bidAmount;
            await transactionalManager.save ( ItemListing, itemListing );

            const bid = transactionalManager.create ( ItemListingBid, {
                userId       : data.userId,
                itemListingId: data.itemListingId,
                bidAmount    : data.bidAmount,
            } );

            return await transactionalManager.save ( ItemListingBid, bid );
        } );
    }
}
