import type {
    Ticket,
    TicketListItem,
    TicketsStats,
    TicketMessage,
    InternalNote,
    CreateTicketPayload,
    UpdateTicketPayload,
    AssignTicketPayload,
    UpdateTicketStatusPayload,
    UpdateTicketPriorityPayload,
    SendMessagePayload,
    AddNotePayload,
    TicketFilters,
} from "../types";
import type { ListQueryParams, PaginatedData } from "@/shared/api";

export const mockTicketsStats: TicketsStats = {
    totalOpen: 3,
    byStatus: {
        open: 3,
        inProgress: 2,
        resolved: 4,
        closed: 1,
    },
};

export const mockTicketMessages: Record<string, TicketMessage[]> = {
    "101": [
        {
            id: "m1",
            ticketId: "101",
            senderId: 10,
            sender: "requester",
            senderName: "Ali Kamel",
            senderType: "student",
            content: "Hi, I cannot access the portal. It says user not found.",
            createdAt: "2026-07-18T10:00:00Z",
            isRead: true,
            attachments: [],
        },
        {
            id: "m2",
            ticketId: "101",
            senderId: 1,
            sender: "agent",
            senderName: "Sarah Ahmed",
            senderType: "agent",
            content: "Hello Ali, did you try resetting your password using your student email?",
            createdAt: "2026-07-18T10:15:00Z",
            isRead: true,
            attachments: [],
        },
        {
            id: "m3",
            ticketId: "101",
            senderId: 10,
            sender: "requester",
            senderName: "Ali Kamel",
            senderType: "student",
            content: "Yes, I did. But I didn't receive any recovery link.",
            createdAt: "2026-07-18T10:20:00Z",
            isRead: false,
            attachments: [],
        },
    ],
    "102": [
        {
            id: "m4",
            ticketId: "102",
            senderId: 11,
            sender: "requester",
            senderName: "Fatma Nour",
            senderType: "student",
            content: "Hello, my camera is not turning on during the exam. Please help.",
            createdAt: "2026-07-19T09:00:00Z",
            isRead: true,
            attachments: [],
        },
    ],
    "103": [
        {
            id: "m5",
            ticketId: "103",
            senderId: 12,
            sender: "requester",
            senderName: "Sherif Amr",
            senderType: "student",
            content: "I paid the invoice for the course but the system still shows unpaid.",
            createdAt: "2026-07-17T11:00:00Z",
            isRead: true,
            attachments: [],
        },
    ],
};

export const mockTicketNotes: Record<string, InternalNote[]> = {
    "101": [
        {
            id: "n1",
            ticketId: "101",
            authorId: "1",
            authorName: "Sarah Ahmed",
            content: "Need to verify if this student account is activated in the LMS DB.",
            createdAt: "2026-07-18T10:16:00Z",
        },
    ],
};

