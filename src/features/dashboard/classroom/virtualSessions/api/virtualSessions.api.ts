import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { OnlineSession, CreateZoomMeetingResponse } from "../types";

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

    /**
     * Create or get Zoom meeting for a group session
     * POST /group-sessions/:id/zoom
     * If meeting already exists, returns existing meeting data
     */
    createZoomMeeting: async (
        sessionId: number | string
    ): Promise<CreateZoomMeetingResponse> => {
        const response = await api.post<ApiResponse<CreateZoomMeetingResponse>>(
            `/group-sessions/${sessionId}/zoom`
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("Failed to create Zoom meeting");
        }

        return response.data.data;
    },
};
