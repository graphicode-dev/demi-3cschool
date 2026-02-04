import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { physicalSessionsApi } from "./physicalSessions.api";
import { physicalSessionsKeys } from "./physicalSessions.keys";
import type { OfflineSession } from "../types";

// ============================================
// Offline Sessions Query
// ============================================

/**
 * Get offline sessions for a program
 * @param programId - Program/curriculum ID
 * @param options - Additional query options
 */
export const useOfflineSessions = (
    programId: number | string | undefined,
    options?: Partial<UseQueryOptions<OfflineSession[], Error>>
) => {
    return useQuery({
        queryKey: physicalSessionsKeys.offlineSessions(programId ?? ""),
        queryFn: ({ signal }) =>
            physicalSessionsApi.getOfflineSessions(programId!, signal),
        enabled: !!programId,
        ...options,
    });
};
