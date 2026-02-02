/**
 * Resources Feature - API Functions
 *
 * Raw API functions for resources domain.
 * These are pure functions that make HTTP requests.
 *
 * TODO: Replace mock implementations with real API calls
 */

import type {
    Resource,
    ResourcesListParams,
    ResourceCreatePayload,
    ResourceUpdatePayload,
    MoveResourcePayload,
} from "../../types";
import {
    getMockResources,
    getMockResourceById,
    MOCK_RESOURCES,
} from "../../mocks";

const BASE_URL = "/resources";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    ): Promise<Resource[]> => {
        // TODO: Replace with real API call
        // const response = await api.get<ApiResponse<Resource[]>>(BASE_URL, {
        //     params,
        //     signal,
        // });
        await delay(300);

        if (signal?.aborted) {
            throw new Error("Request aborted");
        }

        return getMockResources(params.folderId, params.type, params.search);
    },

    /**
     * Get single resource by ID
     */
    getById: async (id: string, signal?: AbortSignal): Promise<Resource> => {
        // TODO: Replace with real API call
        // const response = await api.get<ApiResponse<Resource>>(
        //     `${BASE_URL}/${id}`,
        //     { signal }
        // );
        await delay(200);

        if (signal?.aborted) {
            throw new Error("Request aborted");
        }

        const resource = getMockResourceById(id);
        if (!resource) {
            throw new Error("Resource not found");
        }

        return resource;
    },

    /**
     * Create a new resource
     */
    create: async (payload: ResourceCreatePayload): Promise<Resource> => {
        // TODO: Replace with real API call with file upload
        // const formData = new FormData();
        // formData.append('title', payload.title);
        // formData.append('description', payload.description);
        // formData.append('type', payload.type);
        // formData.append('folderId', payload.folderId);
        // formData.append('file', payload.file);
        // const response = await api.post<ApiResponse<Resource>>(BASE_URL, formData);
        await delay(800);

        const newResource: Resource = {
            id: `resource-${Date.now()}`,
            title: payload.title,
            description: payload.description,
            type: payload.type,
            fileUrl: `/files/${payload.file.name}`,
            fileName: payload.file.name,
            fileSize: payload.file.size,
            folderId: payload.folderId,
            uploadedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        MOCK_RESOURCES.push(newResource);
        return newResource;
    },

    /**
     * Update an existing resource
     */
    update: async (
        id: string,
        payload: ResourceUpdatePayload
    ): Promise<Resource> => {
        // TODO: Replace with real API call
        // const response = await api.patch<ApiResponse<Resource>>(
        //     `${BASE_URL}/${id}`,
        //     payload
        // );
        await delay(500);

        const resourceIndex = MOCK_RESOURCES.findIndex((r) => r.id === id);
        if (resourceIndex === -1) {
            throw new Error("Resource not found");
        }

        const updatedResource: Resource = {
            ...MOCK_RESOURCES[resourceIndex],
            ...payload,
            updatedAt: new Date().toISOString(),
        };

        if (payload.file) {
            updatedResource.fileUrl = `/files/${payload.file.name}`;
            updatedResource.fileName = payload.file.name;
            updatedResource.fileSize = payload.file.size;
        }

        MOCK_RESOURCES[resourceIndex] = updatedResource;
        return updatedResource;
    },

    /**
     * Delete a resource
     */
    delete: async (id: string): Promise<void> => {
        // TODO: Replace with real API call
        // const response = await api.delete(`${BASE_URL}/${id}`);
        await delay(500);

        const resourceIndex = MOCK_RESOURCES.findIndex((r) => r.id === id);
        if (resourceIndex === -1) {
            throw new Error("Resource not found");
        }

        MOCK_RESOURCES.splice(resourceIndex, 1);
    },

    /**
     * Move a resource to another folder
     */
    move: async (payload: MoveResourcePayload): Promise<Resource> => {
        // TODO: Replace with real API call
        // const response = await api.patch<ApiResponse<Resource>>(
        //     `${BASE_URL}/${payload.resourceId}/move`,
        //     { targetFolderId: payload.targetFolderId }
        // );
        await delay(500);

        const resourceIndex = MOCK_RESOURCES.findIndex(
            (r) => r.id === payload.resourceId
        );
        if (resourceIndex === -1) {
            throw new Error("Resource not found");
        }

        const updatedResource: Resource = {
            ...MOCK_RESOURCES[resourceIndex],
            folderId: payload.targetFolderId,
            updatedAt: new Date().toISOString(),
        };

        MOCK_RESOURCES[resourceIndex] = updatedResource;
        return updatedResource;
    },
};

export default resourcesApi;
