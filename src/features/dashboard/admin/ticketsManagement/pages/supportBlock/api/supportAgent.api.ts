/**
 * Support Agent Feature - API Functions
 *
 * Raw API functions for support agents domain.
 */

import { api } from "@/shared/api/client";
import type {
    SupportAgent,
    SupportAgentsListResponse,
    AddLeadPayload,
    AddAgentPayload,
    UpdateAgentStatusPayload,
    ReassignAgentPayload,
    ApiResponse,
} from "../types";
import {
    ListQueryParams,
    PaginatedData,
    PaginatedResponse,
} from "@/shared/api";

const BASE_URL = "/support-agents";

/**
 * Support Agent API functions
 */
export const supportAgentApi = {
    /**
     * Get support agents by block ID (paginated)
     */
    getByBlockId: async (
        blockId: number | string,
        params: ListQueryParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<SupportAgent>> => {
        const { page, search } = params;

        const response = await api.get<PaginatedResponse<SupportAgent>>(
            `${BASE_URL}/block/${blockId}`,
            {
                params: {
                    ...(page ? { page } : {}),
                    ...(search ? { search } : {}),
                },
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Add a new lead to a support block
     */
    addLead: async (payload: AddLeadPayload): Promise<SupportAgent> => {
        const response = await api.post<ApiResponse<SupportAgent>>(
            `${BASE_URL}/add-lead`,
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
     * Add a new agent to a support block
     */
    addAgent: async (payload: AddAgentPayload): Promise<SupportAgent> => {
        const response = await api.post<ApiResponse<SupportAgent>>(
            `${BASE_URL}/add-agent`,
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
     * Update agent status
     */
    updateStatus: async (
        agentId: number | string,
        payload: UpdateAgentStatusPayload
    ): Promise<SupportAgent> => {
        const response = await api.patch<ApiResponse<SupportAgent>>(
            `${BASE_URL}/${agentId}/status`,
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
     * Reassign agent to different block/lead
     */
    reassign: async (
        agentId: number | string,
        payload: ReassignAgentPayload
    ): Promise<SupportAgent> => {
        const response = await api.patch<ApiResponse<SupportAgent>>(
            `${BASE_URL}/${agentId}/reassign`,
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
     * Delete a support agent
     */
    delete: async (agentId: number | string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${agentId}`);

        if (response.error) {
            throw response.error;
        }
    },
};
