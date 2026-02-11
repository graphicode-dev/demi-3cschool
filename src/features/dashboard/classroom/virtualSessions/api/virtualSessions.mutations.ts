import { useMutation, useQueryClient } from "@tanstack/react-query";
import { virtualSessionsApi } from "./virtualSessions.api";
import { virtualSessionsKeys } from "./virtualSessions.keys";
import type { CreateZoomMeetingResponse } from "../types";

// ============================================
// Create Zoom Meeting Mutation
// ============================================

/**
 * Hook to create or get Zoom meeting for a session
 * POST /group-sessions/:id/zoom
 */
export const useCreateZoomMeeting = () => {
    const queryClient = useQueryClient();

    return useMutation<
        CreateZoomMeetingResponse,
        Error,
        { sessionId: number | string; programId?: number | string }
    >({
        mutationFn: ({ sessionId }) =>
            virtualSessionsApi.createZoomMeeting(sessionId),
        onSuccess: (_data, variables) => {
            // Invalidate online sessions to refresh the list with updated zoom meeting data
            if (variables.programId) {
                queryClient.invalidateQueries({
                    queryKey: virtualSessionsKeys.onlineSessions(
                        variables.programId
                    ),
                });
            }
        },
    });
};
