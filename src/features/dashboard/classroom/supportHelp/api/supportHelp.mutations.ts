/**
 * Support Help Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for support help operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supportHelpKeys } from "./supportHelp.keys";
import { supportHelpApi } from "./supportHelp.api";
import type { ApiError } from "@/shared/api";
import type {
    CreateSupportTicketPayload,
    SendSupportMessagePayload,
    SupportTicket,
    SupportMessage,
} from "../types";

// ============================================================================
// Create Ticket Mutation
// ============================================================================

/**
 * Hook to create a new support ticket
 */
export function useCreateSupportTicket() {
    const queryClient = useQueryClient();

    return useMutation<SupportTicket, ApiError, CreateSupportTicketPayload>({
        mutationFn: supportHelpApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: supportHelpKeys.lists(),
            });
        },
    });
}

// ============================================================================
// Send Message Mutation
// ============================================================================

/**
 * Hook to send a message to a support ticket
 */
export function useSendSupportMessage() {
    const queryClient = useQueryClient();

    return useMutation<SupportMessage, ApiError, SendSupportMessagePayload>({
        mutationFn: supportHelpApi.sendMessage,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: supportHelpKeys.messages(variables.ticketId),
            });
            queryClient.invalidateQueries({
                queryKey: supportHelpKeys.detail(String(variables.ticketId)),
            });
        },
    });
}

// ============================================================================
// Mark Messages Read Mutation
// ============================================================================

/**
 * Hook to mark messages as read
 */
export function useMarkSupportMessagesRead() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string | number>({
        mutationFn: supportHelpApi.markMessagesRead,
        onSuccess: (_, ticketId) => {
            queryClient.invalidateQueries({
                queryKey: supportHelpKeys.messages(ticketId),
            });
        },
    });
}
