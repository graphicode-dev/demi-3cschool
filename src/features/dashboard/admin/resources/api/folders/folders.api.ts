/**
 * Resource Folders Feature - API Functions
 *
 * Raw API functions for resource folders domain.
 * These are pure functions that make HTTP requests.
 */

import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    ResourceFolder,
    FoldersListParams,
    FolderCreatePayload,
    FolderUpdatePayload,
} from "../../types";

const BASE_URL = "/learning-resource-folders";

/**
 * Resource Folders API functions
 */
export const foldersApi = {
    /**
     * Get list of all folders (server-side filtering + pagination)
     */
    getList: async (
        params?: FoldersListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<ResourceFolder>> => {
        const queryParams: Record<string, unknown> = {};

        if (params?.page) queryParams.page = params.page;
        if (params?.gradeId) queryParams.grade_id = params.gradeId;
        if (params?.programId) queryParams.program_id = params.programId;

        const response = await api.get<ApiResponse<PaginatedData<ResourceFolder>>>(
            BASE_URL,
            {
                params: queryParams,
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get single folder by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<ResourceFolder> => {
        const response = await api.get<ApiResponse<ResourceFolder>>(
            `${BASE_URL}/${id}`,
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
     * Create a new folder
     */
    create: async (payload: FolderCreatePayload): Promise<ResourceFolder> => {
        const response = await api.post<ApiResponse<ResourceFolder>>(
            BASE_URL,
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

    /**
     * Update an existing folder
     */
    update: async (
        id: string | number,
        payload: FolderUpdatePayload
    ): Promise<ResourceFolder> => {
        const response = await api.patch<ApiResponse<ResourceFolder>>(
            `${BASE_URL}/${id}`,
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

    /**
     * Delete a folder
     */
    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default foldersApi;
