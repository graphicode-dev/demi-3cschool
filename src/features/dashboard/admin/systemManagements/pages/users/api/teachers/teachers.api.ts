import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams } from "@/shared/api";
import type {
    Teacher,
    TeacherMetadata,
    CreateTeacherPayload,
    UpdateTeacherPayload,
} from "./types";

// ============================================================================
// Teachers API
// ============================================================================

const TEACHERS_BASE_URL = "/system-managements/teachers";

export const teachersApi = {
    /**
     * Get list of all teachers
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<Teacher[]> => {
        const response = await api.get<ApiResponse<Teacher[]>>(
            TEACHERS_BASE_URL,
            { signal, params }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get a single teacher by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Teacher> => {
        const response = await api.get<ApiResponse<Teacher>>(
            `${TEACHERS_BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get teachers metadata (filters, operators, field types)
     */
    getMetadata: async (signal?: AbortSignal): Promise<TeacherMetadata> => {
        const response = await api.get<ApiResponse<TeacherMetadata>>(
            `${TEACHERS_BASE_URL}/metadata`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Create a new teacher
     */
    create: async (payload: CreateTeacherPayload): Promise<Teacher> => {
        const response = await api.post<ApiResponse<Teacher>>(
            TEACHERS_BASE_URL,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Update an existing teacher (PUT)
     */
    update: async (
        id: number,
        payload: UpdateTeacherPayload
    ): Promise<Teacher> => {
        const response = await api.put<ApiResponse<Teacher>>(
            `${TEACHERS_BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Delete a teacher
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${TEACHERS_BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
