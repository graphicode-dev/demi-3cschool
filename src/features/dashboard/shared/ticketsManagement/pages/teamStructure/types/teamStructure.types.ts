/**
 * Team Structure Feature - Domain Types
 *
 * Types for the Team Structure domain including:
 * - Agent entity
 * - Block entity
 * - Lead entity
 * - TeamStats
 */

// ============================================================================
// Enums
// ============================================================================

export type AgentStatus = "available" | "busy" | "offline";

export type AgentRole = "lead" | "agent";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Agent entity
 */
export interface Agent {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    role: AgentRole;
    status: AgentStatus;
    activeTickets: number;
    blockId?: string;
    blockName?: string;
    managedBy?: string;
}

/**
 * Lead entity - extends Agent with lead-specific properties
 */
export interface Lead extends Agent {
    role: "lead";
    assignedBlock: string;
    assignedBlockId: string;
    agentsCount: number;
}

/**
 * Block/Team entity
 */
export interface Block {
    id: string;
    name: string;
    leadId?: string;
    leadName: string;
    agents: Agent[];
    totalAgents: number;
    availableAgents: number;
    totalTickets: number;
}

/**
 * User entity for search/selection
 */
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

// ============================================================================
// Stats Types
// ============================================================================

/**
 * Team structure statistics
 */
export interface TeamStats {
    totalBlocks: number;
    blockLeads: number;
    totalAgents: number;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Team structure data
 */
export interface TeamStructureData {
    stats: TeamStats;
    blocks: Block[];
}
