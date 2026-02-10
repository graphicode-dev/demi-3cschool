/**
 * Support Block Feature - API Module
 *
 * Public exports for the support block API layer.
 */

// Types
export type {
    AgentStatus,
    AgentRole,
    Agent,
    Block,
    TeamStats,
    SupportBlockData,
} from "../types";

// Query Keys
export {
    supportBlockKeys,
    type SupportBlockQueryKey,
} from "./supportBlock.keys";

// API Functions
export { supportBlockApi } from "./supportBlock.api";

// Query Hooks
export {
    useTeamStats,
    useBlocks,
    useBlock,
    useSupportBlockData,
} from "./supportBlock.queries";