export const mockTickets: Ticket[] = [
    {
        id: "101",
        ticketNumber: "TCK-101",
        subject: "Portal Login Access Error",
        description: "Hi, I cannot access the portal. It says user not found.",
        status: "open",
        priority: "high",
        category: "access",
        userId: 10,
        supportBlockId: 1,
        assignedAgentId: 1,
        resolvedAt: null,
        createdAt: "2026-07-18T10:00:00Z",
        updatedAt: "2026-07-18T10:20:00Z",
        requesterName: "Ali Kamel",
        requesterType: "student",
        assignedAgentName: "Sarah Ahmed",
        messageCount: 3,
        requester: {
            id: "10",
            name: "Ali Kamel",
            email: "ali.kamel@example.com",
            type: "student",
            block: "Main Campus",
        },
        messages: mockTicketMessages["101"],
        internalNotes: mockTicketNotes["101"] || [],
        user: { id: 10, name: "Ali Kamel", email: "ali.kamel@example.com" },
        supportBlock: { id: 1, name: "Main Campus", slug: "main-campus" },
        assignedAgent: { id: 1, userId: 101, name: "Sarah Ahmed", email: "sarah@example.com" },
    },
    {
        id: "102",
        ticketNumber: "TCK-102",
        subject: "Camera Issue During Exam",
        description: "Hello, my camera is not turning on during the exam. Please help.",
        status: "in_progress",
        priority: "urgent",
        category: "technical",
        userId: 11,
        supportBlockId: 2,
        assignedAgentId: 2,
        resolvedAt: null,
        createdAt: "2026-07-19T09:00:00Z",
        updatedAt: "2026-07-19T09:10:00Z",
        requesterName: "Fatma Nour",
        requesterType: "student",
        assignedAgentName: "Mohamed Ali",
        messageCount: 1,
        requester: {
            id: "11",
            name: "Fatma Nour",
            email: "fatma.nour@example.com",
            type: "student",
            block: "Media Department",
        },
        messages: mockTicketMessages["102"],
        internalNotes: mockTicketNotes["102"] || [],
        user: { id: 11, name: "Fatma Nour", email: "fatma.nour@example.com" },
        supportBlock: { id: 2, name: "Media Department", slug: "media-department" },
        assignedAgent: { id: 2, userId: 102, name: "Mohamed Ali", email: "mohamed@example.com" },
    },
    {
        id: "103",
        ticketNumber: "TCK-103",
        subject: "Invoice Payment Status Discrepancy",
        description: "I paid the invoice for the course but the system still shows unpaid.",
        status: "resolved",
        priority: "medium",
        category: "billing",
        userId: 12,
        supportBlockId: 3,
        assignedAgentId: null,
        resolvedAt: "2026-07-19T15:00:00Z",
        createdAt: "2026-07-17T11:00:00Z",
        updatedAt: "2026-07-19T15:00:00Z",
        requesterName: "Sherif Amr",
        requesterType: "student",
        assignedAgentName: undefined,
        messageCount: 1,
        requester: {
            id: "12",
            name: "Sherif Amr",
            email: "sherif.amr@example.com",
            type: "student",
            block: "Career Services",
        },
        messages: mockTicketMessages["103"],
        internalNotes: mockTicketNotes["103"] || [],
        user: { id: 12, name: "Sherif Amr", email: "sherif.amr@example.com" },
        supportBlock: { id: 3, name: "Career Services", slug: "career-services" },
        assignedAgent: null,
    },
    {
        id: "104",
        ticketNumber: "TCK-104",
        subject: "Certificate Issue",
        description: "I completed the full stack course but my certificate was not generated.",
        status: "open",
        priority: "low",
        category: "certificate",
        userId: 13,
        supportBlockId: 4,
        assignedAgentId: null,
        resolvedAt: null,
        createdAt: "2026-07-20T08:00:00Z",
        updatedAt: "2026-07-20T08:00:00Z",
        requesterName: "Nouran Ezzat",
        requesterType: "student",
        assignedAgentName: undefined,
        messageCount: 0,
        requester: {
            id: "13",
            name: "Nouran Ezzat",
            email: "nouran@example.com",
            type: "student",
            block: "General Helpdesk",
        },
        messages: [],
        internalNotes: [],
        user: { id: 13, name: "Nouran Ezzat", email: "nouran@example.com" },
        supportBlock: { id: 4, name: "General Helpdesk", slug: "general-helpdesk" },
        assignedAgent: null,
    },
];

// Mutatable internal states for mock execution
let mutableTickets = [...mockTickets];
let mutableMessages = { ...mockTicketMessages };
let mutableNotes = { ...mockTicketNotes };
let mutableStats = { ...mockTicketsStats };

export const resetTicketsMocks = () => {
    mutableTickets = [...mockTickets];
    mutableMessages = { ...mockTicketMessages };
    mutableNotes = { ...mockTicketNotes };
    mutableStats = { ...mockTicketsStats };
};

