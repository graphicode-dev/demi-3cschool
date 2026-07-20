import type {
    DistributionStats,
    DistributionMethodConfig,
    BlockTicketCount,
    AgentTicketCount,
    BlockWorkloadOverview,
    AgentWorkloadIndicator,
    DistributionData,
} from "../types";

export const mockDistributionStats: DistributionStats = {
    totalActiveTickets: 42,
    availableAgents: 12,
    avgTicketsPerAgent: 3.5,
};

export const mockDistributionMethodConfig: DistributionMethodConfig = {
    method: "load_balance",
    isActive: true,
    description: "Assigns tickets to agents with the lowest active ticket count to balance the workload.",
};

export const mockTicketsPerBlock: BlockTicketCount[] = [
    { id: "1", name: "Main Campus", ticketCount: 15, color: "#3B82F6" },
    { id: "2", name: "Media Department", ticketCount: 12, color: "#10B981" },
    { id: "3", name: "Career Services", ticketCount: 8, color: "#F59E0B" },
    { id: "4", name: "General Helpdesk", ticketCount: 7, color: "#8B5CF6" },
];

export const mockTicketsPerAgent: AgentTicketCount[] = [
    { id: "1", name: "Sarah Ahmed", ticketCount: 4, color: "#3B82F6" },
    { id: "2", name: "Mohamed Ali", ticketCount: 3, color: "#10B981" },
    { id: "3", name: "Youssef Omar", ticketCount: 5, color: "#F59E0B" },
    { id: "4", name: "Nour Hasan", ticketCount: 2, color: "#8B5CF6" },
    { id: "5", name: "Laila Khaled", ticketCount: 4, color: "#EC4899" },
];

export const mockBlockWorkloadOverview: BlockWorkloadOverview[] = [
    { id: "1", name: "Main Campus", tickets: 15, agents: "4 agents", utilization: 75, status: "medium" },
    { id: "2", name: "Media Department", tickets: 12, agents: "2 agents", utilization: 90, status: "high" },
    { id: "3", name: "Career Services", tickets: 8, agents: "3 agents", utilization: 45, status: "low" },
    { id: "4", name: "General Helpdesk", tickets: 7, agents: "3 agents", utilization: 40, status: "low" },
];

export const mockAgentWorkloadIndicators: AgentWorkloadIndicator[] = [
    { id: "1", name: "Sarah Ahmed", ticketInfo: "4 tickets", percentage: 80, level: "medium" },
    { id: "2", name: "Mohamed Ali", ticketInfo: "3 tickets", percentage: 60, level: "medium" },
    { id: "3", name: "Youssef Omar", ticketInfo: "5 tickets", percentage: 100, level: "high" },
    { id: "4", name: "Nour Hasan", ticketInfo: "2 tickets", percentage: 40, level: "low" },
    { id: "5", name: "Laila Khaled", ticketInfo: "4 tickets", percentage: 80, level: "medium" },
];

export const mockDistributionData: DistributionData = {
    stats: mockDistributionStats,
    methodConfig: mockDistributionMethodConfig,
    ticketsPerBlock: mockTicketsPerBlock,
    ticketsPerAgent: mockTicketsPerAgent,
    blockWorkloadOverview: mockBlockWorkloadOverview,
    agentWorkloadIndicators: mockAgentWorkloadIndicators,
    hasHighWorkloadAlert: true,
};

export const getMockDistributionStats = (): DistributionStats => mockDistributionStats;
export const getMockDistributionMethodConfig = (): DistributionMethodConfig => mockDistributionMethodConfig;
export const getMockDistributionData = (): DistributionData => mockDistributionData;
