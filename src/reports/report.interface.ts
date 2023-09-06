// Not sure how to do the reference types ('ReportReason', etc..) or if we just leave the Ids

export interface IReport {
    id: number;
    reportTypeId: number;
    reportReasonId: number;
    reportDescription: string;
    reportedByUserId: number;
    userAcceptedTermsOfUse: boolean;
    reportedUserId: number | null;
    reportedDiabloItemId: number | null;
    reportedServiceId: number | null;
    reportStatusId: number;
    reportSeverityId: number;
    updatedBy: string;
}