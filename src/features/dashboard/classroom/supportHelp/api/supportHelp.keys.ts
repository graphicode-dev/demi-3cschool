/**
 * Support Help Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 */

import { ListQueryParams } from "@/shared/api";
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
    list: (params: ListQueryParams, filter?: SupportTicketFilter) => {
        const keyParts: (string | number)[] = [...supportHelpKeys.lists()];

        // Add filter if it's not "all" using new structured format
        if (filter && filter !== "all") {
            keyParts.push("filter_status_operator", "==");
            keyParts.push("filter_status_value", filter);
        }

        // Always add page (default to 1 if undefined)
        keyParts.push("page", params.page || 1);

        // Add search if it exists
        if (params.search && params.search.trim()) {
            keyParts.push("search", params.search.trim());
        }

        return keyParts;
    },

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
