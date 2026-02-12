/**
 * Tickets Feature - Query Hooks
 *
 * TanStack Query hooks for reading tickets data.
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { ticketsKeys } from "./tickets.keys";
import { ticketsApi } from "./tickets.api";
import type {
    TicketListItem,
    TicketFilters,
    PaginatedTicketData,
    TicketsStats,
    TicketMessage,
    InternalNote,
} from "../types";
import { ListQueryParams, PaginatedData } from "@/shared/api";

// ============================================================================
// Tickets List Query
// ============================================================================

/**
 * Hook to fetch paginated tickets list
 */
export function useTicketsList(
    params: ListQueryParams,
    filter?: TicketFilters,
    options?: Partial<
        UseQueryOptions<PaginatedData<TicketListItem>, Error>
    >
) {
    return useQuery({
        queryKey: ticketsKeys.list(params, filter),
        queryFn: ({ signal }) => ticketsApi.getList(params, filter, signal),
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

/**
 * Hook to fetch unassigned tickets list
 */
export function useUnassignedTickets(
    page?: number,
    options?: Partial<UseQueryOptions<PaginatedTicketData, Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.unassigned(page),
        queryFn: ({ signal }) => ticketsApi.getUnassigned(page, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

/**
 * Hook to fetch tickets stats
 */
export function useTicketsStats(
    options?: Partial<UseQueryOptions<TicketsStats, Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.stats(),
        queryFn: ({ signal }) => ticketsApi.getStats(signal),
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Single Ticket Query
// ============================================================================

/**
 * Hook to fetch single ticket by ID
 */
export function useTicket(
    id: string | number | undefined | null,
    options?: Partial<UseQueryOptions<TicketListItem | undefined, Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.detail(String(id ?? "")),
        queryFn: ({ signal }) => ticketsApi.getById(id!, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 2, // 2 minutes
        ...options,
    });
}

// ============================================================================
// Filter Options Query
// ============================================================================

/**
 * Hook to fetch filter options (agents and blocks)
 * TODO: Update when dedicated filter options API is available
 */
export function useFilterOptions(
    options?: Partial<
        UseQueryOptions<
            {
                agents: { id: string; name: string }[];
                blocks: { id: string; name: string }[];
            },
            Error
        >
    >
) {
    return useQuery({
        queryKey: ticketsKeys.filterOptions(),
        queryFn: () =>
            Promise.resolve({
                agents: [],
                blocks: [],
            }),
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options,
    });
}

// ============================================================================
// Messages Query
// ============================================================================

/**
 * Hook to fetch messages for a ticket
 */
export function useTicketMessages(
    ticketId: string | number | undefined | null,
    options?: Partial<UseQueryOptions<TicketMessage[], Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.messages(ticketId ?? ""),
        queryFn: ({ signal }) => ticketsApi.getMessages(ticketId!, signal),
        enabled: !!ticketId,
        staleTime: 1000 * 30, // 30 seconds - messages should refresh frequently
        ...options,
    });
}

// ============================================================================
// Notes Query
// ============================================================================

/**
 * Hook to fetch notes for a ticket
 */
export function useTicketNotes(
    ticketId: string | number | undefined | null,
    options?: Partial<UseQueryOptions<InternalNote[], Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.notes(ticketId ?? ""),
        queryFn: ({ signal }) => ticketsApi.getNotes(ticketId!, signal),
        enabled: !!ticketId,
        staleTime: 1000 * 60, // 1 minute
        ...options,
    });
}
