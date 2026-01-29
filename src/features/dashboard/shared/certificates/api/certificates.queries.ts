import { useQuery } from "@tanstack/react-query";
import { certificatesApi } from "./certificates.api";
import { certificatesKeys } from "./certificates.keys";
import type { Certificate, CertificatesListParams } from "../types";

const MOCK_CERTIFICATES: Certificate[] = [
    {
        id: "1",
        studentId: "S001",
        studentName: "Ahmed Mohamed",
        program: "Standard",
        levelName: "Python Basics",
        finalQuizStatus: "passed",
        certificateDate: "Jan 15, 2026",
    },
    {
        id: "2",
        studentId: "S002",
        studentName: "Ahmed Mohamed",
        program: "Standard",
        levelName: "Python Basics",
        finalQuizStatus: "passed",
        certificateDate: "Jan 15, 2026",
    },
    {
        id: "3",
        studentId: "S003",
        studentName: "Ahmed Mohamed",
        program: "Professional",
        levelName: "Python Basics",
        finalQuizStatus: "passed",
        certificateDate: "Jan 15, 2026",
    },
];

/**
 * Get mock certificates
 */
export const getMockCertificates = (): Promise<Certificate[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_CERTIFICATES), 300);
    });
};

export const useCertificatesList = (params: CertificatesListParams = {}) => {
    return useQuery({
        queryKey: certificatesKeys.list(params),
        // queryFn: () => certificatesApi.getList(params),
        queryFn: () => getMockCertificates(),
    });
};
