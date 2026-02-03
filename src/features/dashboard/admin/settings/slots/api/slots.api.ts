/**
 * Slots Feature - API Functions
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { DaySlots, SessionType, TimeSlot } from "../types";

interface ApiSlot {
    id: number;
    type: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

const SLOTS_BASE_URL = "/system-managements/time-slots";

export const slotsApi = {
    /**
     * Get grouped time slots by session type
     */
    getGrouped: async (
        type: SessionType,
        signal?: AbortSignal
    ): Promise<DaySlots[]> => {
        const response = await api.get<ApiResponse<Record<string, ApiSlot[]>>>(
            `${SLOTS_BASE_URL}/grouped`,
            {
                params: { type },
                signal,
            }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        // Transform object to array format and map field names
        const data = response.data.data;
        return Object.entries(data).map(([day, slots]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            dayAbbr: day.substring(0, 2).toUpperCase(),
            slots: slots.map(
                (slot): TimeSlot => ({
                    id: slot.id,
                    from: slot.startTime,
                    to: slot.endTime,
                })
            ),
        }));
    },
};
