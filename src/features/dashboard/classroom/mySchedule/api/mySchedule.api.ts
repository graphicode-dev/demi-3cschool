import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { PaginatedData } from "@/shared/api/types";
import type { MyAllSession, MyCurrentSession } from "../types";

// ============================================
// My Schedule API
// ============================================
export const myScheduleApi = {
    /**
     * Get all sessions for current user
     * GET /groups/my-all-sessions
     */
    getMyAllSessions: async (
        signal?: AbortSignal
    ): Promise<PaginatedData<MyAllSession>> => {
        const response = await api.get<ApiResponse<PaginatedData<MyAllSession>>>(
            "/groups/my-all-sessions",
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return (
            response.data?.data ?? {
                perPage: 15,
                currentPage: 1,
                lastPage: 1,
                nextPageUrl: null,
                items: [],
            }
        );
    },

    /**
     * Get current or upcoming session for current user
     * GET /groups/my-current-session
     */
    getMyCurrentSession: async (
        signal?: AbortSignal
    ): Promise<MyCurrentSession | null> => {
        const response = await api.get<ApiResponse<MyCurrentSession | null>>(
            "/groups/my-current-session",
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? null;
    },
};
