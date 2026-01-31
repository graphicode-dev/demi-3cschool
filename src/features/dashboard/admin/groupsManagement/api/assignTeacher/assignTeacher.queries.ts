/**
 * Assign Teacher Management Feature - Query Hooks
 *
 * TanStack Query hooks for reading teacher assignment data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get available teachers for group
 * const { data: teachers, isLoading } = useAvailableTeachersQuery({ groupId: 1 });
 *
 * // Get available teachers for session
 * const { data: teachers, isLoading } = useAvailableTeachersForSessionQuery({ sessionId: 1 });
 * ```
 */

import { useQuery } from "@tanstack/react-query";
import { assignTeacherKeys } from "./assignTeacher.keys";
import { assignTeacherApi } from "./assignTeacher.api";
import type { AvailableTeachersParams } from "../../types/assignTeacher.types";

// ============================================================================
// Available Teachers Queries
// ============================================================================

/**
 * Hook for fetching available teachers with filtering
 */
export const useAvailableTeachersQuery = (params: AvailableTeachersParams) => {
    return useQuery({
        queryKey: assignTeacherKeys.availableTeachersParams(params),
        queryFn: ({ signal }) =>
            assignTeacherApi.getAvailableTeachers(params, signal),
        staleTime: 10 * 60 * 1000, // 10 minutes - teacher availability changes moderately
        enabled: true, // Always enabled for available teachers queries
        retry: (failureCount, error) => {
            // Retry on network errors but not on 4xx errors
            if (error instanceof Error && error.message.includes("4")) {
                return false;
            }
            return failureCount < 2; // Fewer retries for teacher data
        },
    });
};

/**
 * Hook for fetching available teachers for a specific group
 */
export const useAvailableTeachersForGroupQuery = (
    groupId: number,
    additionalParams?: Omit<AvailableTeachersParams, "groupId">
) => {
    const params: AvailableTeachersParams = {
        groupId,
        ...additionalParams,
    };

    return useQuery({
        queryKey: assignTeacherKeys.availableTeachersParams(params),
        queryFn: () =>
            assignTeacherApi.getAvailableTeachersForGroup(
                groupId,
                additionalParams
            ),
        enabled: !!groupId,
        staleTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message.includes("4")) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

/**
 * Hook for fetching available teachers for a specific session
 */
export const useAvailableTeachersForSessionQuery = (
    sessionId: number,
    additionalParams?: Omit<AvailableTeachersParams, "sessionId">
) => {
    const params: AvailableTeachersParams = {
        sessionId,
        ...additionalParams,
    };

    return useQuery({
        queryKey: assignTeacherKeys.availableTeachersParams(params),
        queryFn: () =>
            assignTeacherApi.getAvailableTeachersForSession(
                sessionId,
                additionalParams
            ),
        enabled: !!sessionId,
        staleTime: 10 * 60 * 1000,
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message.includes("4")) {
                return false;
            }
            return failureCount < 2;
        },
    });
};

// ============================================================================
// Combined Queries
// ============================================================================

/**
 * Hook for fetching available teachers with search functionality
 * Useful for teacher selection dropdowns with search
 */
export const useAvailableTeachersWithSearchQuery = (
    params: AvailableTeachersParams,
    searchQuery?: string
) => {
    const searchParams: AvailableTeachersParams = {
        ...params,
        search: searchQuery,
    };

    return useQuery({
        queryKey: assignTeacherKeys.availableTeachersParams(searchParams),
        queryFn: ({ signal }) =>
            assignTeacherApi.getAvailableTeachers(searchParams, signal),
        enabled: true,
        staleTime: 5 * 60 * 1000, // Shorter cache for search results
        retry: (failureCount, error) => {
            if (error instanceof Error && error.message.includes("4")) {
                return false;
            }
            return failureCount < 1; // Only one retry for search
        },
    });
};

/**
 * Hook for fetching teacher availability for multiple contexts
 * Useful when you need teachers for both group and session assignment
 */
export const useTeacherAvailabilityQuery = (
    groupId?: number,
    sessionId?: number,
    additionalParams?: Omit<AvailableTeachersParams, "groupId" | "sessionId">
) => {
    const groupParams: AvailableTeachersParams = {
        groupId,
        ...additionalParams,
    };

    const sessionParams: AvailableTeachersParams = {
        sessionId,
        ...additionalParams,
    };

    const groupQuery = useQuery({
        queryKey: assignTeacherKeys.availableTeachersParams(groupParams),
        queryFn: () =>
            groupId
                ? assignTeacherApi.getAvailableTeachersForGroup(
                      groupId,
                      additionalParams
                  )
                : Promise.resolve([]),
        enabled: !!groupId,
        staleTime: 10 * 60 * 1000,
    });

    const sessionQuery = useQuery({
        queryKey: assignTeacherKeys.availableTeachersParams(sessionParams),
        queryFn: () =>
            sessionId
                ? assignTeacherApi.getAvailableTeachersForSession(
                      sessionId,
                      additionalParams
                  )
                : Promise.resolve([]),
        enabled: !!sessionId,
        staleTime: 10 * 60 * 1000,
    });

    return {
        groupTeachers: groupQuery.data || [],
        sessionTeachers: sessionQuery.data || [],
        isLoading: groupQuery.isLoading || sessionQuery.isLoading,
        isError: groupQuery.isError || sessionQuery.isError,
        error: groupQuery.error || sessionQuery.error,
        refetch: () => {
            groupQuery.refetch();
            sessionQuery.refetch();
        },
    };
};
