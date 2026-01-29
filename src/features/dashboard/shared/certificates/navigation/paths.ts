import { getDashboardBasePath } from "@/features/dashboard/shared/navigation/paths";

/**
 * Certificates paths - dynamic based on user role
 */
export const certificates = {
    list: () => `${getDashboardBasePath()}/certificates`,
} as const;

export const certificatesPaths = {
    certificatesList: certificates.list,
};
