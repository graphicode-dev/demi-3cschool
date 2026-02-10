/**
 * Tickets Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for tickets operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketsKeys } from "./tickets.keys";
import { ticketsApi } from "./tickets.api";
import type { ApiError } from "@/shared/api";
import type {
    CreateTicketPayload,
    UpdateTicketPayload,
    AssignTicketPayload,
    UpdateTicketStatusPayload,
    UpdateTicketPriorityPayload,
    SendMessagePayload,
    AddNotePayload,
    TicketMessage,
    InternalNote,
    Ticket,
} from "../types";

// ============================================================================
// Create Ticket Mutation
// ============================================================================

/**
 * Hook to create a new ticket
 */
export function useCreateTicket() {
    const queryClient = useQueryClient();

    return useMutation<Ticket, ApiError, CreateTicketPayload>({
        mutationFn: ticketsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.stats(),
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
        { id: string | number; payload: UpdateTicketPayload }
    >({
        mutationFn: ({ id, payload }) => ticketsApi.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(String(variables.id)),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Delete Ticket Mutation
// ============================================================================

/**
 * Hook to delete a ticket
 */
export function useDeleteTicket() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string | number>({
        mutationFn: ticketsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.stats(),
            });
        },
    });
}

// ============================================================================
// Assign Ticket Mutation
// ============================================================================

/**
 * Hook to assign a ticket to an agent
 */
export function useAssignTicket() {
    const queryClient = useQueryClient();

    return useMutation<
        Ticket,
        ApiError,
        { id: string | number; payload: AssignTicketPayload }
    >({
        mutationFn: ({ id, payload }) => ticketsApi.assign(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(String(variables.id)),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.unassigned(),
            });
        },
    });
}

// ============================================================================
// Update Ticket Status Mutation
// ============================================================================

/**
 * Hook to update ticket status
 */
export function useUpdateTicketStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        Ticket,
        ApiError,
        { id: string | number; payload: UpdateTicketStatusPayload }
    >({
        mutationFn: ({ id, payload }) => ticketsApi.updateStatus(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(String(variables.id)),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.stats(),
            });
        },
    });
}

// ============================================================================
// Update Ticket Priority Mutation
// ============================================================================

/**
 * Hook to update ticket priority
 */
export function useUpdateTicketPriority() {
    const queryClient = useQueryClient();

    return useMutation<
        Ticket,
        ApiError,
        { id: string | number; payload: UpdateTicketPriorityPayload }
    >({
        mutationFn: ({ id, payload }) => ticketsApi.updatePriority(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(String(variables.id)),
            });
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Send Message Mutation
// ============================================================================

/**
 * Hook to send a message to a ticket
 * TODO: Update when messages API is provided
 */
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation<TicketMessage, ApiError, SendMessagePayload>({
        mutationFn: ticketsApi.sendMessage,
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
 * TODO: Update when notes API is provided
 */
export function useAddNote() {
    const queryClient = useQueryClient();

    return useMutation<InternalNote, ApiError, AddNotePayload>({
        mutationFn: ticketsApi.addNote,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ticketsKeys.detail(variables.ticketId),
            });
        },
    });
}
