/**
 * Support Block Feature - Domain Types
 *
 * Types matching the exact API response structure.
 */

// ============================================================================
// Enums
// ============================================================================

export type AgentStatus = "available" | "busy" | "offline";

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Member within a support block (can be lead or agent)
 */
export interface SupportBlockMember {
    id: number;
    userId: number;
    name: string;
    email: string;
    status: AgentStatus;
    isLead: boolean;
}

/**
 * @deprecated Use SupportBlockMember instead
 */
export type SupportBlockLead = SupportBlockMember;

/**
 * Support Block entity from API
 */
export interface SupportBlock {
    id: number;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
    totalAgents: number;
    availableAgents: number;
    openTickets: number;
    members: SupportBlockMember[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Paginated response for support blocks list
 */
export interface SupportBlocksListResponse {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: SupportBlock[];
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Payload for creating a support block
 */
export interface CreateSupportBlockPayload {
    name: string;
    slug: string;
    description: string;
    is_active: number; // 0 or 1
}

/**
 * Payload for updating a support block
 */
export interface UpdateSupportBlockPayload {
    name?: string;
    slug?: string;
    description?: string;
    is_active?: number; // 0 or 1
}

// ============================================================================
// Support Agent Types (from /support-agents API)
// ============================================================================

/**
 * User info within support agent
 */
export interface SupportAgentUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Block info within support agent
 */
export interface SupportAgentBlock {
    id: number;
    name: string;
    slug: string;
}

/**
 * Lead info within support agent (when agent has a lead)
 */
export interface SupportAgentLead {
    id: number;
    userId: number;
    name: string;
    email: string;
}

/**
 * Support Agent entity from API
 */
export interface SupportAgent {
    id: number;
    userId: number;
    leadId: number | null;
    isLead: boolean;
    status: AgentStatus;
    user: SupportAgentUser;
    supportBlock: SupportAgentBlock;
    lead: SupportAgentLead | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Paginated response for support agents list
 */
export interface SupportAgentsListResponse {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: SupportAgent[];
}

// ============================================================================
// Support Agent Payload Types
// ============================================================================

/**
 * Payload for adding a lead
 */
export interface AddLeadPayload {
    user_id: string;
    support_block_id: string;
}

/**
 * Payload for adding an agent
 */
export interface AddAgentPayload {
    user_id: string;
    support_block_id: string;
    lead_id: string;
}

/**
 * Payload for updating agent status
 */
export interface UpdateAgentStatusPayload {
    status: AgentStatus;
}

/**
 * Payload for reassigning an agent
 */
export interface ReassignAgentPayload {
    support_block_id: string;
    lead_id: string | null;
}

// ============================================================================
// Computed/Derived Types (for UI)
// ============================================================================

/**
 * Stats computed from support blocks list
 */
export interface SupportBlockStats {
    totalBlocks: number;
    totalLeads: number;
    totalAgents: number;
    totalOpenTickets: number;
}
