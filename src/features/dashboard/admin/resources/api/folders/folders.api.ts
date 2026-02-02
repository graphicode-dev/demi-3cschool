/**
 * Resource Folders Feature - API Functions
 *
 * Raw API functions for resource folders domain.
 * These are pure functions that make HTTP requests.
 *
 * TODO: Replace mock implementations with real API calls
 */

import type {
    ResourceFolder,
    FoldersListParams,
    FolderCreatePayload,
    FolderUpdatePayload,
} from "../../types";
import { getMockFolders, getMockFolderById, MOCK_FOLDERS } from "../../mocks";

const BASE_URL = "/resource-folders";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Resource Folders API functions
 */
export const foldersApi = {
    /**
     * Get list of all folders (with optional filters)
     */
    getList: async (
        params?: FoldersListParams,
        signal?: AbortSignal
    ): Promise<ResourceFolder[]> => {
        // TODO: Replace with real API call
        // const response = await api.get<ApiResponse<ResourceFolder[]>>(BASE_URL, {
        //     params,
        //     signal,
        // });
        await delay(300);

        if (signal?.aborted) {
            throw new Error("Request aborted");
        }

        return getMockFolders(params?.gradeId, params?.termId);
    },

    /**
     * Get single folder by ID
     */
    getById: async (
        id: string,
        signal?: AbortSignal
    ): Promise<ResourceFolder> => {
        // TODO: Replace with real API call
        // const response = await api.get<ApiResponse<ResourceFolder>>(
        //     `${BASE_URL}/${id}`,
        //     { signal }
        // );
        await delay(200);

        if (signal?.aborted) {
            throw new Error("Request aborted");
        }

        const folder = getMockFolderById(id);
        if (!folder) {
            throw new Error("Folder not found");
        }

        return folder;
    },

    /**
     * Create a new folder
     */
    create: async (payload: FolderCreatePayload): Promise<ResourceFolder> => {
        // TODO: Replace with real API call
        // const response = await api.post<ApiResponse<ResourceFolder>>(BASE_URL, payload);
        await delay(500);

        const newFolder: ResourceFolder = {
            id: `folder-${Date.now()}`,
            name: payload.name,
            description: payload.description,
            grade: { id: payload.gradeId, name: `Grade ${payload.gradeId}` },
            term: {
                id: payload.termId,
                name:
                    payload.termId === "term-1" ? "First Term" : "Second Term",
            },
            resourceCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        MOCK_FOLDERS.push(newFolder);
        return newFolder;
    },

    /**
     * Update an existing folder
     */
    update: async (
        id: string,
        payload: FolderUpdatePayload
    ): Promise<ResourceFolder> => {
        // TODO: Replace with real API call
        // const response = await api.patch<ApiResponse<ResourceFolder>>(
        //     `${BASE_URL}/${id}`,
        //     payload
        // );
        await delay(500);

        const folderIndex = MOCK_FOLDERS.findIndex((f) => f.id === id);
        if (folderIndex === -1) {
            throw new Error("Folder not found");
        }

        const updatedFolder = {
            ...MOCK_FOLDERS[folderIndex],
            ...payload,
            updatedAt: new Date().toISOString(),
        };

        if (payload.gradeId) {
            updatedFolder.grade = {
                id: payload.gradeId,
                name: `Grade ${payload.gradeId}`,
            };
        }
        if (payload.termId) {
            updatedFolder.term = {
                id: payload.termId,
                name:
                    payload.termId === "term-1" ? "First Term" : "Second Term",
            };
        }

        MOCK_FOLDERS[folderIndex] = updatedFolder;
        return updatedFolder;
    },

    /**
     * Delete a folder
     */
    delete: async (id: string): Promise<void> => {
        // TODO: Replace with real API call
        // const response = await api.delete(`${BASE_URL}/${id}`);
        await delay(500);

        const folderIndex = MOCK_FOLDERS.findIndex((f) => f.id === id);
        if (folderIndex === -1) {
            throw new Error("Folder not found");
        }

        MOCK_FOLDERS.splice(folderIndex, 1);
    },
};

export default foldersApi;
