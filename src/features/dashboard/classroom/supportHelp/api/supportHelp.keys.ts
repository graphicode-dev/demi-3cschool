/**
 * Support Help Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 */

import type { SupportTicketFilter } from "../types";

/**
 * Query key factory for support help tickets
 */
export const supportHelpKeys = {
    /**
     * Root key for all support help queries
     */
    all: ["supportHelp"] as const,

    /**
     * Key for tickets list
     */
    lists: () => [...supportHelpKeys.all, "list"] as const,

    /**
     * Key for filtered tickets list
     */
    list: (filter?: SupportTicketFilter) =>
        filter
            ? ([...supportHelpKeys.lists(), filter] as const)
            : supportHelpKeys.lists(),

    /**
     * Key for all ticket details
     */
    details: () => [...supportHelpKeys.all, "detail"] as const,

    /**
     * Key for specific ticket detail
     */
    detail: (id: string) => [...supportHelpKeys.details(), id] as const,

    /**
     * Key for ticket messages
     */
    messages: (ticketId: string | number) =>
        [...supportHelpKeys.all, "messages", String(ticketId)] as const,
};

/**
 * Type for support help query keys
 */
export type SupportHelpQueryKey =
    | typeof supportHelpKeys.all
    | ReturnType<typeof supportHelpKeys.lists>
    | ReturnType<typeof supportHelpKeys.list>
    | ReturnType<typeof supportHelpKeys.details>
    | ReturnType<typeof supportHelpKeys.detail>
    | ReturnType<typeof supportHelpKeys.messages>;
