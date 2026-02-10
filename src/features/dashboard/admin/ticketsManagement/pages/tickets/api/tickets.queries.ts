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
} from "../types";

// ============================================================================
// Tickets List Query
// ============================================================================

/**
 * Hook to fetch paginated tickets list
 */
export function useTicketsList(
    filters?: TicketFilters,
    page?: number,
    options?: Partial<UseQueryOptions<PaginatedTicketData, Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.list(filters),
        queryFn: ({ signal }) => ticketsApi.getList(filters, page, signal),
        placeholderData: keepPreviousData,
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
