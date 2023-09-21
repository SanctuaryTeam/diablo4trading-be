import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { API } from '@sanctuaryteam/shared';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RequestModel } from 'src/auth/request.model';
import { SkipGuards } from 'src/auth/skip-guards.decorator';
import { ServiceResponseException } from 'src/common/exceptions';
import { OptionalParseIntPipe } from '../pipes/optional-parse-int-pipe';
import { UsersService } from '../users/users.service';
import { fromEntity as serviceSlotDtoFromEntity } from './service-slots/service-slots.dto';
import { ServiceSlotsService } from './service-slots/service-slots.service';
import { fromEntity as serviceDtoFromEntity } from './service.dto';
import { Service } from './services.entity';
import { SERVICE_ERROR_CODES, ServicesService } from './services.service';

const MAX_SERVICE_COUNT = 3;

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
        private readonly serviceSlotsService: ServiceSlotsService,
        private readonly usersService: UsersService,
    ) {}

    @SkipGuards()
    @Get('')
    async search(
        @Query('serverType') serverType?: string,
        @Query('title') title?: string,
        @Query('tags', OptionalParseIntPipe) tags?: number,
        @Query('userId') userUuid?: string,
        @Query('deleted') deleted?: boolean,
        @Query('offset', OptionalParseIntPipe) offset?: number,
        @Query('limit', OptionalParseIntPipe) limit?: number,
    ): Promise<API.ServiceDto[]> {
        return await this.servicesService
            .createQuery()
            .withUser()
            .searchByRealmType(serverType)
            .searchByTitle(title)
            .searchByTags(tags)
            .searchByUserUuid(userUuid)
            .searchByDeleted(deleted === true)
            // Need to include the serviceSlotsOpen and serviceSlotsAvailable
            // .includeSlots()
            .paginate(offset, limit)
            .orderBy('bumpedAt', 'DESC')
            .getMany()
            .then((services) => services.map(service => serviceDtoFromEntity(service, { hideDiscriminator: true })));
    }

    @Post('')
    async create(@Body() dto: Partial<Service>, @Request() req: RequestModel): Promise<API.ServiceDto> {
        const user = req.user;

        const notDeletedServicesCount = await this.servicesService.countNotDeletedServices(user);

        if (notDeletedServicesCount >= MAX_SERVICE_COUNT) {
            throw new BadRequestException(`Cannot create more than ${MAX_SERVICE_COUNT} non-deleted records`);
        }

        dto.user = req.user;

        return await this.servicesService.createService(dto).then(service =>
            serviceDtoFromEntity(service, { hideDiscriminator: true })
        );
    }

    @Put(':id')
    async update(
        @Param('id') serviceUuid: string,
        @Body() updateDto: Partial<Service>,
    ): Promise<API.ServiceDto> {
        const existingService = await this.servicesService
            .createQuery()
            .includeSlots()
            .searchByServiceUuid(serviceUuid)
            .getOne();

        if (!existingService) {
            throw new NotFoundException(`Service with ID ${serviceUuid} not found`);
        }

        try {
            return await this.servicesService.updateService(serviceUuid, updateDto).then(service =>
                serviceDtoFromEntity(service, { hideDiscriminator: true })
            );
        } catch (error) {
            if (error instanceof ServiceResponseException) {
                throw new HttpException(
                    error?.message || 'Unknown error',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @Delete(':id/delete')
    async delete(@Param('id') id: number): Promise<void> {
        await this.servicesService.deleteService(id);
    }

    @Delete(':id/soft-delete')
    async softDelete(@Param('id') id: number): Promise<void> {
        await this.servicesService.softDeleteService(id);
    }

    @Put(':id/undo-soft-delete')
    async undoSoftDelete(@Param('id') id: number): Promise<void> {
        await this.servicesService.undoSoftDeleteService(id);
    }

    @Post(':id/bump')
    async bumpService(@Param('id') id: number): Promise<void> {
        try {
            await this.servicesService.bumpService(id);
        } catch (error) {
            if (error instanceof ServiceResponseException) {
                if (error.code === SERVICE_ERROR_CODES.BUMP_TOO_SOON) {
                    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
                } else if (error.code === SERVICE_ERROR_CODES.SERVICE_NOT_FOUND) {
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
                } else {
                    throw new HttpException(
                        'Unknown error',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            }
        }
    }

    @Post(':id/claim-slot')
    async claimSlot(
        @Param('id') serviceUuid: string,
        @Request() req: RequestModel,
    ): Promise<API.ServiceSlotDto> {
        const userId = req.user.id;

        const existingService = await this.servicesService
            .createQuery()
            .searchByServiceUuid(serviceUuid)
            .searchByDeleted(false)
            .getOne();

        if (!existingService) {
            throw new NotFoundException(`Service with ID ${serviceUuid} not found`);
        }

        // Creating a new ServiceSlot
        const newSlotData = {
            serviceId: existingService.id,
            clientUserId: userId,
            serviceOwnerUserId: existingService.userId,
        };

        return await this.serviceSlotsService.createServiceSlot(newSlotData).then(serviceSlot =>
            serviceSlotDtoFromEntity(serviceSlot, { hideDiscriminator: true })
        );
    }
}
