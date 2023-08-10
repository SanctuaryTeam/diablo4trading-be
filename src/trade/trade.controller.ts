// trade.controller.ts
import { Game } from '@diablosnaps/common';
import { Controller, Get, HttpException, OnModuleInit, Query } from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { DiabloItem } from 'src/diablo-items/diablo-item.interface';
import { DiabloItemService } from 'src/diablo-items/diablo-item.service';
import { generateMockDiabloItems } from '../diablo-items/diablo-item.mock';

@Controller('trade')
export class TradeController implements OnModuleInit {
    private diabloItemsMock: DiabloItem[] = [];

    constructor(private diabloItemService: DiabloItemService) {}

    async onModuleInit() {
        const diabloItemAffixes = await this.diabloItemService.getAffixes();
        this.diabloItemsMock = generateMockDiabloItems(500, diabloItemAffixes);
    }

    @Get('search')
    search(@Query() query: API.TradeGetSearchQuery): API.TradeGetSearchResponse {
        const { serverType } = query;
        if (!Game.ServerType[serverType]) {
            throw new HttpException('Invalid serverType', 400);
        }

        const payload = API.deserializeTradeSearchPayload(query.payload);

        let page = +query.page;
        if (isNaN(page)) {
            page = 1;
        }

        let pageSize = +query.pageSize;
        if (isNaN(pageSize)) {
            pageSize = 10;
        }

        let timestamp = +query.timestamp;
        if (isNaN(timestamp)) {
            timestamp = Date.now();
        }

        console.info('search', serverType, page, pageSize, payload);

        // You can implement the actual search logic here based on the request
        // For now, we'll use mock data
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        console.log(startIndex, endIndex);
        const paginatedResults: DiabloItem[] = this.diabloItemsMock.slice(
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
}
