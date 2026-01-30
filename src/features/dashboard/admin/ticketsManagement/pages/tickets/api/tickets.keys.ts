/**
 * Tickets Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 */

import type { TicketFilters } from "../types";

/**
 * Query key factory for tickets
 */
export const ticketsKeys = {
    /**
     * Root key for all tickets queries
     */
    all: ["tickets"] as const,

    /**
     * Key for tickets list
     */
    lists: () => [...ticketsKeys.all, "list"] as const,

    /**
     * Key for filtered tickets list
     */
    list: (filters?: TicketFilters) =>
        filters
            ? ([...ticketsKeys.lists(), filters] as const)
            : ticketsKeys.lists(),

    /**
     * Key for all ticket details
     */
    details: () => [...ticketsKeys.all, "detail"] as const,

    /**
     * Key for specific ticket detail
     */
    detail: (id: string) => [...ticketsKeys.details(), id] as const,

    /**
     * Key for filter options (agents, blocks)
     */
    filterOptions: () => [...ticketsKeys.all, "filter-options"] as const,
};

/**
 * Type for tickets query keys
 */
export type TicketsQueryKey =
    | typeof ticketsKeys.all
    | ReturnType<typeof ticketsKeys.lists>
    | ReturnType<typeof ticketsKeys.list>
    | ReturnType<typeof ticketsKeys.details>
    | ReturnType<typeof ticketsKeys.detail>
    | ReturnType<typeof ticketsKeys.filterOptions>;
