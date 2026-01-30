/**
 * Overview Feature - Domain Types
 *
 * Types for the Overview domain including:
 * - OverviewStats entity
 * - TicketStatusDistribution
 * - WorkloadByBlock
 * - SystemHealth
 * - WeeklyTrend
 * - QuickNavItem
 */

// ============================================================================
// Enums
// ============================================================================

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

// ============================================================================
// Stats Types
// ============================================================================

/**
 * Overview statistics
 */
export interface OverviewStats {
    newTicketsToday: number;
    newTicketsTodayTrend?: number;
    openTickets: number;
    openTicketsTrend?: number;
    resolvedTickets: number;
    resolvedTicketsTrend?: number;
    activeAgents: number;
    activeAgentsTrend?: number;
}

/**
 * Ticket status distribution for pie chart
 */
export interface TicketStatusDistribution {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
}

/**
 * Workload by block/department
 */
export interface WorkloadByBlock {
    name: string;
    value: number;
    color: string;
}

/**
 * System health metrics
 */
export interface SystemHealth {
    responseTime: {
        value: string;
        status: "excellent" | "good" | "warning" | "critical";
    };
    resolutionRate: {
        value: string;
        status: "excellent" | "good" | "warning" | "critical";
    };
    queueLength: {
        value: string;
        status: "excellent" | "good" | "warning" | "critical";
    };
    agentAvailability: {
        value: string;
        status: "excellent" | "good" | "warning" | "critical";
    };
}

/**
 * Weekly ticket trend data
 */
export interface WeeklyTrendItem {
    day: string;
    open: number;
    resolved: number;
}

/**
 * Quick navigation item
 */
export interface QuickNavItem {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
}

// ============================================================================
// Overview Data
// ============================================================================

/**
 * Complete overview data
 */
export interface OverviewData {
    stats: OverviewStats;
    statusDistribution: TicketStatusDistribution;
    workloadByBlock: WorkloadByBlock[];
    systemHealth: SystemHealth;
    weeklyTrend: WeeklyTrendItem[];
}
