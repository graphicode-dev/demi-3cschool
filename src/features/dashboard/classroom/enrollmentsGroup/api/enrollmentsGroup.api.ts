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
     * GET /groups/my-program/:curriculumId/online
     */
    getOnlineGroups: async (
        curriculumId: number | string,
        signal?: AbortSignal
    ): Promise<MyProgramGroupsData> => {
        const response = await api.get<MyProgramGroupsResponse>(
            `${GROUPS_BASE_URL}/my-program/${curriculumId}/online`,
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
     * GET /groups/my-program/:curriculumId/offline
     */
    getOfflineGroups: async (
        curriculumId: number | string,
        signal?: AbortSignal
    ): Promise<MyProgramGroupsData> => {
        const response = await api.get<MyProgramGroupsResponse>(
            `${GROUPS_BASE_URL}/my-program/${curriculumId}/offline`,
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
     * POST /groups/:groupId/enroll
     */
    enroll: async (groupId: number | string): Promise<EnrollResponse> => {
        const response = await api.post<EnrollResponse>(
            `${GROUPS_BASE_URL}/${groupId}/enroll`
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
