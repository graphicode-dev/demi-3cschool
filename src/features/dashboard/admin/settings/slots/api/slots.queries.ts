/**
 * Slots Feature - Query Hooks
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { slotsKeys } from "./slots.keys";
import { GroupScheduleSlot, GroupScheduleSlotsParams, slotsApi } from "./slots.api";
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


export function useGroupScheduleSlots(
    params: GroupScheduleSlotsParams | null,
    options?: Partial<UseQueryOptions<GroupScheduleSlot[], Error>>
) {
    return useQuery({
        queryKey: params ? slotsKeys.list(params) : slotsKeys.all,
        queryFn: ({ signal }) => slotsApi.getByDay(params!, signal),
        enabled: !!params,
        ...options,
    });
}
