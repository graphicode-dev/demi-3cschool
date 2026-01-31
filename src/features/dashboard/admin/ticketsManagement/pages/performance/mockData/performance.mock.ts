/**
 * Performance Mock Data
 *
 * Mock data for performance feature.
 * TODO: Remove this file when using real API.
 */

import type {
    PerformanceStats,
    WeeklyTrendDataPoint,
    AgentResolutionRate,
    AgentPerformanceRow,
    PeriodSummary,
    TopPerformer,
    PerformanceData,
} from "../types";

// ============================================================================
// Mock Stats
// ============================================================================

export const mockPerformanceStats: PerformanceStats = {
    avgResponseTime: "18 min",
    responseTimeTrend: 4.5,
    resolutionRate: 88.2,
    resolutionRateTrend: 14,
    topPerformer: "Ahmed",
    topPerformerTrend: 48,
    needsAttention: 4,
};

// ============================================================================
// Mock Weekly Trend
// ============================================================================

export const mockWeeklyTrend: WeeklyTrendDataPoint[] = [
    { day: "Monday", opened: 12, resolved: 10 },
    { day: "Tue", opened: 8, resolved: 12 },
    { day: "Wed", opened: 15, resolved: 14 },
    { day: "Thu", opened: 10, resolved: 8 },
    { day: "Fri", opened: 18, resolved: 16 },
    { day: "Sat", opened: 6, resolved: 8 },
    { day: "Sun", opened: 4, resolved: 6 },
];

// ============================================================================
// Mock Resolution Rate by Agent
// ============================================================================

export const mockResolutionRateByAgent: AgentResolutionRate[] = [
    { id: "a1", name: "Ahmed", rate: 35, color: "#00AEED" },
    { id: "a2", name: "Fouad", rate: 85, color: "#22C55E" },
    { id: "a3", name: "Ali", rate: 95, color: "#F97316" },
    { id: "a4", name: "Ahmad", rate: 45, color: "#6C63FF" },
];

// ============================================================================
// Mock Agent Performance Table
// ============================================================================

export const mockAgentPerformanceTable: AgentPerformanceRow[] = [
    {
        id: "a1",
        name: "Ahmed Mohamed",
        assigned: 45,
        closed: 38,
        avgResponse: "15 min",
        resolutionRate: 84,
        rating: "average",
    },
    {
        id: "a2",
        name: "Ahmed Mohamed",
        assigned: 90,
        closed: 40,
        avgResponse: "15 min",
        resolutionRate: 54,
        rating: "excellent",
    },
    {
        id: "a3",
        name: "Ahmed Mohamed",
        assigned: 30,
        closed: 55,
        avgResponse: "15 min",
        resolutionRate: 84,
        rating: "good",
    },
];

// ============================================================================
// Mock Period Summary
// ============================================================================

export const mockPeriodSummary: PeriodSummary = {
    totalTicketsAssigned: 858,
    totalTicketsClosed: 753,
    overallClosureRate: 87.8,
};

// ============================================================================
// Mock Top Performers
// ============================================================================

export const mockTopPerformers: TopPerformer[] = [
    { rank: 1, id: "a1", name: "Ahmed Ali", score: 94 },
    { rank: 2, id: "a2", name: "Fouad Ashraf", score: 93 },
    { rank: 3, id: "a3", name: "Fouad Ashraf", score: 93 },
    { rank: 4, id: "a4", name: "Fouad Ashraf", score: 92 },
    { rank: 5, id: "a5", name: "Fouad Ashraf", score: 91 },
];

// ============================================================================
// Mock Data Getters
// ============================================================================

/**
 * Get mock performance stats
 */
export const getMockPerformanceStats = (): PerformanceStats =>
    mockPerformanceStats;

/**
 * Get mock weekly trend
 */
export const getMockWeeklyTrend = (): WeeklyTrendDataPoint[] => mockWeeklyTrend;

/**
 * Get mock resolution rate by agent
 */
export const getMockResolutionRateByAgent = (): AgentResolutionRate[] =>
    mockResolutionRateByAgent;

/**
 * Get mock agent performance table
 */
export const getMockAgentPerformanceTable = (): AgentPerformanceRow[] =>
    mockAgentPerformanceTable;

/**
 * Get mock period summary
 */
export const getMockPeriodSummary = (): PeriodSummary => mockPeriodSummary;

/**
 * Get mock top performers
 */
export const getMockTopPerformers = (): TopPerformer[] => mockTopPerformers;

/**
 * Get complete mock performance data
 */
export const getMockPerformanceData = (): PerformanceData => ({
    stats: mockPerformanceStats,
    weeklyTrend: mockWeeklyTrend,
    resolutionRateByAgent: mockResolutionRateByAgent,
    agentPerformanceTable: mockAgentPerformanceTable,
    periodSummary: mockPeriodSummary,
    topPerformers: mockTopPerformers,
});
