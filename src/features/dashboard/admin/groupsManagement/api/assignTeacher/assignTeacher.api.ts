/**
 * Assign Teacher Management Feature - API Functions
 *
 * Raw API functions for teacher assignment domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a mutation hook
 * const { mutate } = useSetPrimaryTeacherMutation();
 * mutate({ groupId: 1, payload: { primaryTeacherId: 2 } });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    SetPrimaryTeacherPayload,
    SetSessionTeacherPayload,
    GroupWithPrimaryTeacher,
    SessionWithTeacher,
} from "../../types/assignTeacher.types";
import type { ListResponse } from "../../types/groups.types";
import { ApiResponse } from "@/shared/api";
import type { Teacher } from "@/features/dashboard/admin/settings/teachers/types";

interface AvailableTeachersParams {
    groupId?: number;
    sessionId?: number;
    courseId?: number;
    levelId?: number;
    search?: string;
    page?: number;
    limit?: number;
}

const GROUPS_BASE_URL = "/groups";
const SESSIONS_BASE_URL = "/group-sessions";

/**
 * Teacher Assignment API functions
 */
export const assignTeacherApi = {
    // ============================================================================
    // Primary Teacher Assignment
    // ============================================================================

    /**
     * Set primary teacher for a group
     */
    setPrimaryTeacher: async (
        groupId: number,
        payload: SetPrimaryTeacherPayload
    ): Promise<GroupWithPrimaryTeacher> => {
        const response = await api.patch<ApiResponse<GroupWithPrimaryTeacher>>(
            `${GROUPS_BASE_URL}/${groupId}/primary-teacher`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    // ============================================================================
    // Session Teacher Assignment
    // ============================================================================

    /**
     * Set teacher for a specific session
     */
    setSessionTeacher: async (
        groupSessionId: number,
        payload: SetSessionTeacherPayload
    ): Promise<SessionWithTeacher> => {
        const response = await api.patch<ApiResponse<SessionWithTeacher>>(
            `${SESSIONS_BASE_URL}/${groupSessionId}/teacher`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    // ============================================================================
    // Available Teachers Queries
    // ============================================================================

    /**
     * Get available teachers for assignment
     */
    getAvailableTeachers: async (
        params: AvailableTeachersParams,
        signal?: AbortSignal
    ): Promise<Teacher[]> => {
        const response = await api.get<ListResponse<Teacher>>(
            `${GROUPS_BASE_URL}/available-teachers`,
            {
                params: params as Record<string, unknown>,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Get available teachers for a specific group
     */
    getAvailableTeachersForGroup: async (
        groupId: number,
        additionalParams?: Omit<AvailableTeachersParams, "groupId">
    ): Promise<Teacher[]> => {
        const params: AvailableTeachersParams = {
            groupId,
            ...additionalParams,
        };

        const response = await api.get<ListResponse<Teacher>>(
            `${GROUPS_BASE_URL}/${groupId}/available-teachers`,
            {
                params: params as Record<string, unknown>,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Get available teachers for a specific session
     */
    getAvailableTeachersForSession: async (
        sessionId: number,
        additionalParams?: Omit<AvailableTeachersParams, "sessionId">
    ): Promise<Teacher[]> => {
        const params: AvailableTeachersParams = {
            sessionId,
            ...additionalParams,
        };

        const response = await api.get<ListResponse<Teacher>>(
            `${SESSIONS_BASE_URL}/${sessionId}/available-teachers`,
            {
                params: params as Record<string, unknown>,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },
};

export default assignTeacherApi;
