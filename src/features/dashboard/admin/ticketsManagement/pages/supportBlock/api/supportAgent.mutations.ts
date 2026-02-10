/**
 * Support Agent Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for support agent operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportAgentKeys } from "./supportAgent.keys";
import { supportBlockKeys } from "./supportBlock.keys";
import { supportAgentApi } from "./supportAgent.api";
import type {
    AddLeadPayload,
    AddAgentPayload,
    UpdateAgentStatusPayload,
    ReassignAgentPayload,
} from "../types";

/**
 * Hook to add a new lead
 */
export function useAddLead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddLeadPayload) => supportAgentApi.addLead(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supportAgentKeys.all });
            queryClient.invalidateQueries({
                queryKey: supportAgentKeys.byBlock(variables.support_block_id),
            });
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
        },
    });
}

/**
 * Hook to add a new agent
 */
export function useAddAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddAgentPayload) =>
            supportAgentApi.addAgent(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supportAgentKeys.all });
            queryClient.invalidateQueries({
                queryKey: supportAgentKeys.byBlock(variables.support_block_id),
            });
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
        },
    });
}

/**
 * Hook to update agent status
 */
export function useUpdateAgentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            agentId,
            payload,
        }: {
            agentId: number | string;
            payload: UpdateAgentStatusPayload;
        }) => supportAgentApi.updateStatus(agentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportAgentKeys.all });
        },
    });
}

/**
 * Hook to reassign an agent
 */
export function useReassignAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            agentId,
            payload,
        }: {
            agentId: number | string;
            payload: ReassignAgentPayload;
        }) => supportAgentApi.reassign(agentId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: supportAgentKeys.all });
            queryClient.invalidateQueries({
                queryKey: supportAgentKeys.byBlock(variables.payload.support_block_id),
            });
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
        },
    });
}

/**
 * Hook to delete a support agent
 */
export function useDeleteSupportAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (agentId: number | string) =>
            supportAgentApi.delete(agentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: supportAgentKeys.all });
            queryClient.invalidateQueries({ queryKey: supportBlockKeys.all });
        },
    });
}
