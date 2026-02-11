/**
 * Support Help Feature - Query Hooks
 *
 * TanStack Query hooks for reading support help data.
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { supportHelpKeys } from "./supportHelp.keys";
import { supportHelpApi } from "./supportHelp.api";
import type {
    SupportTicket,
    SupportTicketListItem,
    SupportTicketFilter,
    SupportMessage,
} from "../types";

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

// ============================================================================
// Tickets List Query
// ============================================================================

/**
 * Hook to fetch paginated support tickets list
 */
export function useSupportTicketsList(
    filter?: SupportTicketFilter,
    page?: number,
    options?: Partial<UseQueryOptions<PaginatedSupportTicketData, Error>>
) {
    return useQuery({
        queryKey: supportHelpKeys.list(filter),
        queryFn: ({ signal }) => supportHelpApi.getList(filter, page, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Single Ticket Query
// ============================================================================

/**
 * Hook to fetch single support ticket by ID
 */
export function useSupportTicket(
    id: string | number | undefined | null,
    options?: Partial<UseQueryOptions<SupportTicket, Error>>
) {
    return useQuery({
        queryKey: supportHelpKeys.detail(String(id ?? "")),
        queryFn: ({ signal }) => supportHelpApi.getById(id!, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Messages Query
// ============================================================================

/**
 * Hook to fetch messages for a support ticket
 */
export function useSupportTicketMessages(
    ticketId: string | number | undefined | null,
    options?: Partial<UseQueryOptions<SupportMessage[], Error>>
) {
    return useQuery({
        queryKey: supportHelpKeys.messages(ticketId ?? ""),
        queryFn: ({ signal }) => supportHelpApi.getMessages(ticketId!, signal),
        enabled: !!ticketId,
        staleTime: 1000 * 30, // 30 seconds - messages should refresh frequently
        ...options,
    });
}
