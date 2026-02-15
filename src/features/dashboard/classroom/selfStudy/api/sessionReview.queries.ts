/**
 * Session Review Query Hooks
 *
 * React Query hooks for content and teacher reviews
 */

import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
    type UseMutationOptions,
} from "@tanstack/react-query";
import { sessionReviewApi } from "./sessionReview.api";
import { selfStudyKeys } from "./selfStudy.keys";
import type { SessionReview, SessionReviewPayload } from "../types";

// ============================================================================
// Content Review Queries
// ============================================================================

/**
 * Get content review for a session
 * @param sessionId - Session ID
 * @param options - Additional query options
 */
export const useContentReview = (
    sessionId: number | string | undefined,
    options?: Partial<UseQueryOptions<SessionReview | null, Error>>
) => {
    return useQuery({
        queryKey: selfStudyKeys.contentReview(sessionId ?? ""),
        queryFn: ({ signal }) =>
            sessionReviewApi.getContentReview(sessionId!, signal),
        enabled: !!sessionId,
        ...options,
    });
};

/**
 * Create/Update content review for a session
 */
export const useCreateContentReview = (
    options?: UseMutationOptions<
        SessionReview,
        Error,
        { sessionId: number | string; payload: SessionReviewPayload }
    >
) => {
    const queryClient = useQueryClient();

    const userOnSuccess = options?.onSuccess;

    return useMutation({
        mutationFn: ({ sessionId, payload }) =>
            sessionReviewApi.createContentReview(sessionId, payload),
        onSuccess: (data, variables) => {
            // Invalidate and refetch the content review query
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.contentReview(variables.sessionId),
            });

            userOnSuccess?.(
                data,
                variables,
                undefined as never,
                undefined as never
            );
        },
        ...options,
    });
};

// ============================================================================
// Teacher Review Queries
// ============================================================================

/**
 * Get teacher review for a session
 * @param sessionId - Session ID
 * @param options - Additional query options
 */
export const useTeacherReview = (
    sessionId: number | string | undefined,
    options?: Partial<UseQueryOptions<SessionReview | null, Error>>
) => {
    return useQuery({
        queryKey: selfStudyKeys.teacherReview(sessionId ?? ""),
        queryFn: ({ signal }) =>
            sessionReviewApi.getTeacherReview(sessionId!, signal),
        enabled: !!sessionId,
        ...options,
    });
};

/**
 * Create/Update teacher review for a session
 */
export const useCreateTeacherReview = (
    options?: UseMutationOptions<
        SessionReview,
        Error,
        { sessionId: number | string; payload: SessionReviewPayload }
    >
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sessionId, payload }) =>
            sessionReviewApi.createTeacherReview(sessionId, payload),
        onSuccess: (data, variables) => {
            // Invalidate and refetch the teacher review query
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.teacherReview(variables.sessionId),
            });
        },
        ...options,
    });
};

