/**
 * Slots Feature - API Functions
 */

import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type { DaySlots, SessionType } from "../types";

const SLOTS_BASE_URL = "/system-managements/time-slots";

export const slotsApi = {
    /**
     * Get grouped time slots by session type
     */
    getGrouped: async (
        type: SessionType,
        signal?: AbortSignal
    ): Promise<DaySlots[]> => {
        const response = await api.get<ApiResponse<DaySlots[]>>(
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

        return response.data.data;
    },
};
