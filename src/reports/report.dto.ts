import { fromEntity as diabloItemDtoFromEntity, DiabloItemDto } from 'src/diablo-items/diablo-item.dto';
import { fromEntity as reportReasonDtoFromEntity, ReportReasonDto } from './report-reason/report-reason.dto';
import { fromEntity as reportTypeDtoFromEntity, ReportTypeDto } from '../reports/report-type/report-type.dto';
import { fromEntity as serviceDtoFromEntity, ServiceDto } from 'src/services/service.dto';
import { fromEntity as userDtoFromEntity, UserDto } from '../users/user.dto';
import { REPORT_STATES, Report } from './report.entity';

export interface ReportDto {
    // TODO : ANDREW : Add this back if it is needed
    // We likely don't want people to include this in update or create
    //id: number; 
    reportTypeId: number;
    reportType?: ReportTypeDto; // Likely included on response, but not needed on create/update
    reportReasonId: number;
    reportReason?: ReportReasonDto;
    reportDescription: string;
    reportedByUserId: number;
    reportedByUser?: UserDto;
    userAcceptedTermsOfUse: boolean;
    reportedUserId: number | null;
    reportedUser: UserDto | null; // Can this be a null too?
    reportedDiabloItemId: number | null;
    reportedDiabloItem: DiabloItemDto | null;
    reportedServiceId: number | null;
    reportedService: ServiceDto | null; // Can this be a null too?
    state: REPORT_STATES; // This might need to be moved to 'shared' to use
    assignedUserId: number | null;
    assignedUser: UserDto | null;
    updatedByUserId: number;
    updatedByUser?: UserDto;
    deleted: boolean;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: Report, options: FromEntityOptions = {}): ReportDto => {
    const {
        //id,
        reportTypeId,
        reportType,
        reportReasonId,
        reportReason,
        reportDescription,
        reportedByUserId,
        reportedByUser,
        userAcceptedTermsOfUse,
        reportedUserId,
        reportedUser,
        reportedDiabloItemId,
        reportedDiabloItem,
        reportedServiceId,
        reportedService,
        state,
        assignedUserId,
        assignedUser,
        updatedByUserId,
        updatedByUser,
        deleted,
    } = entity;

    const { hideDiscriminator } = options;

    const diabloItemDto = reportedDiabloItem ? diabloItemDtoFromEntity(reportedDiabloItem) : undefined;
    const reportedServiceDto = reportedService ? serviceDtoFromEntity(reportedService) : undefined;

    const reportTypeDto = reportType ? reportTypeDtoFromEntity(reportType) : undefined;
    const reportReasonDto = reportReason ? reportReasonDtoFromEntity(reportReason) : undefined;

    const reportedByUserDto = reportedByUser ? userDtoFromEntity(reportedByUser, { hideDiscriminator }) : undefined;
    const reportedUserDto = reportedUser ? userDtoFromEntity(reportedUser, { hideDiscriminator }) : undefined;
    const assignedUserDto = assignedUser ? userDtoFromEntity(assignedUser, { hideDiscriminator }) : undefined;
    const updatedByUserDto = updatedByUser ? userDtoFromEntity(updatedByUser, { hideDiscriminator }) : undefined;

    return {
        //id,
        reportTypeId,
        reportType: reportTypeDto,
        reportReasonId,
        reportReason: reportReasonDto,
        reportDescription,
        reportedByUserId,
        reportedByUser: reportedByUserDto,
        userAcceptedTermsOfUse,
        reportedUserId,
        reportedUser: reportedUserDto,
        reportedDiabloItemId,
        reportedDiabloItem: diabloItemDto,
        reportedServiceId,
        reportedService: reportedServiceDto,
        state,
        assignedUserId,
        assignedUser: assignedUserDto,
        updatedByUserId,
        updatedByUser: updatedByUserDto,
        deleted,
    };
};
