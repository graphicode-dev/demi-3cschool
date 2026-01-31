/**
 * Group Sessions Management Feature - Query Hooks
 *
 * TanStack Query hooks for reading session data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get sessions list
 * const { data: sessions, isLoading } = useSessionsListQuery({ page: 1 });
 *
 * // Get session detail
 * const { data: session, isLoading } = useSessionDetailQuery(sessionId);
 *
 * // Get metadata
 * const { data: metadata } = useSessionsMetadataQuery();
 * ```
 */

import { useQuery } from "@tanstack/react-query";
import { sessionKeys } from "./sessions.keys";
import { sessionsApi } from "./sessions.api";
import type { SessionsListParams } from "../../types/sessions.types";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook for fetching sessions metadata
 */
export const useSessionsMetadataQuery = () => {
    return useQuery({
        queryKey: sessionKeys.metadata(),
        queryFn: ({ signal }) => sessionsApi.getMetadata(signal),
        staleTime: 30 * 60 * 1000, // 30 minutes - metadata changes rarely
    });
};

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook for fetching sessions list with filtering and pagination
 */
export const useSessionsListQuery = (params: SessionsListParams) => {
    return useQuery({
        queryKey: sessionKeys.list(params),
        queryFn: ({ signal }) => sessionsApi.getList(params, signal),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: true, // Always enabled for list queries
        retry: (failureCount, error) => {
            // Retry on network errors but not on 4xx errors
            if (error instanceof Error && error.message.includes("4")) {
                return false;
            }
            return failureCount < 3;
        },
    });
};

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook for fetching a single session by ID
 */
export const useSessionDetailQuery = (id: number | null) => {
    return useQuery({
        queryKey: sessionKeys.detail(id!),
        queryFn: ({ signal }) => sessionsApi.getById(id!, signal),
        enabled: !!id, // Only run when ID is provided
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

// ============================================================================
// Specialized Queries
// ============================================================================

/**
 * Hook for fetching sessions by group ID
 */
export const useSessionsByGroupQuery = (
    groupId: number,
    additionalParams?: Omit<SessionsListParams, "course_id" | "level_id">
) => {
    const params: SessionsListParams = {
        ...additionalParams,
        // Filter by group if we had the field, but since it's not in the API,
        // this would need to be handled differently
    };

    return useQuery({
        queryKey: sessionKeys.byGroup(groupId),
        queryFn: ({ signal }) => sessionsApi.getList(params, signal),
        enabled: !!groupId,
        staleTime: 5 * 60 * 1000,
    });
};

/**
 * Hook for fetching sessions by lesson ID
 */
export const useSessionsByLessonQuery = (
    lessonId: number,
    additionalParams?: Omit<SessionsListParams, "course_id" | "level_id">
) => {
    const params: SessionsListParams = {
        ...additionalParams,
        // Filter by lesson if we had the field, but since it's not in the API,
        // this would need to be handled differently
    };

    return useQuery({
        queryKey: sessionKeys.byLesson(lessonId),
        queryFn: ({ signal }) => sessionsApi.getList(params, signal),
        enabled: !!lessonId,
        staleTime: 5 * 60 * 1000,
    });
};

// ============================================================================
// Combined Queries
// ============================================================================

/**
 * Hook for fetching both sessions list and metadata
 * Useful for pages that need both for filtering and display
 */
export const useSessionsWithDataQuery = (params: SessionsListParams) => {
    const sessionsQuery = useSessionsListQuery(params);
    const metadataQuery = useSessionsMetadataQuery();

    return {
        sessions: sessionsQuery.data,
        isLoading: sessionsQuery.isLoading || metadataQuery.isLoading,
        isError: sessionsQuery.isError || metadataQuery.isError,
        error: sessionsQuery.error || metadataQuery.error,
        metadata: metadataQuery.data,
        refetch: () => {
            sessionsQuery.refetch();
            metadataQuery.refetch();
        },
    };
};
