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
    Request,
    UseGuards,
} from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RequestModel } from 'src/auth/request.model';
import { SkipGuards } from 'src/auth/skip-guards.decorator';
import { OptionalParseIntPipe } from '../../pipes/optional-parse-int-pipe';
import { fromEntity as serviceSlotDtoFromEntity } from './service-slots.dto';
import { SERVICE_SLOT_ERROR_CODES, ServiceSlotsService } from './service-slots.service';

const STATE_TRANSITIONS_MAP = {
    [API.ServiceSlotStates.Pending]: [API.ServiceSlotStates.Accepted, API.ServiceSlotStates.Rejected],
    [API.ServiceSlotStates.Accepted]: [API.ServiceSlotStates.Ended],
};

@UseGuards(JwtAuthGuard)
@Controller('service-slots')
export class ServiceSlotsController {
    constructor(private readonly serviceSlotsService: ServiceSlotsService) {
    }

    @SkipGuards()
    @Get('')
    async search(
        @Request() req: RequestModel,
        @Query('userId') userUuid?: string,
        @Query('state') state?: API.ServiceSlotStates,
        @Query('excludeEnded') excludeEnded?: boolean,
        @Query('offset', OptionalParseIntPipe) offset?: number,
        @Query('limit', OptionalParseIntPipe) limit?: number,
    ): Promise<API.ServiceSlotDto[]> {
        let serviceSlotQuery = this.serviceSlotsService.createQuery();
        const reqUserId = req.user?.uuid;
        reqUserId === userUuid && serviceSlotQuery.searchByUserUuid(userUuid);
        return await serviceSlotQuery
            .excludeEnded(excludeEnded === true)
            .searchByState(state)
            .includeService()
            .includeClient()
            .includeOwner()
            .paginate(offset, limit)
            .orderBy('createdAt', 'DESC')
            .getMany()
            .then((slots) =>
                slots.map(slot =>
                    serviceSlotDtoFromEntity(slot, { hideDiscriminator: slot.state === API.ServiceSlotStates.Pending })
                )
            );
    }

    @Put(':id/state/:newState')
    async updateState(
        @Param('id') slotUuid: string,
        @Param('newState') newState: API.ServiceSlotStates,
    ): Promise<API.ServiceSlotDto> {
        const slot = await this.serviceSlotsService.findById(slotUuid);

        if (!slot) {
            throw new NotFoundException(`Service slot with ID ${slotUuid} not found`);
        }

        if (!STATE_TRANSITIONS_MAP[slot.state]?.includes(newState)) {
            throw new BadRequestException('Invalid state transition.');
        }

        try {
            return await this.serviceSlotsService.updateServiceSlotState(slotUuid, newState)
                .then((slot) => serviceSlotDtoFromEntity(slot));
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
