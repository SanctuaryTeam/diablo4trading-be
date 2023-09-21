import { fromEntity as reportTypeDtoFromEntity, ReportTypeDto } from '../report-type/report-type.dto';
import { ReportReason } from './report-reason.entity';

export interface ReportReasonDto {
    // TODO : ANDREW : Add this back if it is needed
    // We likely don't want people to include this in update or create
    //id: number;
    reportTypeId: number;
    reportType?: ReportTypeDto; // Extra joined information
    reasonDescription: string;
}

export const fromEntity = (entity: ReportReason): ReportReasonDto => {
    const { reportTypeId, reportType, reasonDescription } = entity;

    const reportTypeDto = reportType ? reportTypeDtoFromEntity(reportType) : undefined;
    return { reportTypeId, reportType: reportTypeDto, reasonDescription  };
};