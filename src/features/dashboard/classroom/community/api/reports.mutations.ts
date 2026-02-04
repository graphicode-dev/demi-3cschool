/**
 * Reports Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing report data.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys, postKeys } from "./community.keys";
import { reportsApi } from "./reports.api";
import type {
    Report,
    ReportCreatePayload,
    ReportReviewPayload,
} from "./community.types";
import type { ApiError } from "@/shared/api";

/**
 * Hook to report a post
 */
export function useReportPost() {
    const queryClient = useQueryClient();

    return useMutation<
        Report,
        ApiError,
        { postId: number; data: ReportCreatePayload }
    >({
        mutationFn: ({ postId, data }) => reportsApi.create(postId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: reportKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
        },
    });
}

/**
 * Hook to review a report (Admin)
 */
export function useReviewReport() {
    const queryClient = useQueryClient();

    return useMutation<
        Report,
        ApiError,
        { id: number; data: ReportReviewPayload }
    >({
        mutationFn: ({ id, data }) => reportsApi.review(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reportKeys.all });
        },
    });
}
