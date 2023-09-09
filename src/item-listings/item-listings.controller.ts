import { Game } from '@diablosnaps/common';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    InternalServerErrorException,
    OnModuleInit,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { IDiabloItem } from 'src/diablo-items/diablo-item.interface';
import { DiabloItemService } from 'src/diablo-items/diablo-item.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { generateMockDiabloItems } from '../diablo-items/diablo-item.mock';
import { ItemListingBid } from './item-listing-bids/item-listing-bid.entity';
import { BID_ERROR_CODES, BidCreationData, ItemListingBidsService } from './item-listing-bids/item-listing-bid.service';
import { ItemListing } from './item-listing.entity';
import { ItemListingsService, TradePostCreateData } from './item-listings.service';
import { SkipGuards } from 'src/auth/skip-guards.decorator';

@UseGuards(JwtAuthGuard)
@Controller('listings')
export class ItemListingsController implements OnModuleInit {
    private diabloItemsMock: IDiabloItem[] = [];

    constructor(
        private diabloItemService: DiabloItemService,
        private readonly itemListingsService: ItemListingsService,
        private readonly itemListingBidsService: ItemListingBidsService,
    ) {
    }

    async onModuleInit() {
        const diabloItemAffixes = await this.diabloItemService.getAffixes();
        this.diabloItemsMock = generateMockDiabloItems(500, diabloItemAffixes);
    }

    @Post('')
    async create(@Body() body: TradePostCreateData): Promise<ItemListing> {
        return await this.itemListingsService.createItemAndListing(body);
    }

    @SkipGuards()
    @Get('search')
    async search(@Query() query: API.TradeGetSearchQuery): Promise<API.TradeGetSearchResponse> {
        const { serverType } = query;
        if (!Game.ServerType[serverType]) {
            throw new HttpException('Invalid serverType', 400);
        }

        const payload = API.deserializeTradeSearchPayload(query.payload);

        let page = +query.page;
        if (isNaN(page)) {
            page = 0;
        }

        let pageSize = +query.pageSize;
        if (isNaN(pageSize)) {
            pageSize = 10;
        }

        let timestamp = +query.timestamp;
        if (isNaN(timestamp)) {
            timestamp = Date.now();
        }

        // You can implement the actual search logic here based on the request
        // For now, we'll use mock data
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const paginatedResults: IDiabloItem[] = this.diabloItemsMock.slice(
            startIndex,
            endIndex,
        );

        const response: API.TradeGetSearchResponse = {
            results: paginatedResults.map<API.TradeSearchResult>((item) => ({
                item: {
                    // should be removed from item interface
                    language: undefined,
                    quality: item.quality,
                    variant: item.variant,
                    type: item.type,
                    power: item.power,
                    requiredLevel: item.requiredLevel,
                    classRestriction: item.classRestriction,
                    inherentAffixes: [
                        { affix: item.inherentAffix0, value: item.inherentAffix0Value },
                        { affix: item.inherentAffix1, value: item.inherentAffix1Value },
                    ]
                        .filter((x) => !isNaN(x.affix?.id))
                        .map<Game.ItemAffix>(({ affix, value }) => ({
                            id: `${affix.id}`,
                            value,
                        })),
                    affixes: [
                        { affix: item.affix0, value: item.affix0Value },
                        { affix: item.affix1, value: item.affix1Value },
                        { affix: item.affix2, value: item.affix2Value },
                        { affix: item.affix3, value: item.affix3Value },
                    ]
                        .filter((x) => !isNaN(x.affix?.id))
                        .map<Game.ItemAffix>(({ affix, value }) => ({
                            id: `${affix.id}`,
                            value,
                        })),
                    socketType: item.socketType,
                },
                listing: {
                    account: null,
                    expiresAt: null,
                    id: item.uuid,
                },
            })),
            hasMore: endIndex < this.diabloItemsMock.length,
            timestamp,
        };
        return response;
    }

    @Post('/bid')
    async bid(@Body() body: BidCreationData): Promise<ItemListingBid> {
        try {
            return await this.itemListingBidsService.createBid(body);
        } catch (error) {
            if (error?.code in BID_ERROR_CODES) {
                throw new BadRequestException({
                    errorCode: error.code,
                    message: error.message,
                });
            }

            throw new InternalServerErrorException('An unexpected error occurred');
        }
    }
}
