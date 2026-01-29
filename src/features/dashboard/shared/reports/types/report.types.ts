export type ReportStatus = "draft" | "ready" | "sent";
export type ReportType = "mid_report" | "final_report";

export interface Report {
    id: string;
    studentId: string;
    studentName: string;
    level: {
        id: string;
        title: string;
    };
    track: {
        id: string;
        title: string;
    };
    reportType: ReportType;
    status: ReportStatus;
    instructor: {
        id: string;
        name: string;
    };
    updatedAt: string;
}

export interface ReportsListResponse {
    items: Report[];
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

export interface ReportsListParams {
    page?: number;
    search?: string;
    status?: ReportStatus;
}

export interface ReportStats {
    total: number;
    draft: number;
    ready: number;
    sent: number;
}
