import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { selfStudyApi } from "./selfStudy.api";
import { selfStudyKeys } from "./selfStudy.keys";
import type { MySession, OnlineSession } from "../types";

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
        queryKey: selfStudyKeys.onlineSessions(programId ?? ""),
        queryFn: ({ signal }) =>
            selfStudyApi.getOnlineSessions(programId!, signal),
        enabled: !!programId,
        ...options,
    });
};

/**
 * Get online sessions for a program
 * @param programId - Program/curriculum ID
 * @param options - Additional query options
 */
export const useMySessions = (
    programId: number | string | undefined,
    options?: Partial<UseQueryOptions<MySession, Error>>
) => {
    return useQuery({
        queryKey: selfStudyKeys.onlineSessions(programId ?? ""),
        queryFn: ({ signal }) => selfStudyApi.getSessions(programId!, signal),
        enabled: !!programId,
        ...options,
    });
};
