/**
 * Enrollments Group API
 *
 * API functions for fetching enrollment groups (online/offline) and enrolling.
 */

import { api } from "@/shared/api/client";
import type {
    MyProgramGroupsResponse,
    MyProgramGroupsData,
    EnrollResponse,
} from "../types";

const GROUPS_BASE_URL = "/groups";

/**
 * Enrollments Group API functions
 */
export const enrollmentsGroupApi = {
    /**
     * Get online groups for a program curriculum
     * GET /groups/my-program/:programId/online
     */
    getOnlineGroups: async (
        programId: number | string,
        signal?: AbortSignal
    ): Promise<MyProgramGroupsData> => {
        const response = await api.get<MyProgramGroupsResponse>(
            `${GROUPS_BASE_URL}/available-slots/${programId}/online`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get offline groups for a program curriculum
     * GET /groups/my-program/:programId/offline
     */
    getOfflineGroups: async (
        programId: number | string,
        signal?: AbortSignal
    ): Promise<MyProgramGroupsData> => {
        const response = await api.get<MyProgramGroupsResponse>(
            `${GROUPS_BASE_URL}/available-slots/${programId}/offline`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Enroll in a group
     * POST /groups/enroll-slot/:slotId/:programId
     */
    enroll: async (slotId: number | string,programId: number | string): Promise<EnrollResponse> => {
        const response = await api.post<EnrollResponse>(
            `${GROUPS_BASE_URL}/enroll-slot/${slotId}/${programId}`
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data) {
            throw new Error("No data returned from server");
        }

        return response.data;
    },
};

export default enrollmentsGroupApi;
