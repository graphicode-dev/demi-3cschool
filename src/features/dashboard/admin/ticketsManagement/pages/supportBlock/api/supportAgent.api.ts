import type {
    SupportAgent,
    AddLeadPayload,
    AddAgentPayload,
    UpdateAgentStatusPayload,
    ReassignAgentPayload,
} from "../types";
import {
    ListQueryParams,
    PaginatedData,
} from "@/shared/api";
import {
    getMockSupportAgentsByBlockId,
    addMockLead,
    addMockAgent,
    updateMockAgentStatus,
    reassignMockAgent,
    removeMockAgent,
} from "../mockData";

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
        return getMockSupportAgentsByBlockId(blockId, params);
    },

    /**
     * Add a new lead to a support block
     */
    addLead: async (payload: AddLeadPayload): Promise<SupportAgent> => {
        return addMockLead(payload);
    },

    /**
     * Add a new agent to a support block
     */
    addAgent: async (payload: AddAgentPayload): Promise<SupportAgent> => {
        return addMockAgent(payload);
    },

    /**
     * Update agent status
     */
    updateStatus: async (
        agentId: number | string,
        payload: UpdateAgentStatusPayload
    ): Promise<SupportAgent> => {
        return updateMockAgentStatus(agentId, payload);
    },

    /**
     * Reassign agent to different block/lead
     */
    reassign: async (
        agentId: number | string,
        payload: ReassignAgentPayload
    ): Promise<SupportAgent> => {
        return reassignMockAgent(agentId, payload);
    },

    /**
     * Delete a support agent
     */
    delete: async (agentId: number | string): Promise<void> => {
        return removeMockAgent(agentId);
    },
};
