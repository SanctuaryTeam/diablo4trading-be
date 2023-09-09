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
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RequestModel } from 'src/auth/request.model';
import { OptionalParseIntPipe } from '../pipes/optional-parse-int-pipe';
import { UsersService } from '../users/users.service';
import { ServiceSlot } from './service-slots/service-slots.entity';
import { ServiceSlotsService } from './service-slots/service-slots.service';
import { ServiceDto } from './service.dto';
import { Service } from './services.entity';
import { SERVICE_ERROR_CODES, ServicesService } from './services.service';
import { NoOpGuard } from 'src/auth/no-op.guard';

const MAX_SERVICE_COUNT = 3;

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
    constructor(
        private readonly servicesService: ServicesService,
        private readonly serviceSlotsService: ServiceSlotsService,
        private readonly usersService: UsersService,
    ) {}

    @UseGuards(NoOpGuard)
    @Get('')
    async search(
        @Query('serverType') serverType?: string,
        @Query('title') title?: string,
        @Query('tags', OptionalParseIntPipe) tags?: number,
        @Query('userId', OptionalParseIntPipe) userId?: number,
        @Query('deleted') deleted?: boolean,
        @Query('offset', OptionalParseIntPipe) offset?: number,
        @Query('limit', OptionalParseIntPipe) limit?: number,
    ): Promise<ServiceDto[]> {
        return await this.servicesService
            .createQuery()
            .withUser()
            .searchByRealmType(serverType)
            .searchByTitle(title)
            .searchByTags(tags)
            .searchByUserId(userId)
            .searchByDeleted(deleted === true)
            .includeSlots()
            .paginate(offset, limit)
            .orderBy('bumpedAt', 'DESC')
            .getMany()
            .then((services) => services.map(service => ServiceDto.fromEntity(service)));
    }

    @Post('')
    async create(@Body() dto: Partial<Service>, @Request() req: RequestModel): Promise<Service> {
        const user = req.user;

        const notDeletedServicesCount = await this.servicesService.countNotDeletedServices(user);

        if (notDeletedServicesCount >= MAX_SERVICE_COUNT) {
            throw new BadRequestException(`Cannot create more than ${MAX_SERVICE_COUNT} non-deleted records`);
        }

        dto.user = req.user;

        return await this.servicesService.createService(dto);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateDto: Partial<Service>,
    ): Promise<Service> {
        const existingService = await this.servicesService
            .createQuery()
            .includeSlots()
            .searchById(id)
            .getOne();

        if (!existingService) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        try {
            return await this.servicesService.updateService(id, updateDto);
        } catch (error) {
            throw new HttpException(
                error?.message || 'Unknown error',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
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
            if (error?.code === SERVICE_ERROR_CODES.BUMP_TOO_SOON) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            } else if (error?.code === SERVICE_ERROR_CODES.SERVICE_NOT_FOUND) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            } else {
                throw new HttpException(
                    'Unknown error',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @Post(':id/claim-slot')
    async claimSlot(
        @Param('id') id: number,
        @Request() req: RequestModel
    ): Promise<ServiceSlot> {

        const userId = req.user.id;

        const existingService = await this.servicesService
            .createQuery()
            .searchById(id)
            .getOne();

        if (!existingService) {
            throw new NotFoundException(`Service with ID ${id} not found`);
        }

        // Creating a new ServiceSlot
        const newSlotData = {
            serviceId: existingService.id,
            clientUserId: userId,
            serviceOwnerUserId: existingService.userId,
        };

        return await this.serviceSlotsService.createServiceSlot(newSlotData);
    }
}
