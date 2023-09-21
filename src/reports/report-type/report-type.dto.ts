import { ReportType } from './report-type.entity';

export interface ReportTypeDto {
    // TODO : ANDREW : Add this back if it is needed
    // We likely don't want people to include this in update or create
    //id: number;
    typeDescription: string;
}

export const fromEntity = (entity: ReportType): ReportTypeDto => {
    const { typeDescription } = entity;
    return { typeDescription };
};