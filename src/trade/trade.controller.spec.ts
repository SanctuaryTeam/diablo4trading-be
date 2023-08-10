// trade.controller.ts
import { Game } from '@diablosnaps/common';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchPayload } from '@sanctuaryteam/shared/cjs/api/search';
import { DiabloItem } from 'src/diablo-items/diablo-item.entity';

export interface SearchRequest {
    payload: SearchPayload;
    serverType: Game.ServerType;
}

export interface SearchPageRequest extends SearchRequest {
    timestamp: number;
    page: number;
}

export interface SearchPageResponse {
    results: DiabloItem[];
}

export interface SearchResponse extends SearchPageResponse {
    total: number;
    timestamp: number;
}

const diabloItemsMock = [];

@Controller('trade')
export class TradeController {
    @Get('search')
    search(@Query() request: SearchPageRequest): SearchResponse {
        const { payload, serverType, timestamp, page } = request;

        // You can implement the actual search logic here based on the request
        // For now, we'll use mock data
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        const paginatedResults: DiabloItem[] = diabloItemsMock.slice(startIndex, endIndex);

        const response: SearchPageResponse = {
            results: paginatedResults,
        };

        const total = diabloItemsMock.length;
        return {
            total,
            timestamp,
            ...response,
        };
    }
}