export const getMockTicketsList = (
    params: ListQueryParams,
    filter?: TicketFilters
): PaginatedData<TicketListItem> => {
    let filtered = [...mutableTickets];

    if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
            (t) =>
                t.subject.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.ticketNumber.toLowerCase().includes(query)
        );
    }

    if (filter?.status && filter.status !== "all") {
        filtered = filtered.filter((t) => t.status === filter.status);
    }

    if (filter?.agentId && filter.agentId !== "all") {
        filtered = filtered.filter((t) => String(t.assignedAgentId) === String(filter.agentId));
    }

    if (filter?.blockId && filter.blockId !== "all") {
        filtered = filtered.filter((t) => String(t.supportBlockId) === String(filter.blockId));
    }

    if (filter?.priority && filter.priority !== "all") {
        filtered = filtered.filter((t) => t.priority === filter.priority);
    }

    const perPage = params.perPage ? Number(params.perPage) : 10;
    const page = params.page ? Number(params.page) : 1;
    const startIndex = (page - 1) * perPage;
    const paginated = filtered.slice(startIndex, startIndex + perPage);

    return {
        perPage,
        currentPage: page,
        lastPage: Math.ceil(filtered.length / perPage) || 1,
        nextPageUrl: page * perPage < filtered.length ? `?page=${page + 1}` : null,
        items: paginated,
    };
};

export const getMockUnassignedTickets = (page: number = 1) => {
    const filtered = mutableTickets.filter((t) => t.assignedAgentId === null);
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const paginated = filtered.slice(startIndex, startIndex + perPage);

    return {
        perPage,
        currentPage: page,
        lastPage: Math.ceil(filtered.length / perPage) || 1,
        nextPageUrl: page * perPage < filtered.length ? `?page=${page + 1}` : null,
        items: paginated,
        total: filtered.length,
    };
};

export const getMockTicketsStats = (): TicketsStats => {
    const openCount = mutableTickets.filter((t) => t.status === "open").length;
    const inProgressCount = mutableTickets.filter((t) => t.status === "in_progress").length;
    const resolvedCount = mutableTickets.filter((t) => t.status === "resolved").length;
    const closedCount = mutableTickets.filter((t) => t.status === "closed").length;

    return {
        totalOpen: openCount + inProgressCount,
        byStatus: {
            open: openCount,
            inProgress: inProgressCount,
            resolved: resolvedCount,
            closed: closedCount,
        },
    };
};

export const getMockTicketById = (id: string | number): Ticket => {
    const ticket = mutableTickets.find((t) => String(t.id) === String(id));
    if (!ticket) throw new Error(`Ticket with ID ${id} not found`);
    return {
        ...ticket,
        messages: mutableMessages[String(id)] || [],
        internalNotes: mutableNotes[String(id)] || [],
    };
};

export const createMockTicket = (payload: CreateTicketPayload): Ticket => {
    const newId = String(mutableTickets.length + 101);
    const newTicket: Ticket = {
        id: newId,
        ticketNumber: `TCK-${newId}`,
        subject: payload.subject,
        description: payload.description,
        status: "open",
        priority: payload.priority as any,
        category: payload.category as any,
        userId: 99, // default mock current user id
        supportBlockId: Number(payload.support_block_id),
        assignedAgentId: null,
        resolvedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requesterName: "Test Requester",
        requesterType: "student",
        messageCount: 0,
        requester: {
            id: "99",
            name: "Test Requester",
            email: "test.requester@example.com",
            type: "student",
            block: `Block ${payload.support_block_id}`,
        },
        messages: [],
        internalNotes: [],
        user: { id: 99, name: "Test Requester", email: "test.requester@example.com" },
        supportBlock: { id: Number(payload.support_block_id), name: `Block ${payload.support_block_id}`, slug: "block-slug" },
        assignedAgent: null,
    };

    mutableTickets.unshift(newTicket);
    return newTicket;
};

export const updateMockTicket = (id: string | number, payload: UpdateTicketPayload): Ticket => {
    const idx = mutableTickets.findIndex((t) => String(t.id) === String(id));
    if (idx === -1) throw new Error(`Ticket with ID ${id} not found`);

    const original = mutableTickets[idx];
    const updated: Ticket = {
        ...original,
        ...payload,
        supportBlockId: payload.support_block_id ? Number(payload.support_block_id) : original.supportBlockId,
        priority: (payload.priority as any) || original.priority,
        category: (payload.category as any) || original.category,
        updatedAt: new Date().toISOString(),
    };

    mutableTickets[idx] = updated;
    return updated;
};

