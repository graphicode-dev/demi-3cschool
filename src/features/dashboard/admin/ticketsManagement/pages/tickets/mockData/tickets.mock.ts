/**
 * Tickets Mock Data
 *
 * Mock data for tickets feature.
 * TODO: Remove this file when using real API.
 */

import type {
    Ticket,
    TicketListItem,
    PaginatedTicketData,
    TicketFilters,
} from "../types";

// ============================================================================
// Mock Tickets List
// ============================================================================

export const mockTicketsList: TicketListItem[] = [
    {
        id: "1",
        ticketNumber: "TKT-1001",
        subject: "Cannot access course materials for React module",
        status: "open",
        priority: "high",
        requesterName: "Alex Thompson",
        requesterType: "student",
        assignedAgentName: "Sarah Chen",
        createdAt: "2025-01-20T09:30:00Z",
        messageCount: 3,
    },
    {
        id: "2",
        ticketNumber: "TKT-1001",
        subject: "Question about final project requirements",
        status: "in_progress",
        priority: "medium",
        requesterName: "Jordan Lee",
        requesterType: "student",
        assignedAgentName: "Mike Johnson",
        createdAt: "2025-01-19T14:20:00Z",
        messageCount: 5,
    },
    {
        id: "3",
        ticketNumber: "TKT-1001",
        subject: "Cannot access course materials for React module",
        status: "resolved",
        priority: "urgent",
        requesterName: "Alex Thompson",
        requesterType: "student",
        assignedAgentName: "Mike Johnson",
        createdAt: "2025-01-18T11:00:00Z",
        messageCount: 4,
    },
    {
        id: "4",
        ticketNumber: "TKT-1001",
        subject: "Student not submitting assignments on time",
        status: "in_progress",
        priority: "low",
        requesterName: "Prof. James Wilson",
        requesterType: "instructor",
        assignedAgentName: "Mike Johnson",
        createdAt: "2025-01-17T16:45:00Z",
        messageCount: 2,
    },
];

// ============================================================================
// Mock Full Ticket Details (for all tickets)
// ============================================================================

