/**
 * Tickets Feature - API Functions
 *
 * Raw API functions for tickets domain.
 */

import { api } from "@/shared/api/client";
import type {
    Ticket,
    TicketFilters,
    PaginatedTicketData,
    SendMessagePayload,
    AddNotePayload,
    UpdateTicketPayload,
    TicketMessage,
    InternalNote,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/tickets";

/**
 * Tickets API functions
 */
export const ticketsApi = {
    /**
     * Get paginated tickets list
     */
    getList: async (
        filters?: TicketFilters,
        page?: number,
        signal?: AbortSignal
    ): Promise<PaginatedTicketData> => {
        const response = await api.get<ApiResponse<PaginatedTicketData>>(
            BASE_URL,
            {
                params: { ...filters, page } as Record<string, unknown>,
                signal,
            }
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
     */
    getById: async (id: string, signal?: AbortSignal): Promise<Ticket> => {
        const response = await api.get<ApiResponse<Ticket>>(
            `${BASE_URL}/${id}`,
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
     * Send a message to a ticket
     */
    sendMessage: async (
        payload: SendMessagePayload
    ): Promise<TicketMessage> => {
        const response = await api.post<ApiResponse<TicketMessage>>(
            `${BASE_URL}/${payload.ticketId}/messages`,
            { content: payload.content }
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
     * Add an internal note to a ticket
     */
    addNote: async (payload: AddNotePayload): Promise<InternalNote> => {
        const response = await api.post<ApiResponse<InternalNote>>(
            `${BASE_URL}/${payload.ticketId}/notes`,
            { content: payload.content }
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
     * Update a ticket
     */
    update: async (
        id: string,
        payload: UpdateTicketPayload
    ): Promise<Ticket> => {
        const response = await api.patch<ApiResponse<Ticket>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },
};

export default ticketsApi;