export const deleteMockTicket = (id: string | number): void => {
    mutableTickets = mutableTickets.filter((t) => String(t.id) !== String(id));
};

export const assignMockTicket = (id: string | number, payload: AssignTicketPayload): Ticket => {
    const idx = mutableTickets.findIndex((t) => String(t.id) === String(id));
    if (idx === -1) throw new Error(`Ticket with ID ${id} not found`);

    const original = mutableTickets[idx];
    const agentsList = [
        { id: 1, userId: 101, name: "Sarah Ahmed", email: "sarah@example.com" },
        { id: 2, userId: 102, name: "Mohamed Ali", email: "mohamed@example.com" },
        { id: 3, userId: 103, name: "Youssef Omar", email: "youssef@example.com" },
    ];
    const assigned = agentsList.find((a) => a.id === payload.agentId) || null;

    const updated: Ticket = {
        ...original,
        assignedAgentId: payload.agentId,
        assignedAgentName: assigned?.name,
        assignedAgent: assigned,
        updatedAt: new Date().toISOString(),
    };

    mutableTickets[idx] = updated;
    return updated;
};

export const updateMockTicketStatus = (id: string | number, payload: UpdateTicketStatusPayload): Ticket => {
    const idx = mutableTickets.findIndex((t) => String(t.id) === String(id));
    if (idx === -1) throw new Error(`Ticket with ID ${id} not found`);

    const original = mutableTickets[idx];
    const updated: Ticket = {
        ...original,
        status: payload.status,
        resolvedAt: payload.status === "resolved" ? new Date().toISOString() : original.resolvedAt,
        updatedAt: new Date().toISOString(),
    };

    mutableTickets[idx] = updated;
    return updated;
};

export const updateMockTicketPriority = (id: string | number, payload: UpdateTicketPriorityPayload): Ticket => {
    const idx = mutableTickets.findIndex((t) => String(t.id) === String(id));
    if (idx === -1) throw new Error(`Ticket with ID ${id} not found`);

    const original = mutableTickets[idx];
    const updated: Ticket = {
        ...original,
        priority: payload.priority,
        updatedAt: new Date().toISOString(),
    };

    mutableTickets[idx] = updated;
    return updated;
};

export const getMockMessages = (ticketId: string | number): TicketMessage[] => {
    return mutableMessages[String(ticketId)] || [];
};

export const sendMockMessage = (payload: SendMessagePayload): TicketMessage => {
    const tid = String(payload.ticketId);
    const newMsg: TicketMessage = {
        id: `m-${Date.now()}`,
        ticketId: tid,
        senderId: 1, // Assume agent sender for dashboard
        sender: "agent",
        senderName: "Sarah Ahmed",
        senderType: "agent",
        content: payload.message,
        createdAt: new Date().toISOString(),
        isRead: true,
        attachments: [],
    };

    if (!mutableMessages[tid]) {
        mutableMessages[tid] = [];
    }
    mutableMessages[tid].push(newMsg);

    // Update message count in ticket list
    const idx = mutableTickets.findIndex((t) => String(t.id) === tid);
    if (idx !== -1) {
        mutableTickets[idx].messageCount += 1;
    }

    return newMsg;
};

export const getMockNotes = (ticketId: string | number): InternalNote[] => {
    return mutableNotes[String(ticketId)] || [];
};

export const addMockNote = (payload: AddNotePayload): InternalNote => {
    const tid = String(payload.ticketId);
    const newNote: InternalNote = {
        id: `n-${Date.now()}`,
        ticketId: tid,
        authorId: "1",
        authorName: "Sarah Ahmed",
        content: payload.note,
        createdAt: new Date().toISOString(),
    };

    if (!mutableNotes[tid]) {
        mutableNotes[tid] = [];
    }
    mutableNotes[tid].push(newNote);

    return newNote;
};

export const deleteMockNote = (ticketId: string | number, noteId: string | number): void => {
    const tid = String(ticketId);
    if (mutableNotes[tid]) {
        mutableNotes[tid] = mutableNotes[tid].filter((n) => String(n.id) !== String(noteId));
    }
};
