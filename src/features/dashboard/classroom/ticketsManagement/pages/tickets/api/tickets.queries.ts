/**
 * Tickets Feature - Query Hooks
 *
 * TanStack Query hooks for reading tickets data.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 */

import {
    useQuery,
    keepPreviousData,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { ticketsKeys } from "./tickets.keys";
import {
    getMockTicketsList,
    getMockTicket,
    getMockAgents,
    getMockFilterBlocks,
} from "../mockData";
import type { Ticket, TicketFilters, PaginatedTicketData } from "../types";

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
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => ticketsApi.getList(filters, page, signal),
        queryFn: () => Promise.resolve(getMockTicketsList(filters, page)),
        placeholderData: keepPreviousData,
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
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Ticket | undefined, Error>>
) {
    return useQuery({
        queryKey: ticketsKeys.detail(id ?? ""),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => ticketsApi.getById(id!, signal),
        queryFn: () => Promise.resolve(getMockTicket(id!)),
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
                agents: getMockAgents(),
                blocks: getMockFilterBlocks(),
            }),
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options,
    });
}
