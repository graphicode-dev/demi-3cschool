/**
 * Overview Mock Data
 *
 * Mock data for overview feature.
 * TODO: Remove this file when using real API.
 */

import type {
    OverviewStats,
    TicketStatusDistribution,
    WorkloadByBlock,
    SystemHealth,
    WeeklyTrendItem,
    OverviewData,
} from "../types";

// ============================================================================
// Mock Stats
// ============================================================================

export const mockOverviewStats: OverviewStats = {
    newTicketsToday: 20,
    newTicketsTodayTrend: 5,
    openTickets: 17,
    openTicketsTrend: -3,
    resolvedTickets: 7,
    resolvedTicketsTrend: 12,
    activeAgents: 17,
    activeAgentsTrend: 2,
};

// ============================================================================
// Mock Status Distribution
// ============================================================================

export const mockStatusDistribution: TicketStatusDistribution = {
    open: 25,
    inProgress: 35,
    resolved: 20,
    closed: 20,
};

// ============================================================================
// Mock Workload By Block
// ============================================================================

export const mockWorkloadByBlock: WorkloadByBlock[] = [
    { name: "mainCampus", value: 45, color: "#00AEED" },
    { name: "mediaDepartment", value: 78, color: "#22C55E" },
    { name: "careerServices", value: 32, color: "#F97316" },
    { name: "generalHelpdesk", value: 56, color: "#6C63FF" },
];

// ============================================================================
// Mock System Health
// ============================================================================

export const mockSystemHealth: SystemHealth = {
    responseTime: {
        value: "excellent",
        status: "excellent",
    },
    resolutionRate: {
        value: "87%",
        status: "good",
    },
    queueLength: {
        value: "moderate",
        status: "warning",
    },
    agentAvailability: {
        value: "high",
        status: "excellent",
    },
};

// ============================================================================
// Mock Weekly Trend
// ============================================================================

export const mockWeeklyTrend: WeeklyTrendItem[] = [
    { day: "mon", open: 12, resolved: 8 },
    { day: "tue", open: 15, resolved: 12 },
    { day: "wed", open: 8, resolved: 10 },
    { day: "thu", open: 18, resolved: 14 },
    { day: "fri", open: 10, resolved: 16 },
    { day: "sat", open: 6, resolved: 8 },
    { day: "sun", open: 4, resolved: 5 },
];

// ============================================================================
// Mock Data Getters
// ============================================================================

/**
 * Get mock overview stats
 */
export const getMockOverviewStats = (): OverviewStats => mockOverviewStats;

/**
 * Get mock status distribution
 */
export const getMockStatusDistribution = (): TicketStatusDistribution =>
    mockStatusDistribution;

/**
 * Get mock workload by block
 */
export const getMockWorkloadByBlock = (): WorkloadByBlock[] =>
    mockWorkloadByBlock;

/**
 * Get mock system health
 */
export const getMockSystemHealth = (): SystemHealth => mockSystemHealth;

/**
 * Get mock weekly trend
 */
export const getMockWeeklyTrend = (): WeeklyTrendItem[] => mockWeeklyTrend;

/**
 * Get complete mock overview data
 */
export const getMockOverviewData = (): OverviewData => ({
    stats: mockOverviewStats,
    statusDistribution: mockStatusDistribution,
    workloadByBlock: mockWorkloadByBlock,
    systemHealth: mockSystemHealth,
    weeklyTrend: mockWeeklyTrend,
});
