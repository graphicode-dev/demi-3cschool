/**
 * Support Block Feature - API Module
 *
 * Public exports for the support block API layer.
 */

// Types
export type {
    AgentStatus,
    SupportBlockLead,
    SupportBlock,
    SupportBlocksListResponse,
    CreateSupportBlockPayload,
    UpdateSupportBlockPayload,
    SupportBlockStats,
    // Support Agent types
    SupportAgent,
    SupportAgentsListResponse,
    AddLeadPayload,
    AddAgentPayload,
    UpdateAgentStatusPayload,
    ReassignAgentPayload,
} from "../types";

// Query Keys
export {
    supportBlockKeys,
    type SupportBlockQueryKey,
} from "./supportBlock.keys";
export { supportAgentKeys } from "./supportAgent.keys";

// API Functions
export { supportBlockApi } from "./supportBlock.api";
export { supportAgentApi } from "./supportAgent.api";

// Query Hooks
export { useSupportBlocks, useSupportBlock } from "./supportBlock.queries";
export { useSupportAgentsByBlock } from "./supportAgent.queries";

// Mutation Hooks
export {
    useCreateSupportBlock,
    useUpdateSupportBlock,
    useDeleteSupportBlock,
} from "./supportBlock.mutations";

export {
    useAddLead,
    useAddAgent,
    useUpdateAgentStatus,
    useReassignAgent,
    useDeleteSupportAgent,
} from "./supportAgent.mutations";
