/**
 * Enrollments Group Queries
 *
 * TanStack Query hooks for enrollment groups.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentsGroupApi } from "./enrollmentsGroup.api";

/**
 * Query keys for enrollment groups
 */
export const enrollmentsGroupKeys = {
    all: ["enrollmentsGroup"] as const,
    online: (curriculumId: number | string) =>
        [...enrollmentsGroupKeys.all, "online", curriculumId] as const,
    offline: (curriculumId: number | string) =>
        [...enrollmentsGroupKeys.all, "offline", curriculumId] as const,
};

/**
 * Hook to fetch online groups for a curriculum
 */
export const useOnlineGroupsQuery = (
    curriculumId: number | string | undefined,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: enrollmentsGroupKeys.online(curriculumId ?? 0),
        queryFn: ({ signal }) =>
            enrollmentsGroupApi.getOnlineGroups(curriculumId!, signal),
        enabled: !!curriculumId && (options?.enabled ?? true),
    });
};

/**
 * Hook to fetch offline groups for a curriculum
 */
export const useOfflineGroupsQuery = (
    curriculumId: number | string | undefined,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: enrollmentsGroupKeys.offline(curriculumId ?? 0),
        queryFn: ({ signal }) =>
            enrollmentsGroupApi.getOfflineGroups(curriculumId!, signal),
        enabled: !!curriculumId && (options?.enabled ?? true),
    });
};

/**
 * Hook to enroll in a group
 */
export const useEnrollMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (groupId: number | string) =>
            enrollmentsGroupApi.enroll(groupId),
        onSuccess: () => {
            // Invalidate all enrollment group queries to refetch data
            queryClient.invalidateQueries({
                queryKey: enrollmentsGroupKeys.all,
            });
        },
    });
};
