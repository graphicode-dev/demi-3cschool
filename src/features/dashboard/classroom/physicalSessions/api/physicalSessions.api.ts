import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { OfflineSession } from "../types";

// ============================================
// Physical Sessions API
// ============================================
export const physicalSessionsApi = {
    /**
     * Get offline sessions for a program
     * GET /groups/my-sessions/:programId/offline
     */
    getOfflineSessions: async (
        programId: number | string,
        signal?: AbortSignal
    ): Promise<OfflineSession[]> => {
        const response = await api.get<ApiResponse<OfflineSession[]>>(
            `/groups/my-sessions/${programId}/offline`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },

};

