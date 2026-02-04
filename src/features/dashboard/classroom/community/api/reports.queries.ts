/**
 * Reports Feature - Query Hooks
 *
 * TanStack Query hooks for reading report data.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { reportKeys } from "./community.keys";
import { reportsApi } from "./reports.api";
import type { Report, ReportsListParams } from "./community.types";
import type { PaginatedData } from "@/shared/api";

/**
 * Hook to fetch list of reports (Admin)
 */
export function useReportsList(
    params?: ReportsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<Report>, Error>>
) {
    return useQuery({
        queryKey: reportKeys.list(params),
        queryFn: ({ signal }) => reportsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch reports for a specific post (Admin)
 */
export function usePostReports(
    postId: number | undefined | null,
    options?: Partial<UseQueryOptions<Report[], Error>>
) {
    return useQuery({
        queryKey: reportKeys.byPost(postId ?? 0),
        queryFn: ({ signal }) => reportsApi.getByPost(postId!, signal),
        enabled: !!postId,
        ...options,
    });
}
