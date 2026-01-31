/**
 * Performance Feature - Domain Types
 *
 * Types for the Performance domain including:
 * - Performance stats
 * - Agent performance table
 * - Period summary
 * - Top performers
 */

// ============================================================================
// Enums
// ============================================================================

export type PeriodFilter = "weekly" | "monthly";

export type RatingLevel = "good" | "average" | "excellent";

// ============================================================================
// Stats Types
// ============================================================================

/**
 * Performance statistics
 */
export interface PerformanceStats {
    avgResponseTime: string;
    responseTimeTrend: number;
    resolutionRate: number;
    resolutionRateTrend: number;
    topPerformer: string;
    topPerformerTrend: number;
    needsAttention: number;
}

// ============================================================================
// Chart Types
// ============================================================================

/**
 * Weekly ticket trend data point
 */
export interface WeeklyTrendDataPoint {
    day: string;
    opened: number;
    resolved: number;
}

/**
 * Resolution rate by agent
 */
export interface AgentResolutionRate {
    id: string;
    name: string;
    rate: number;
    color: string;
}

// ============================================================================
// Table Types
// ============================================================================

/**
 * Agent performance table row
 */
export interface AgentPerformanceRow {
    id: string;
    name: string;
    assigned: number;
    closed: number;
    avgResponse: string;
    resolutionRate: number;
    rating: RatingLevel;
}

// ============================================================================
// Summary Types
// ============================================================================

/**
 * Period summary
 */
export interface PeriodSummary {
    totalTicketsAssigned: number;
    totalTicketsClosed: number;
    overallClosureRate: number;
}

/**
 * Top performer
 */
export interface TopPerformer {
    rank: number;
    id: string;
    name: string;
    score: number;
}

// ============================================================================
// Complete Performance Data
// ============================================================================

/**
 * Complete performance data
 */
export interface PerformanceData {
    stats: PerformanceStats;
    weeklyTrend: WeeklyTrendDataPoint[];
    resolutionRateByAgent: AgentResolutionRate[];
    agentPerformanceTable: AgentPerformanceRow[];
    periodSummary: PeriodSummary;
    topPerformers: TopPerformer[];
}
