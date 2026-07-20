/**
 * Tickets Feature - API Functions
 *
 * Raw API functions for tickets domain.
 */

import { api } from "@/shared/api/client";
import type {
    RawTicket,
    Ticket,
    TicketListItem,
    TicketFilters,
    PaginatedTicketData,
    TicketsStats,
    CreateTicketPayload,
    UpdateTicketPayload,
    AssignTicketPayload,
    UpdateTicketStatusPayload,
    UpdateTicketPriorityPayload,
    SendMessagePayload,
    AddNotePayload,
    DeleteNotePayload,
    RawTicketMessage,
    TicketMessage,
    RawInternalNote,
    InternalNote,
} from "../types";
import {
    ApiResponse,
    ListQueryParams,
    PaginatedData,
    PaginatedResponse,
} from "@/shared/api";
import {
    getMockTicketsList,
    getMockUnassignedTickets,
    getMockTicketsStats,
    getMockTicketById,
    createMockTicket,
    updateMockTicket,
    deleteMockTicket,
    assignMockTicket,
    updateMockTicketStatus,
    updateMockTicketPriority,
    getMockMessages,
    sendMockMessage,
    getMockNotes,
    addMockNote,
    deleteMockNote,
} from "../mockData";

const BASE_URL = "/tickets";

/**
 * Transform raw API message to UI-compatible TicketMessage
 */
function transformMessage(message: RawTicketMessage): TicketMessage {
    return {
        id: String(message.id),
        ticketId: String(message.ticketId),
        senderId: message.userId,
        sender: message.isFromAgent ? "agent" : "requester",
        senderName: message.user.name,
        senderType: message.isFromAgent ? "agent" : "student",
        content: message.message,
        createdAt: message.createdAt,
        isRead: message.readAt !== null,
        attachments: message.attachments,
    };
}

/**
 * Transform raw API note to UI-compatible InternalNote
 */
function transformNote(note: RawInternalNote): InternalNote {
    return {
        id: String(note.id),
        ticketId: String(note.ticketId),
        authorId: String(note.userId),
        authorName: note.user.name,
        content: note.note,
        createdAt: note.createdAt,
    };
}

/**
 * Transform raw API ticket to UI-compatible Ticket
 */
function transformTicket(ticket: RawTicket): Ticket {
    return {
        ...ticket,
        id: String(ticket.id), // Convert to string for UI compatibility
        requesterName: ticket.user.name,
        requesterType: "student", // Default, can be enhanced later
        requesterAvatar: undefined,
        assignedAgentName: ticket.assignedAgent?.name,
        messageCount: 0, // Will be populated when messages API is available
        requester: {
            id: String(ticket.user.id),
            name: ticket.user.name,
            email: ticket.user.email,
            type: "student", // Default, can be enhanced later
            block: ticket.supportBlock.name,
        },
        messages: [],
        internalNotes: [],
    };
}

/**
 * Transform paginated response
 */
function transformPaginatedData(data: {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: RawTicket[];
}): PaginatedTicketData {
    return {
        perPage: data.perPage,
        currentPage: data.currentPage,
        lastPage: data.lastPage,
        nextPageUrl: data.nextPageUrl,
        items: data.items.map(transformTicket),
        total: data.lastPage * data.perPage, // Computed for UI compatibility
    };
}

/**
 * Tickets API functions
 */
export const ticketsApi = {
    /**
     * Get paginated tickets list
     * GET /tickets?page=1
     */
    getList: async (
        params: ListQueryParams,
        filter?: TicketFilters,
        signal?: AbortSignal
    ): Promise<PaginatedData<TicketListItem>> => {
        return getMockTicketsList(params, filter);
    },

    /**
     * Get unassigned tickets list
     * GET /tickets/unassigned?page=1
     */
    getUnassigned: async (
        page?: number,
        signal?: AbortSignal
    ): Promise<PaginatedTicketData> => {
        return getMockUnassignedTickets(page);
    },

    /**
     * Get tickets stats
     * GET /tickets/stats
     */
    getStats: async (signal?: AbortSignal): Promise<TicketsStats> => {
        return getMockTicketsStats();
    },

    /**
     * Get single ticket by ID
     * GET /tickets/:ticket
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<Ticket> => {
        return getMockTicketById(id);
    },

    /**
     * Create a new ticket
     * POST /tickets
     */
    create: async (payload: CreateTicketPayload): Promise<Ticket> => {
        return createMockTicket(payload);
    },

    /**
     * Update a ticket
     * PUT /tickets/:ticket
     */
    update: async (
        id: string | number,
        payload: UpdateTicketPayload
    ): Promise<Ticket> => {
        return updateMockTicket(id, payload);
    },

    /**
     * Delete a ticket
     * DELETE /tickets/:ticket
     */
    delete: async (id: string | number): Promise<void> => {
        return deleteMockTicket(id);
    },

    /**
     * Assign ticket to agent
     * POST /tickets/:ticket/assign
     */
    assign: async (
        id: string | number,
        payload: AssignTicketPayload
    ): Promise<Ticket> => {
        return assignMockTicket(id, payload);
    },

    /**
     * Update ticket status
     * PATCH /tickets/:ticket/status
     */
    updateStatus: async (
        id: string | number,
        payload: UpdateTicketStatusPayload
    ): Promise<Ticket> => {
        return updateMockTicketStatus(id, payload);
    },

    /**
     * Update ticket priority
     * PATCH /tickets/:ticket/priority
     */
    updatePriority: async (
        id: string | number,
        payload: UpdateTicketPriorityPayload
    ): Promise<Ticket> => {
        return updateMockTicketPriority(id, payload);
    },

    /**
     * Get messages for a ticket
     * GET /tickets/:ticket/messages
     */
    getMessages: async (
        ticketId: string | number,
        signal?: AbortSignal
    ): Promise<TicketMessage[]> => {
        return getMockMessages(ticketId);
    },

    /**
     * Send a message to a ticket
     * POST /tickets/:ticket/messages
     */
    sendMessage: async (
        payload: SendMessagePayload
    ): Promise<TicketMessage> => {
        return sendMockMessage(payload);
    },

    /**
     * Mark messages as read
     * POST /tickets/:ticket/messages/read
     */
    markMessagesRead: async (ticketId: string | number): Promise<void> => {
        return Promise.resolve();
    },

    /**
     * Get notes for a ticket
     * GET /tickets/:ticket/notes
     */
    getNotes: async (
        ticketId: string | number,
        signal?: AbortSignal
    ): Promise<InternalNote[]> => {
        return getMockNotes(ticketId);
    },

    /**
     * Add an internal note to a ticket
     * POST /tickets/:ticket/notes
     */
    addNote: async (payload: AddNotePayload): Promise<InternalNote> => {
        return addMockNote(payload);
    },

    /**
     * Delete an internal note
     * DELETE /tickets/:ticket/notes/:noteId
     */
    deleteNote: async (payload: DeleteNotePayload): Promise<void> => {
        return deleteMockNote(payload.ticketId, payload.noteId);
    },
};

export default ticketsApi;
