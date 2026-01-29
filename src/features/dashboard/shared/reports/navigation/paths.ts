import { getDashboardBasePath } from "@/features/dashboard/shared/navigation/paths";

/**
 * Reports paths - dynamic based on user role
 */
export const reports = {
    list: () => `${getDashboardBasePath()}/reports`,
    view: (id: string | number = ":id") =>
        `${getDashboardBasePath()}/reports/view/${id}`,
} as const;

export const reportsPaths = {
    reportsList: reports.list,
    reportsView: reports.view,
};
