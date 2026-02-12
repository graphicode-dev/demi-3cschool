/**
 * Tickets Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 */

import { ListQueryParams } from "@/shared/api";
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
    list: (params: ListQueryParams, filter?: TicketFilters) => {
        const keyParts: (string | number)[] = [...ticketsKeys.lists()];

        // Always add page (default to 1 if undefined)
        keyParts.push("page", params.page || 1);

        // Add search if it exists
        if (params.search && params.search.trim()) {
            keyParts.push("search", params.search.trim());
        }

        // Add status filter if it's not "all"
        if (filter?.status && filter.status !== "all") {
            keyParts.push("filter_status_operator", "==");
            keyParts.push("filter_status_value", filter.status);
        }

        // Add agent filter if it's not "all"
        if (filter?.agentId && filter.agentId !== "all") {
            keyParts.push("filter_agentId_operator", "==");
            keyParts.push("filter_agentId_value", filter.agentId);
        }

        // Add block filter if it's not "all"
        if (filter?.blockId && filter.blockId !== "all") {
            keyParts.push("filter_blockId_operator", "==");
            keyParts.push("filter_blockId_value", filter.blockId);
        }

        // Add priority filter if it's not "all"
        if (filter?.priority && filter.priority !== "all") {
            keyParts.push("filter_priority_operator", "==");
            keyParts.push("filter_priority_value", filter.priority);
        }

        return keyParts;
    },

    /**
     * Key for unassigned tickets list
     */
    unassigned: (page?: number) =>
        [...ticketsKeys.all, "unassigned", page] as const,

    /**
     * Key for tickets stats
     */
    stats: () => [...ticketsKeys.all, "stats"] as const,

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

    /**
     * Key for ticket messages
     */
    messages: (ticketId: string | number) =>
        [...ticketsKeys.all, "messages", String(ticketId)] as const,

    /**
     * Key for ticket notes
     */
    notes: (ticketId: string | number) =>
        [...ticketsKeys.all, "notes", String(ticketId)] as const,
};

/**
 * Type for tickets query keys
 */
export type TicketsQueryKey =
    | typeof ticketsKeys.all
    | ReturnType<typeof ticketsKeys.lists>
    | ReturnType<typeof ticketsKeys.list>
    | ReturnType<typeof ticketsKeys.unassigned>
    | ReturnType<typeof ticketsKeys.stats>
    | ReturnType<typeof ticketsKeys.details>
    | ReturnType<typeof ticketsKeys.detail>
    | ReturnType<typeof ticketsKeys.filterOptions>
    | ReturnType<typeof ticketsKeys.messages>
    | ReturnType<typeof ticketsKeys.notes>;
