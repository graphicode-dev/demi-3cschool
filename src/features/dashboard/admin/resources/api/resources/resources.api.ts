/**
 * Resources Feature - API Functions
 *
 * Raw API functions for resources domain.
 * These are pure functions that make HTTP requests.
 */

import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    Resource,
    ResourcesListParams,
    ResourceCreatePayload,
    ResourceUpdatePayload,
    MoveResourcePayload,
} from "../../types";

const BASE_URL = "/learning-resources";

/**
 * Resources API functions
 */
export const resourcesApi = {
    /**
     * Get list of resources by folder ID (with optional filters)
     */
    getList: async (
        params: ResourcesListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Resource>> => {
        const queryParams: Record<string, unknown> = {};

        if (params.page) queryParams.page = params.page;
        if (params.type && params.type !== "all") queryParams.type = params.type;
        if (params.search) queryParams.search = params.search;

        const response = await api.get<
            ApiResponse<PaginatedData<Resource>>
        >(`${BASE_URL}/folder/${params.folderId}`, {
            params: queryParams,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get single resource by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<Resource> => {
        const response = await api.get<ApiResponse<Resource>>(
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
     * Create a new resource
     */
    create: async (payload: ResourceCreatePayload): Promise<Resource> => {
        const formData = new FormData();
        formData.append("folderId", String(payload.folderId));
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        formData.append("type", payload.type);
        formData.append("sort_order", String(payload.sortOrder));
        formData.append("is_active", String(payload.isActive));
        formData.append("file", payload.file);

        const response = await api.post<ApiResponse<Resource>>(BASE_URL, formData, {
            meta: { multipart: true },
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update an existing resource
     */
    update: async (
        id: string | number,
        payload: ResourceUpdatePayload
    ): Promise<Resource> => {
        const formData = new FormData();

        if (payload.folderId != null) {
            formData.append("folderId", String(payload.folderId));
        }
        if (payload.title != null) {
            formData.append("title", payload.title);
        }
        if (payload.description != null) {
            formData.append("description", payload.description);
        }
        if (payload.type != null) {
            formData.append("type", payload.type);
        }
        if (payload.sortOrder != null) {
            formData.append("sort_order", String(payload.sortOrder));
        }
        if (payload.isActive != null) {
            formData.append("is_active", String(payload.isActive));
        }
        if (payload.file) {
            formData.append("file", payload.file);
        }

        const response = await api.post<ApiResponse<Resource>>(
            `${BASE_URL}/${id}`,
            formData,
            { meta: { multipart: true } }
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
     * Delete a resource
     */
    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete<ApiResponse<unknown>>(
            `${BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Move a resource to another folder
     */
    move: async (payload: MoveResourcePayload): Promise<Resource> => {
        throw new Error("Not implemented");
    },
};

export default resourcesApi;
