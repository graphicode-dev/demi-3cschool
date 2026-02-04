import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { OnlineSession } from "../types";

// ============================================
// Virtual Sessions API
// ============================================
export const virtualSessionsApi = {
    /**
     * Get online sessions for a program
     * GET /groups/my-sessions/:programId/online
     */
    getOnlineSessions: async (
        programId: number | string,
        signal?: AbortSignal
    ): Promise<OnlineSession[]> => {
        const response = await api.get<ApiResponse<OnlineSession[]>>(
            `/groups/my-sessions/${programId}/online`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },

};

