/**
 * Support Help Feature - API Functions
 *
 * Raw API functions for student-facing support tickets.
 */

import { api } from "@/shared/api/client";
import type {
    SupportTicket,
    SupportTicketListItem,
    SupportTicketFilter,
    SupportMessage,
    CreateSupportTicketPayload,
    SendSupportMessagePayload,
} from "../types";
import {
    ApiResponse,
    ListQueryParams,
    PaginatedData,
    PaginatedResponse,
} from "@/shared/api";

const BASE_URL = "/tickets";

/**
 * Raw API response types
 */
interface RawSupportMessage {
    id: number;
    ticketId: number;
    userId: number;
    message: string;
    isFromAgent: boolean;
    readAt: string | null;
    createdAt: string;
    attachments: string[];
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface RawSupportTicket {
    id: number;
    ticketNumber: string;
    subject: string;
    description: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: string;
    category: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    supportBlock: {
        id: number;
        name: string;
    };
    assignedAgent: {
        id: number;
        name: string;
        email: string;
    } | null;
    messages?: RawSupportMessage[];
}

/**
 * Transform raw API message to UI-compatible SupportMessage
 * @param message - The raw message from API
 * @param ticketUserId - The userId of the ticket creator (student)
 */
function transformMessage(
    message: RawSupportMessage,
    ticketUserId?: number
): SupportMessage {
    // If ticketUserId is provided, compare with message userId
    // If message userId matches ticket userId, it's from the student
    // Otherwise, it's from support
    const isFromStudent = ticketUserId
        ? message.userId === ticketUserId
        : !message.isFromAgent;

    return {
        id: String(message.id),
        ticketId: String(message.ticketId),
        sender: isFromStudent ? "student" : "support",
        senderName: message.user.name,
        content: message.message,
        createdAt: message.createdAt,
    };
}

/**
 * Transform raw API ticket to UI-compatible SupportTicket
 */
function transformTicket(ticket: RawSupportTicket): SupportTicket {
    const ticketUserId = ticket.user.id;
    return {
        id: String(ticket.id),
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        category: ticket.category ?? undefined,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        messages:
            ticket.messages?.map((msg) =>
                transformMessage(msg, ticketUserId)
            ) ?? [],
        attachmentUrl: undefined,
    };
}

/**
 * Transform raw API ticket to list item
 */
function transformTicketListItem(
    ticket: RawSupportTicket
): SupportTicketListItem {
    return {
        id: String(ticket.id),
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.createdAt,
        messageCount: ticket.messages?.length ?? 0,
    };
}

/**
 * Paginated response type
 */
interface PaginatedSupportTicketData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: SupportTicketListItem[];
    total: number;
}

/**
 * Support Help API functions
 */
export const supportHelpApi = {
    /**
     * Get paginated tickets list for current user
     * GET /tickets?page=1
     */
    getList: async (
        params: ListQueryParams,
        filter?: SupportTicketFilter,
        signal?: AbortSignal
    ): Promise<PaginatedData<SupportTicketListItem>> => {
        const { page, search } = params;

        // Build query string parts manually to avoid encoding brackets
        const queryParts: string[] = [];

        // Only add page if it exists
        if (page) {
            queryParts.push(`page=${page}`);
        }

        // Only add search if it exists and is not empty
        if (search && search.trim()) {
            queryParts.push(`search=${encodeURIComponent(search.trim())}`);
        }

        // Add filter if it's not "all" - don't encode brackets
        if (filter && filter !== "all") {
            queryParts.push(`filter[status][operator]==`);
            queryParts.push(`filter[status][value]=${filter}`);
        }

        const url =
            queryParts.length > 0
                ? `${BASE_URL}?${queryParts.join("&")}`
                : BASE_URL;

        const response = await api.get<
            PaginatedResponse<SupportTicketListItem>
        >(url, {
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Get single ticket by ID
     * GET /tickets/:ticket
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<SupportTicket> => {
        const response = await api.get<ApiResponse<RawSupportTicket>>(
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
     * Create a new support ticket
     * POST /tickets
     */
    create: async (
        payload: CreateSupportTicketPayload
    ): Promise<SupportTicket> => {
        const response = await api.post<ApiResponse<RawSupportTicket>>(
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
     * Get messages for a ticket
     * GET /tickets/:ticket/messages
     */
    getMessages: async (
        ticketId: string | number,
        signal?: AbortSignal
    ): Promise<SupportMessage[]> => {
        const response = await api.get<ApiResponse<RawSupportMessage[]>>(
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
        payload: SendSupportMessagePayload
    ): Promise<SupportMessage> => {
        const response = await api.post<ApiResponse<RawSupportMessage>>(
            `${BASE_URL}/${payload.ticketId}/messages`,
            { message: payload.content }
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
};

export default supportHelpApi;
