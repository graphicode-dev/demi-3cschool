/**
 * Distribution Feature - Domain Types
 *
 * Types for the Distribution domain including:
 * - Distribution stats
 * - Block workload
 * - Agent workload indicators
 */

// ============================================================================
// Enums
// ============================================================================

export type DistributionMethod = "load_balance" | "round_robin" | "manual";

export type WorkloadLevel = "low" | "medium" | "high";

// ============================================================================
// Stats Types
// ============================================================================

/**
 * Distribution statistics
 */
export interface DistributionStats {
    totalActiveTickets: number;
    availableAgents: number;
    avgTicketsPerAgent: number;
}

// ============================================================================
// Block Workload Types
// ============================================================================

/**
 * Tickets per block for bar chart
 */
export interface BlockTicketCount {
    id: string;
    name: string;
    ticketCount: number;
    color: string;
}

/**
 * Block workload overview card
 */
export interface BlockWorkloadOverview {
    id: string;
    name: string;
    tickets: number;
    agents: string;
    utilization: number;
    status: WorkloadLevel;
}

// ============================================================================
// Agent Workload Types
// ============================================================================

/**
 * Tickets per agent for horizontal bar chart
 */
export interface AgentTicketCount {
    id: string;
    name: string;
    ticketCount: number;
    color: string;
}

/**
 * Agent workload indicator
 */
export interface AgentWorkloadIndicator {
    id: string;
    name: string;
    ticketInfo: string;
    percentage: number;
    level: WorkloadLevel;
}

// ============================================================================
// Distribution Method Config
// ============================================================================

/**
 * Distribution method configuration
 */
export interface DistributionMethodConfig {
    method: DistributionMethod;
    isActive: boolean;
    description: string;
}

// ============================================================================
// Complete Distribution Data
// ============================================================================

/**
 * Complete distribution data
 */
export interface DistributionData {
    stats: DistributionStats;
    methodConfig: DistributionMethodConfig;
    ticketsPerBlock: BlockTicketCount[];
    ticketsPerAgent: AgentTicketCount[];
    blockWorkloadOverview: BlockWorkloadOverview[];
    agentWorkloadIndicators: AgentWorkloadIndicator[];
    hasHighWorkloadAlert: boolean;
}
