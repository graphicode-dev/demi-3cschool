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
import { ApiResponse } from "@/shared/api";

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
        filters?: TicketFilters,
        page?: number,
        signal?: AbortSignal
    ): Promise<PaginatedTicketData> => {
        const response = await api.get<
            ApiResponse<{
                perPage: number;
                currentPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: RawTicket[];
            }>
        >(BASE_URL, {
            params: { ...filters, page } as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformPaginatedData(response.data.data);
    },

    /**
     * Get unassigned tickets list
     * GET /tickets/unassigned?page=1
     */
    getUnassigned: async (
        page?: number,
        signal?: AbortSignal
    ): Promise<PaginatedTicketData> => {
        const response = await api.get<
            ApiResponse<{
                perPage: number;
                currentPage: number;
                lastPage: number;
                nextPageUrl: string | null;
                items: RawTicket[];
            }>
        >(`${BASE_URL}/unassigned`, {
            params: { page } as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformPaginatedData(response.data.data);
    },

    /**
     * Get tickets stats
     * GET /tickets/stats
     */
    getStats: async (signal?: AbortSignal): Promise<TicketsStats> => {
        const response = await api.get<ApiResponse<TicketsStats>>(
            `${BASE_URL}/stats`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get single ticket by ID
     * GET /tickets/:ticket
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<Ticket> => {
        const response = await api.get<ApiResponse<RawTicket>>(
            `${BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformTicket(response.data.data);
    },

    /**
     * Create a new ticket
     * POST /tickets
     */
    create: async (payload: CreateTicketPayload): Promise<Ticket> => {
        const response = await api.post<ApiResponse<RawTicket>>(
            BASE_URL,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformTicket(response.data.data);
    },

    /**
     * Update a ticket
     * PUT /tickets/:ticket
     */
    update: async (
        id: string | number,
        payload: UpdateTicketPayload
    ): Promise<Ticket> => {
        const response = await api.put<ApiResponse<RawTicket>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformTicket(response.data.data);
    },

    /**
     * Delete a ticket
     * DELETE /tickets/:ticket
     */
    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Assign ticket to agent
     * POST /tickets/:ticket/assign
     */
    assign: async (
        id: string | number,
        payload: AssignTicketPayload
    ): Promise<Ticket> => {
        const response = await api.post<ApiResponse<RawTicket>>(
            `${BASE_URL}/${id}/assign`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformTicket(response.data.data);
    },

    /**
     * Update ticket status
     * PATCH /tickets/:ticket/status
     */
    updateStatus: async (
        id: string | number,
        payload: UpdateTicketStatusPayload
    ): Promise<Ticket> => {
        const response = await api.patch<ApiResponse<RawTicket>>(
            `${BASE_URL}/${id}/status`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformTicket(response.data.data);
    },

    /**
     * Update ticket priority
     * PATCH /tickets/:ticket/priority
     */
    updatePriority: async (
        id: string | number,
        payload: UpdateTicketPriorityPayload
    ): Promise<Ticket> => {
        const response = await api.patch<ApiResponse<RawTicket>>(
            `${BASE_URL}/${id}/priority`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformTicket(response.data.data);
    },

    /**
     * Get messages for a ticket
     * GET /tickets/:ticket/messages
     */
    getMessages: async (
        ticketId: string | number,
        signal?: AbortSignal
    ): Promise<TicketMessage[]> => {
        const response = await api.get<ApiResponse<RawTicketMessage[]>>(
            `${BASE_URL}/${ticketId}/messages`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data.map(transformMessage);
    },

    /**
     * Send a message to a ticket
     * POST /tickets/:ticket/messages
     */
    sendMessage: async (
        payload: SendMessagePayload
    ): Promise<TicketMessage> => {
        const response = await api.post<ApiResponse<RawTicketMessage>>(
            `${BASE_URL}/${payload.ticketId}/messages`,
            { message: payload.message }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformMessage(response.data.data);
    },

    /**
     * Mark messages as read
     * POST /tickets/:ticket/messages/read
     */
    markMessagesRead: async (ticketId: string | number): Promise<void> => {
        const response = await api.post<ApiResponse<void>>(
            `${BASE_URL}/${ticketId}/messages/read`
        );

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Get notes for a ticket
     * GET /tickets/:ticket/notes
     */
    getNotes: async (
        ticketId: string | number,
        signal?: AbortSignal
    ): Promise<InternalNote[]> => {
        const response = await api.get<ApiResponse<RawInternalNote[]>>(
            `${BASE_URL}/${ticketId}/notes`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data.map(transformNote);
    },

    /**
     * Add an internal note to a ticket
     * POST /tickets/:ticket/notes
     */
    addNote: async (payload: AddNotePayload): Promise<InternalNote> => {
        const response = await api.post<ApiResponse<RawInternalNote>>(
            `${BASE_URL}/${payload.ticketId}/notes`,
            { note: payload.note }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return transformNote(response.data.data);
    },

    /**
     * Delete an internal note
     * DELETE /tickets/:ticket/notes/:noteId
     */
    deleteNote: async (payload: DeleteNotePayload): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${payload.ticketId}/notes/${payload.noteId}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};

export default ticketsApi;
