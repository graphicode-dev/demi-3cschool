import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { MySession } from "../types";

// ============================================
// Self Study Sessions API
// ============================================
export const selfStudyApi = {
    /**
     * Get online sessions for a program
     * GET /groups/my-sessions/:programId/online
     */
    getSessions: async (
        programId: number | string,
        signal?: AbortSignal
    ): Promise<MySession[]> => {
        const response = await api.get<ApiResponse<MySession[]>>(
            `/groups/my-sessions/${programId}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },
};
