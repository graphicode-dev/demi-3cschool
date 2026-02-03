/**
 * Enrollments Group Queries
 *
 * TanStack Query hooks for enrollment groups.
 */

import { useQuery } from "@tanstack/react-query";
import { enrollmentsGroupApi } from "./enrollmentsGroup.api";
import { enrollmentsGroupKeys } from "./enrollmentsGroup.keys";

/**
 * Hook to fetch online groups for a curriculum
 */
export const useOnlineGroupsQuery = (
    programId: number | string | undefined,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: enrollmentsGroupKeys.online(programId ?? 0),
        queryFn: ({ signal }) =>
            enrollmentsGroupApi.getOnlineGroups(programId!, signal),
        enabled: !!programId && (options?.enabled ?? true),
    });
};

/**
 * Hook to fetch offline groups for a curriculum
 */
export const useOfflineGroupsQuery = (
    programId: number | string | undefined,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: enrollmentsGroupKeys.offline(programId ?? 0),
        queryFn: ({ signal }) =>
            enrollmentsGroupApi.getOfflineGroups(programId!, signal),
        enabled: !!programId && (options?.enabled ?? true),
    });
};
