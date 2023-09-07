import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ItemListingBid } from './item-listing-bid.entity';
import { ItemListing, ItemListingState } from '../item-listing.entity';
import { ServiceResponseException } from '../../common/exceptions';

export type BidType = 'bid' | 'buyout';
export type BidCreationData = Pick<ItemListingBid, 'userId' | 'bidAmount'> & { itemListingUuid: string; type: BidType };

const MAX_DEADLOCK_RETRIES = 10;
const DATABASE_TYPE = process.env.DATABASE_TYPE;

export enum BID_ERROR_CODES {
    LISTING_NOT_FOUND   = 'LISTING_NOT_FOUND',
    INVALID_BID_OPENING = 'INVALID_BID_OPENING',
    INVALID_BID_BUY     = 'INVALID_BID_BUY',
    INVALID_BID_CURRENT = 'INVALID_BID_CURRENT',
    LISTING_INACTIVE    = 'LISTING_INACTIVE',
}

const BID_ERROR_MESSAGES = {
    LISTING_NOT_FOUND  : 'Item listing not found.',
    LISTING_INACTIVE   : 'Item listing is not actively in auction.',
    INVALID_BID_OPENING: ( openingBid: number, bidIncrement: number ) => `Bid amount is less than the listing's opening bid (${openingBid}) + minimum bid increment (${bidIncrement}).`,
    INVALID_BID_BUY    : 'Buyout amount must be greater than the listing\'s buy now price.',
    INVALID_BID_CURRENT: ( currentBidPrice: number, bidIncrement: number ) => `Bid amount must be greater than the current bid price (${currentBidPrice}) + minimum bid increment (${bidIncrement}).`,
    TRANSACTION        : 'Transaction failed after multiple retries due to deadlocks.',
};

@Injectable ()
export class ItemListingBidsService {
    private readonly logger = new Logger ( ItemListingBidsService.name );

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

        throw new InternalServerErrorException ( BID_ERROR_MESSAGES.TRANSACTION );
    }

    /* openingBid - the amount the seller wants to start the auction at
     * currentBidPrice - the current highest bid
     * bidIncrement - the amount the next bid must be greater than the current bid
     */
    private async createBidTransaction ( { type, bidAmount, userId, itemListingUuid }: BidCreationData ) {
        const manager = this.itemListingBidsRepository.manager;

        return await manager.transaction ( async ( transactionalManager: EntityManager ) => {
            const itemListing = await transactionalManager.findOne ( ItemListing, {
                where: { uuid: itemListingUuid },
                ...( DATABASE_TYPE !== 'sqlite'
                    ? { lock: { mode: 'pessimistic_write' } }
                    : {} ),
            } );

            if ( !itemListing ) {
                throw new ServiceResponseException ( BID_ERROR_CODES.LISTING_NOT_FOUND, BID_ERROR_MESSAGES.LISTING_NOT_FOUND );
            }


            const { buyNowPrice, currentBidPrice, openingBid, id: itemListingId } = itemListing;
            const bidIncrement = itemListing.bidIncrement || 0;

            if ( itemListing.state !== ItemListingState.ACTIVE ) {
                throw new ServiceResponseException ( BID_ERROR_CODES.LISTING_INACTIVE, BID_ERROR_MESSAGES.LISTING_INACTIVE );
            }

            let validBid = false;

            // Buyouts
            if ( type === 'buyout' && buyNowPrice ) {
                if ( bidAmount < buyNowPrice ) {
                    throw new ServiceResponseException ( BID_ERROR_CODES.INVALID_BID_BUY, BID_ERROR_MESSAGES.INVALID_BID_BUY );
                }

                itemListing.state = ItemListingState.SOLD;
                validBid = true;
            }

            // Bids
            if ( !validBid && currentBidPrice ) {
                if ( bidAmount <= currentBidPrice + bidIncrement ) {
                    throw new ServiceResponseException ( BID_ERROR_CODES.INVALID_BID_CURRENT, BID_ERROR_MESSAGES.INVALID_BID_CURRENT ( currentBidPrice, bidIncrement ) );
                }
            } else if ( !validBid && bidAmount < openingBid + bidIncrement ) {
                throw new ServiceResponseException ( BID_ERROR_CODES.INVALID_BID_OPENING, BID_ERROR_MESSAGES.INVALID_BID_OPENING ( openingBid, bidIncrement ) );
            }

            itemListing.currentBidPrice = bidAmount;
            await transactionalManager.save ( ItemListing, itemListing );

            const bid = transactionalManager.create ( ItemListingBid, {
                userId,
                itemListingId,
                bidAmount,
            } );

            return await transactionalManager.save ( ItemListingBid, bid );
        } );
    }
}
