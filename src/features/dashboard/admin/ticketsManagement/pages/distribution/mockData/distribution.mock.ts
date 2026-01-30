/**
 * Distribution Mock Data
 *
 * Mock data for distribution feature.
 * TODO: Remove this file when using real API.
 */

import type {
    DistributionStats,
    DistributionMethodConfig,
    BlockTicketCount,
    BlockWorkloadOverview,
    AgentTicketCount,
    AgentWorkloadIndicator,
    DistributionData,
} from "../types";

// ============================================================================
// Mock Stats
// ============================================================================

export const mockDistributionStats: DistributionStats = {
    totalActiveTickets: 117,
    availableAgents: 17,
    avgTicketsPerAgent: 6.9,
};

// ============================================================================
// Mock Distribution Method Config
// ============================================================================

export const mockMethodConfig: DistributionMethodConfig = {
    method: "load_balance",
    isActive: true,
    description:
        "Tickets are distributed based on current workload to balance the load across agents",
};

// ============================================================================
// Mock Tickets Per Block
// ============================================================================

export const mockTicketsPerBlock: BlockTicketCount[] = [
    { id: "b1", name: "Web Development", ticketCount: 21, color: "#00AEED" },
    { id: "b2", name: "Data Science", ticketCount: 14, color: "#22C55E" },
    { id: "b3", name: "Career Services", ticketCount: 7, color: "#F97316" },
    { id: "b4", name: "General Inquiries", ticketCount: 7, color: "#6C63FF" },
];

// ============================================================================
// Mock Tickets Per Agent
// ============================================================================

export const mockTicketsPerAgent: AgentTicketCount[] = [
    { id: "a1", name: "Ahmed", ticketCount: 18, color: "#00AEED" },
    { id: "a2", name: "Fouad", ticketCount: 15, color: "#22C55E" },
    { id: "a3", name: "Ali", ticketCount: 10, color: "#F97316" },
    { id: "a4", name: "Ahmad", ticketCount: 5, color: "#6C63FF" },
];

// ============================================================================
// Mock Block Workload Overview
// ============================================================================

export const mockBlockWorkloadOverview: BlockWorkloadOverview[] = [
    {
        id: "b1",
        name: "Web Development",
        tickets: 26,
        agents: "3/4",
        utilization: 68,
        status: "high",
    },
    {
        id: "b2",
        name: "Data Science",
        tickets: 24,
        agents: "3/4",
        utilization: 45,
        status: "medium",
    },
    {
        id: "b3",
        name: "Mobile Development",
        tickets: 26,
        agents: "3/4",
        utilization: 58,
        status: "high",
    },
    {
        id: "b4",
        name: "Career Services",
        tickets: 26,
        agents: "3/4",
        utilization: 45,
        status: "medium",
    },
    {
        id: "b5",
        name: "General Inquiries",
        tickets: 28,
        agents: "3/4",
        utilization: 42,
        status: "medium",
    },
];

// ============================================================================
// Mock Agent Workload Indicators
// ============================================================================

export const mockAgentWorkloadIndicators: AgentWorkloadIndicator[] = [
    {
        id: "a1",
        name: "Sarah",
        ticketInfo: "8/15 tickets",
        percentage: 47,
        level: "low",
    },
    {
        id: "a2",
        name: "Ahmed",
        ticketInfo: "12/15 tickets",
        percentage: 85,
        level: "high",
    },
    {
        id: "a3",
        name: "Reham",
        ticketInfo: "9/15 tickets",
        percentage: 68,
        level: "medium",
    },
    {
        id: "a4",
        name: "Sarah",
        ticketInfo: "8/13 tickets",
        percentage: 48,
        level: "low",
    },
    {
        id: "a5",
        name: "Sarah",
        ticketInfo: "8/10 tickets",
        percentage: 43,
        level: "low",
    },
    {
        id: "a6",
        name: "Reham",
        ticketInfo: "8/15 tickets",
        percentage: 60,
        level: "medium",
    },
    {
        id: "a7",
        name: "Sarah",
        ticketInfo: "9/11 tickets",
        percentage: 46,
        level: "low",
    },
    {
        id: "a8",
        name: "Sarah",
        ticketInfo: "8/15 tickets",
        percentage: 48,
        level: "low",
    },
    {
        id: "a9",
        name: "Reham",
        ticketInfo: "7/15 tickets",
        percentage: 60,
        level: "medium",
    },
    {
        id: "a10",
        name: "Ahmed",
        ticketInfo: "12/15 tickets",
        percentage: 80,
        level: "high",
    },
];

// ============================================================================
// Mock Data Getters
// ============================================================================

/**
 * Get mock distribution stats
 */
export const getMockDistributionStats = (): DistributionStats =>
    mockDistributionStats;

/**
 * Get mock method config
 */
export const getMockMethodConfig = (): DistributionMethodConfig =>
    mockMethodConfig;

/**
 * Get mock tickets per block
 */
export const getMockTicketsPerBlock = (): BlockTicketCount[] =>
    mockTicketsPerBlock;

/**
 * Get mock tickets per agent
 */
export const getMockTicketsPerAgent = (): AgentTicketCount[] =>
    mockTicketsPerAgent;

/**
 * Get mock block workload overview
 */
export const getMockBlockWorkloadOverview = (): BlockWorkloadOverview[] =>
    mockBlockWorkloadOverview;

/**
 * Get mock agent workload indicators
 */
export const getMockAgentWorkloadIndicators = (): AgentWorkloadIndicator[] =>
    mockAgentWorkloadIndicators;

/**
 * Get complete mock distribution data
 */
export const getMockDistributionData = (): DistributionData => ({
    stats: mockDistributionStats,
    methodConfig: mockMethodConfig,
    ticketsPerBlock: mockTicketsPerBlock,
    ticketsPerAgent: mockTicketsPerAgent,
    blockWorkloadOverview: mockBlockWorkloadOverview,
    agentWorkloadIndicators: mockAgentWorkloadIndicators,
    hasHighWorkloadAlert: true,
});
