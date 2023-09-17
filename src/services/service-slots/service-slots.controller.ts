import {
    BadRequestException,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Put,
    Query,
} from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { OptionalParseIntPipe } from '../../pipes/optional-parse-int-pipe';
import { ServiceSlot } from './service-slots.entity';
import { SERVICE_SLOT_ERROR_CODES, ServiceSlotsService } from './service-slots.service';

const STATE_TRANSITIONS_MAP = {
    [API.ServiceSlotStates.Pending]: [API.ServiceSlotStates.Accepted, API.ServiceSlotStates.Rejected],
    [API.ServiceSlotStates.Accepted]: [API.ServiceSlotStates.Ended],
};

@Controller('service-slots')
export class ServiceSlotsController {
    constructor(private readonly serviceSlotsService: ServiceSlotsService) {
    }

    @Get('')
    async search(
        @Query('clientId', OptionalParseIntPipe) clientId?: number,
        @Query('ownerId', OptionalParseIntPipe) ownerId?: number,
        @Query('state') state?: API.ServiceSlotStates,
        @Query('excludeEnded') excludeEnded?: boolean,
        @Query('offset', OptionalParseIntPipe) offset?: number,
        @Query('limit', OptionalParseIntPipe) limit?: number,
    ): Promise<ServiceSlot[]> {
        return await this.serviceSlotsService
            .createQuery()
            .excludeEnded(excludeEnded === true)
            .searchByServiceOwner(ownerId)
            .searchBySlotClient(clientId)
            .searchByState(state)
            .includeService()
            .includeClient()
            .includeOwner()
            .paginate(offset, limit)
            .orderBy('createdAt', 'DESC')
            .getMany();
    }

    @Put(':id/state/:newState')
    async updateState(
        @Param('id') id: number,
        @Param('newState') newState: API.ServiceSlotStates,
    ): Promise<ServiceSlot> {
        const slot = await this.serviceSlotsService.findById(id);

        if (!slot) {
            throw new NotFoundException(`Service slot with ID ${id} not found`);
        }

        if (!STATE_TRANSITIONS_MAP[slot.state]?.includes(newState)) {
            throw new BadRequestException('Invalid state transition.');
        }

        try {
            return await this.serviceSlotsService.updateServiceSlotState(id, newState);
        } catch (error) {
            // Check if error is a SERVICE_SLOT_ERROR_CODES
            if (error?.code && error.code in SERVICE_SLOT_ERROR_CODES) {
                throw new BadRequestException(error.message);
            }
            throw new HttpException(
                error?.message || 'Unknown error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
