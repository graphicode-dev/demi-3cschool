/**
 * Tickets Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for tickets operations.
 * TODO: Remove mock data imports and use real API when backend is ready.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsKeys } from "./tickets.keys";
// import { ticketsApi } from "./tickets.api";
import { addMockMessage, addMockNote, updateMockTicket } from "../mockData";
import type { ApiError } from "@/shared/api";
import type {
    SendMessagePayload,
    AddNotePayload,
    UpdateTicketPayload,
    TicketMessage,
    InternalNote,
    Ticket,
} from "../types";

// ============================================================================
// Send Message Mutation
// ============================================================================

/**
 * Hook to send a message to a ticket
 */
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation<TicketMessage, ApiError, SendMessagePayload>({
        // TODO: Uncomment when using real API
        // mutationFn: ticketsApi.sendMessage,
        mutationFn: async (payload) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            const ticket = addMockMessage(payload.ticketId, payload.content);
            if (!ticket) throw new Error("Ticket not found");
            return ticket.messages[ticket.messages.length - 1];
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(variables.ticketId),
            });
        },
    });
}

// ============================================================================
// Add Note Mutation
// ============================================================================

/**
 * Hook to add an internal note to a ticket
 */
export function useAddNote() {
    const queryClient = useQueryClient();

    return useMutation<InternalNote, ApiError, AddNotePayload>({
        // TODO: Uncomment when using real API
        // mutationFn: ticketsApi.addNote,
        mutationFn: async (payload) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            const ticket = addMockNote(payload.ticketId, payload.content);
            if (!ticket) throw new Error("Ticket not found");
            return ticket.internalNotes[ticket.internalNotes.length - 1];
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(variables.ticketId),
            });
        },
    });
}

// ============================================================================
// Update Ticket Mutation
// ============================================================================

/**
 * Hook to update a ticket
 */
export function useUpdateTicket() {
    const queryClient = useQueryClient();

    return useMutation<
        Ticket,
        ApiError,
        { id: string; payload: UpdateTicketPayload }
    >({
        // TODO: Uncomment when using real API
        // mutationFn: ({ id, payload }) => ticketsApi.update(id, payload),
        mutationFn: async ({ id, payload }) => {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            const ticket = updateMockTicket(id, payload);
            if (!ticket) throw new Error("Ticket not found");
            return ticket;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
        },
    });
}
