import type {
    SupportBlock,
    SupportBlocksListResponse,
    CreateSupportBlockPayload,
    UpdateSupportBlockPayload,
} from "../types";
import {
    getMockSupportBlocksList,
    getMockSupportBlockById,
    createMockSupportBlock,
    updateMockSupportBlock,
    deleteMockSupportBlock,
} from "../mockData";

/**
 * Support Block API functions
 */
export const supportBlockApi = {
    /**
     * Get all support blocks (paginated)
     */
    getList: async (
        page: number = 1,
        signal?: AbortSignal
    ): Promise<SupportBlocksListResponse> => {
        return getMockSupportBlocksList(page);
    },

    /**
     * Get single support block by ID
     */
    getById: async (
        id: number | string,
        signal?: AbortSignal
    ): Promise<SupportBlock> => {
        return getMockSupportBlockById(id);
    },

    /**
     * Create a new support block
     */
    create: async (
        payload: CreateSupportBlockPayload
    ): Promise<SupportBlocksListResponse> => {
        createMockSupportBlock(payload);
        return getMockSupportBlocksList(1);
    },

    /**
     * Update an existing support block
     */
    update: async (
        id: number | string,
        payload: UpdateSupportBlockPayload
    ): Promise<SupportBlock> => {
        return updateMockSupportBlock(id, payload);
    },

    /**
     * Delete a support block
     */
    delete: async (id: number | string): Promise<void> => {
        return deleteMockSupportBlock(id);
    },
};

export default supportBlockApi;
