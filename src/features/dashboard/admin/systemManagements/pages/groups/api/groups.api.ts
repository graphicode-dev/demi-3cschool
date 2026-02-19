import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { AssignBlocksPayload } from "../types";

// ============================================================================
// Groups API
// ============================================================================

const GROUPS_BASE_URL = "/system-managements/groups";

export const groupsApi = {
    /**
     * Assign blocks to a group
     */
    assignBlocks: async (
        groupId: number,
        payload: AssignBlocksPayload
    ): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(
            `${GROUPS_BASE_URL}/${groupId}/blocks`,
            payload
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Reassign instructor to a group
     */
    reassignInstructor: async (
        groupId: number,
        instructorId: number
    ): Promise<void> => {
        const response = await api.put<ApiResponse<void>>(
            `${GROUPS_BASE_URL}/${groupId}/instructor`,
            { instructorId }
        );

        if (response.error) {
            throw response.error;
        }
    },
};