export const mockTicketDetails: Record<string, Ticket> = {
    "1": {
        id: "1",
        ticketNumber: "TKT-1001",
        subject: "Cannot access course materials for React module",
        status: "open",
        priority: "high",
        requester: {
            id: "u1",
            name: "Alex Thompson",
            email: "alex.t@student.com",
            type: "student",
            block: "Block 23 - Jan 2025",
        },
        assignedAgentId: "a1",
        assignedAgentName: "Sarah Chen",
        category: "Technical Issue",
        blockId: "b1",
        blockName: "Web Development Support",
        createdAt: "2025-01-20T09:30:00Z",
        updatedAt: "2025-01-22T08:15:00Z",
        messages: [
            {
                id: "m1",
                ticketId: "1",
                sender: "requester",
                senderName: "Alex Thompson",
                senderType: "student",
                content:
                    "Hi, I cannot access the React module materials. When I click on the link, it shows a 404 error. I need to complete the assignment by tomorrow.",
                createdAt: "2025-01-20T09:30:00Z",
            },
            {
                id: "m2",
                ticketId: "1",
                sender: "agent",
                senderName: "Sarah Chen",
                senderType: "agent",
                content:
                    "Hi Alex, thank you for reaching out. I'm looking into this issue now. Could you please tell me which browser you're using?",
                createdAt: "2025-01-20T10:15:00Z",
            },
            {
                id: "m3",
                ticketId: "1",
                sender: "requester",
                senderName: "Alex Thompson",
                senderType: "student",
                content:
                    "I'm using Chrome on Windows 11. I've also tried Firefox but same issue.",
                createdAt: "2025-01-20T11:30:00Z",
            },
        ],
        internalNotes: [
            {
                id: "n1",
                ticketId: "1",
                authorId: "a1",
                authorName: "Sarah Chen",
                content:
                    "Checked LMS logs - seems like a permission issue. Escalating to tech team.",
                createdAt: "2025-01-20T09:30:00Z",
            },
        ],
    },
    "2": {
        id: "2",
        ticketNumber: "TKT-1002",
        subject: "Question about final project requirements",
        status: "in_progress",
        priority: "medium",
        requester: {
            id: "u2",
            name: "Jordan Lee",
            email: "jordan.l@student.com",
            type: "student",
            block: "Block 22 - Dec 2024",
        },
        assignedAgentId: "a2",
        assignedAgentName: "Mike Johnson",
        category: "Academic Support",
        blockId: "b1",
        blockName: "Web Development Support",
        createdAt: "2025-01-19T14:20:00Z",
        updatedAt: "2025-01-21T16:00:00Z",
        messages: [
            {
                id: "m4",
                ticketId: "2",
                sender: "requester",
                senderName: "Jordan Lee",
                senderType: "student",
                content:
                    "Hi, I have a question about the final project requirements. The rubric mentions 'responsive design' but I'm not sure what exactly is expected.",
                createdAt: "2025-01-19T14:20:00Z",
            },
            {
                id: "m5",
                ticketId: "2",
                sender: "agent",
                senderName: "Mike Johnson",
                senderType: "agent",
                content:
                    "Hi Jordan! Great question. Responsive design means your project should work well on different screen sizes - desktop, tablet, and mobile.",
                createdAt: "2025-01-19T15:00:00Z",
            },
        ],
        internalNotes: [],
    },
    "3": {
        id: "3",
        ticketNumber: "TKT-1003",
        subject: "Cannot access course materials for React module",
        status: "resolved",
        priority: "urgent",
        requester: {
            id: "u1",
            name: "Alex Thompson",
            email: "alex.t@student.com",
            type: "student",
            block: "Block 23 - Jan 2025",
        },
        assignedAgentId: "a2",
        assignedAgentName: "Mike Johnson",
        category: "Technical Issue",
        blockId: "b2",
        blockName: "Data Science Support",
        createdAt: "2025-01-18T11:00:00Z",
        updatedAt: "2025-01-19T09:00:00Z",
        messages: [
            {
                id: "m6",
                ticketId: "3",
                sender: "requester",
                senderName: "Alex Thompson",
                senderType: "student",
                content:
                    "The Python notebook won't load. It keeps showing a kernel error.",
                createdAt: "2025-01-18T11:00:00Z",
            },
            {
                id: "m7",
                ticketId: "3",
                sender: "agent",
                senderName: "Mike Johnson",
                senderType: "agent",
                content:
                    "I've reset your Jupyter environment. Please try again and let me know if it works.",
                createdAt: "2025-01-18T12:30:00Z",
            },
            {
                id: "m8",
                ticketId: "3",
                sender: "requester",
                senderName: "Alex Thompson",
                senderType: "student",
                content: "It works now! Thank you so much!",
                createdAt: "2025-01-18T13:00:00Z",
            },
            {
                id: "m9",
                ticketId: "3",
                sender: "agent",
                senderName: "Mike Johnson",
                senderType: "agent",
                content:
                    "Great! I'm marking this as resolved. Feel free to open a new ticket if you have any other issues.",
                createdAt: "2025-01-18T13:15:00Z",
            },
        ],
        internalNotes: [
            {
                id: "n2",
                ticketId: "3",
                authorId: "a2",
                authorName: "Mike Johnson",
                content:
                    "Kernel issue was due to memory overflow. Reset fixed it.",
                createdAt: "2025-01-18T12:25:00Z",
            },
        ],
    },
    "4": {
        id: "4",
        ticketNumber: "TKT-1004",
        subject: "Student not submitting assignments on time",
        status: "in_progress",
        priority: "low",
        requester: {
            id: "u3",
            name: "Prof. James Wilson",
            email: "james.w@instructor.com",
            type: "instructor",
            block: "Faculty",
        },
        assignedAgentId: "a2",
        assignedAgentName: "Mike Johnson",
        category: "Academic Support",
        blockId: "b4",
        blockName: "General Inquiries",
        createdAt: "2025-01-17T16:45:00Z",
        updatedAt: "2025-01-20T10:00:00Z",
        messages: [
            {
                id: "m10",
                ticketId: "4",
                sender: "requester",
                senderName: "Prof. James Wilson",
                senderType: "instructor",
                content:
                    "I have a student who consistently misses deadlines. Can you help me understand the late submission policy?",
                createdAt: "2025-01-17T16:45:00Z",
            },
            {
                id: "m11",
                ticketId: "4",
                sender: "agent",
                senderName: "Mike Johnson",
                senderType: "agent",
                content:
                    "Hi Professor Wilson, I'll look into this and get back to you with the policy details and options available.",
                createdAt: "2025-01-17T17:30:00Z",
            },
        ],
        internalNotes: [],
    },
};

