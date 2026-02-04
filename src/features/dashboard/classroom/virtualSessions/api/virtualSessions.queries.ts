import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { virtualSessionsApi } from "./virtualSessions.api";
import { virtualSessionsKeys } from "./virtualSessions.keys";
import type { OnlineSession } from "../types";

// ============================================
// Online Sessions Query
// ============================================

/**
 * Get online sessions for a program
 * @param programId - Program/curriculum ID
 * @param options - Additional query options
 */
export const useOnlineSessions = (
    programId: number | string | undefined,
    options?: Partial<UseQueryOptions<OnlineSession[], Error>>
) => {
    return useQuery({
        queryKey: virtualSessionsKeys.onlineSessions(programId ?? ""),
        queryFn: ({ signal }) =>
            virtualSessionsApi.getOnlineSessions(programId!, signal),
        enabled: !!programId,
        ...options,
    });
};
