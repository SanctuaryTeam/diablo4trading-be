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
import { OptionalParseIntPipe } from '../../pipes/optional-parse-int-pipe';
import { SERVICE_SLOT_STATES, ServiceSlot } from './service-slots.entity';
import { SERVICE_SLOT_ERROR_CODES, ServiceSlotsService } from './service-slots.service';

const STATE_TRANSITIONS_MAP = {
    [SERVICE_SLOT_STATES.PENDING]: [SERVICE_SLOT_STATES.ACCEPTED, SERVICE_SLOT_STATES.REJECTED],
    [SERVICE_SLOT_STATES.ACCEPTED]: [SERVICE_SLOT_STATES.ENDED],
};

@Controller('service-slots')
export class ServiceSlotsController {
    constructor(private readonly serviceSlotsService: ServiceSlotsService) {
    }

    @Get('')
    async search(
        @Query('clientId', OptionalParseIntPipe) clientId?: number,
        @Query('ownerId', OptionalParseIntPipe) ownerId?: number,
        @Query('state') state?: SERVICE_SLOT_STATES,
        @Query('excludeEnded') excludeEnded?: string,
        @Query('offset', OptionalParseIntPipe) offset?: number,
        @Query('limit', OptionalParseIntPipe) limit?: number,
    ): Promise<ServiceSlot[]> {
        return await this.serviceSlotsService
            .createQuery()
            .excludeEnded(excludeEnded === 'true')
            .searchByServiceOwner(ownerId)
            .searchBySlotClient(clientId)
            .searchByState(state)
            .paginate(offset, limit)
            .orderBy('createdAt', 'DESC')
            .getMany();
    }

    @Put(':id/state/:newState')
    async updateState(
        @Param('id') id: number,
        @Param('newState') newState: SERVICE_SLOT_STATES,
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
