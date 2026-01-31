/**
 * Team Structure Feature - API Module
 *
 * Public exports for the team structure API layer.
 */

// Types
export type {
    AgentStatus,
    AgentRole,
    Agent,
    Block,
    TeamStats,
    TeamStructureData,
} from "../types";

// Query Keys
export {
    teamStructureKeys,
    type TeamStructureQueryKey,
} from "./teamStructure.keys";

// API Functions
export { teamStructureApi } from "./teamStructure.api";

// Query Hooks
export {
    useTeamStats,
    useBlocks,
    useBlock,
    useTeamStructureData,
} from "./teamStructure.queries";