// Keep backward compatibility
export const mockTicketDetail: Ticket = mockTicketDetails["1"];

// ============================================================================
// Mock Agents for filter
// ============================================================================

export const mockAgents = [
    { id: "a1", name: "Sarah Chen" },
    { id: "a2", name: "Mike Johnson" },
    { id: "a3", name: "Emily Davis" },
];

// ============================================================================
// Mock Blocks for filter
// ============================================================================

export const mockBlocks = [
    { id: "b1", name: "Web Development Support" },
    { id: "b2", name: "Data Science Support" },
    { id: "b3", name: "Mobile Development Support" },
    { id: "b4", name: "General Inquiries" },
];

// ============================================================================
// Mock Data Getters
// ============================================================================

/**
 * Get paginated mock tickets list
 */
export const getMockTicketsList = (
    filters?: TicketFilters,
    page: number = 1,
    perPage: number = 10
): PaginatedTicketData => {
    let filtered = [...mockTicketsList];

    if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
            (t) =>
                t.subject.toLowerCase().includes(search) ||
                t.requesterName.toLowerCase().includes(search) ||
                t.ticketNumber.toLowerCase().includes(search)
        );
    }

    if (filters?.status && filters.status !== "all") {
        filtered = filtered.filter((t) => t.status === filters.status);
    }

    if (filters?.priority && filters.priority !== "all") {
        filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);
    const lastPage = Math.ceil(filtered.length / perPage);

    return {
        perPage,
        currentPage: page,
        lastPage,
        nextPageUrl: page < lastPage ? `/api/tickets?page=${page + 1}` : null,
        total: filtered.length,
        items: paginatedItems,
    };
};

/**
 * Get single mock ticket by ID
 */
export const getMockTicket = (id: string): Ticket | undefined => {
    return mockTicketDetails[id];
};

/**
 * Add a message to a ticket (mock mutation)
 */
export const addMockMessage = (
    ticketId: string,
    content: string,
    senderName: string = "Sarah Chen"
): Ticket | undefined => {
    const ticket = mockTicketDetails[ticketId];
    if (!ticket) return undefined;

    const newMessage = {
        id: `m${Date.now()}`,
        ticketId,
        sender: "agent" as const,
        senderName,
        senderType: "agent" as const,
        content,
        createdAt: new Date().toISOString(),
    };

    ticket.messages.push(newMessage);
    ticket.updatedAt = new Date().toISOString();

    return ticket;
};

/**
 * Add an internal note to a ticket (mock mutation)
 */
export const addMockNote = (
    ticketId: string,
    content: string,
    authorName: string = "Sarah Chen"
): Ticket | undefined => {
    const ticket = mockTicketDetails[ticketId];
    if (!ticket) return undefined;

    const newNote = {
        id: `n${Date.now()}`,
        ticketId,
        authorId: "a1",
        authorName,
        content,
        createdAt: new Date().toISOString(),
    };

    ticket.internalNotes.push(newNote);
    ticket.updatedAt = new Date().toISOString();

    return ticket;
};

/**
 * Update ticket details (mock mutation)
 */
export const updateMockTicket = (
    ticketId: string,
    updates: { status?: string; priority?: string; assignedAgentId?: string }
): Ticket | undefined => {
    const ticket = mockTicketDetails[ticketId];
    if (!ticket) return undefined;

    if (updates.status) {
        ticket.status = updates.status as Ticket["status"];
    }
    if (updates.priority) {
        ticket.priority = updates.priority as Ticket["priority"];
    }
    if (updates.assignedAgentId) {
        ticket.assignedAgentId = updates.assignedAgentId;
        const agent = mockAgents.find((a) => a.id === updates.assignedAgentId);
        if (agent) {
            ticket.assignedAgentName = agent.name;
        }
    }
    ticket.updatedAt = new Date().toISOString();

    return ticket;
};

/**
 * Get mock agents
 */
export const getMockAgents = () => mockAgents;

/**
 * Get mock blocks
 */
export const getMockFilterBlocks = () => mockBlocks;
