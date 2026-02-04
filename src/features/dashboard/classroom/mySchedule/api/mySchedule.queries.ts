import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { myScheduleApi } from "./mySchedule.api";
import { myScheduleKeys } from "./mySchedule.keys";
import type { PaginatedData } from "@/shared/api/types";
import type { MyAllSession, MyCurrentSession } from "../types";

// ============================================
// My All Sessions Query
// ============================================

/**
 * Get all sessions for current user
 * @param options - Additional query options
 */
export const useMyAllSessions = (
    options?: Partial<UseQueryOptions<PaginatedData<MyAllSession>, Error>>
) => {
    return useQuery({
        queryKey: myScheduleKeys.myAllSessions(),
        queryFn: ({ signal }) => myScheduleApi.getMyAllSessions(signal),
        ...options,
    });
};

// ============================================
// My Current Session Query
// ============================================

export const useMyCurrentSession = (
    options?: Partial<UseQueryOptions<MyCurrentSession | null, Error>>
) => {
    return useQuery({
        queryKey: myScheduleKeys.myCurrentSession(),
        queryFn: ({ signal }) => myScheduleApi.getMyCurrentSession(signal),
        ...options,
    });
};
