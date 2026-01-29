export type CertificateStatus = "passed" | "failed" | "pending";

export interface Certificate {
    id: string;
    studentId: string;
    studentName: string;
    program: string;
    levelName: string;
    finalQuizStatus: CertificateStatus;
    certificateDate: string;
}

export interface CertificatesListResponse {
    items: Certificate[];
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}

export interface CertificatesListParams {
    page?: number;
    perPage?: number;
    search?: string;
    status?: CertificateStatus;
}
