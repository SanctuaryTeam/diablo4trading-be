export class CreateReportDto {
    reportedUserId: number;
    note: string;
}

export class ResolveReportDto {
    reportId: number;
    actionTaken: number;
    note?: string;
}
