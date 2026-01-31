/**
 * Team Structure Mock Data
 *
 * Mock data for team structure feature.
 * TODO: Remove this file when using real API.
 */

import type {
    Agent,
    Block,
    Lead,
    TeamStats,
    TeamStructureData,
    User,
} from "../types";

// ============================================================================
// Mock Stats
// ============================================================================

export const mockTeamStats: TeamStats = {
    totalBlocks: 5,
    blockLeads: 5,
    totalAgents: 20,
};

// ============================================================================
// Mock Blocks
// ============================================================================

export const mockBlocks: Block[] = [
    {
        id: "1",
        name: "Web Development Support",
        leadName: "Sarah Ahmed",
        totalAgents: 4,
        availableAgents: 2,
        totalTickets: 26,
        agents: [
            {
                id: "1-1",
                name: "Sarah Ahmed",
                role: "lead",
                status: "available",
                activeTickets: 8,
            },
            {
                id: "1-2",
                name: "Sarah Ahmed",
                role: "agent",
                status: "busy",
                activeTickets: 8,
            },
            {
                id: "1-3",
                name: "Sarah Ahmed",
                role: "agent",
                status: "available",
                activeTickets: 7,
            },
            {
                id: "1-4",
                name: "Sarah Ahmed",
                role: "agent",
                status: "available",
                activeTickets: 7,
            },
        ],
    },
    {
        id: "2",
        name: "Data Science Support",
        leadName: "Ahmed Ali",
        totalAgents: 4,
        availableAgents: 2,
        totalTickets: 20,
        agents: [
            {
                id: "2-1",
                name: "Ahmed Ali",
                role: "lead",
                status: "available",
                activeTickets: 8,
            },
            {
                id: "2-2",
                name: "Sarah Ahmed",
                role: "agent",
                status: "busy",
                activeTickets: 9,
            },
            {
                id: "2-3",
                name: "Sarah Ahmed",
                role: "agent",
                status: "available",
                activeTickets: 7,
            },
            {
                id: "2-4",
                name: "Sarah Ahmed",
                role: "agent",
                status: "available",
                activeTickets: 7,
            },
        ],
    },
    {
        id: "3",
        name: "Mobile Development Support",
        leadName: "Ahmed Ali",
        totalAgents: 4,
        availableAgents: 2,
        totalTickets: 26,
        agents: [],
    },
    {
        id: "4",
        name: "General Inquiries",
        leadName: "Ahmed Ali",
        totalAgents: 4,
        availableAgents: 2,
        totalTickets: 20,
        agents: [],
    },
];

// ============================================================================
// Mock Data Getters
// ============================================================================

/**
 * Get mock team stats
 */
export const getMockTeamStats = (): TeamStats => mockTeamStats;

/**
 * Get mock blocks
 */
export const getMockBlocks = (): Block[] => mockBlocks;

/**
 * Get complete mock team structure data
 */
export const getMockTeamStructureData = (): TeamStructureData => ({
    stats: mockTeamStats,
    blocks: mockBlocks,
});

/**
 * Get single mock block by ID
 */
export const getMockBlock = (id: string): Block | undefined => {
    return mockBlocks.find((block) => block.id === id);
};

// ============================================================================
// Mock Leads
// ============================================================================

export const mockLeads: Lead[] = [
    {
        id: "lead-1",
        name: "Reham Mostafa",
        email: "reham@example.com",
        role: "lead",
        status: "available",
        activeTickets: 8,
        assignedBlock: "Web Development",
        assignedBlockId: "1",
        agentsCount: 4,
    },
    {
        id: "lead-2",
        name: "Ahmed Ali",
        email: "ahmed@example.com",
        role: "lead",
        status: "busy",
        activeTickets: 12,
        assignedBlock: "Python Basics",
        assignedBlockId: "2",
        agentsCount: 3,
    },
    {
        id: "lead-3",
        name: "Gehan Ashrsf",
        email: "gehan@example.com",
        role: "lead",
        status: "available",
        activeTickets: 5,
        assignedBlock: "Mobile Apps",
        assignedBlockId: "3",
        agentsCount: 2,
    },
];

// ============================================================================
// Mock Team Agents (for table)
// ============================================================================

export const mockTeamAgents: Agent[] = [
    {
        id: "agent-1",
        name: "Emma Johnson",
        email: "emma@example.com",
        role: "agent",
        status: "available",
        activeTickets: 5,
        blockId: "1",
        blockName: "Web Development",
        managedBy: "Reham Mostafa",
    },
    {
        id: "agent-2",
        name: "Emma Johnson",
        email: "emma2@example.com",
        role: "agent",
        status: "available",
        activeTickets: 3,
        blockId: "1",
        blockName: "Web Development",
        managedBy: "sarah ahmed",
    },
    {
        id: "agent-3",
        name: "Emma Johnson",
        email: "emma3@example.com",
        role: "agent",
        status: "busy",
        activeTickets: 7,
        blockId: "2",
        blockName: "Python Basics",
        managedBy: "ali ashraf",
    },
];

// ============================================================================
// Mock Users (for search/selection)
// ============================================================================

export const mockUsers: User[] = [
    {
        id: "user-1",
        name: "Sarah Ahmed",
        email: "sarah@example.com",
    },
    {
        id: "user-2",
        name: "Mohamed Hassan",
        email: "mohamed@example.com",
    },
    {
        id: "user-3",
        name: "Fatima Ali",
        email: "fatima@example.com",
    },
    {
        id: "user-4",
        name: "Omar Khaled",
        email: "omar@example.com",
    },
];

// ============================================================================
// Mock Data Getters for Manage Team
// ============================================================================

/**
 * Get mock leads
 */
export const getMockLeads = (): Lead[] => mockLeads;

/**
 * Get mock team agents
 */
export const getMockTeamAgents = (): Agent[] => mockTeamAgents;

/**
 * Get mock users for search
 */
export const getMockUsers = (): User[] => mockUsers;

/**
 * Get single mock lead by ID
 */
export const getMockLead = (id: string): Lead | undefined => {
    return mockLeads.find((lead) => lead.id === id);
};

/**
 * Get single mock agent by ID
 */
export const getMockAgent = (id: string): Agent | undefined => {
    return mockTeamAgents.find((agent) => agent.id === id);
};
