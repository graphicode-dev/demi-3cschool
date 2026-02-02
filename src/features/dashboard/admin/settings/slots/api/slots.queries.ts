/**
 * Slots Feature - Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { slotsKeys } from "./slots.keys";
import { slotsApi } from "./slots.api";
import type { SessionType, DaySlots } from "../types";

/**
 * Hook to fetch grouped time slots by session type
 */
export function useGroupedSlots(type: SessionType) {
    return useQuery<DaySlots[], Error>({
        queryKey: slotsKeys.grouped(type),
        queryFn: ({ signal }) => slotsApi.getGrouped(type, signal),
    });
}
