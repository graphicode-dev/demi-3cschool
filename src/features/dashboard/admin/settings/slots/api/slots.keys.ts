/**
 * Slots Feature - Query Keys
 */

import type { SessionType } from "../types";

export const slotsKeys = {
    all: ["slots"] as const,
    grouped: (type: SessionType) => [...slotsKeys.all, "grouped", type] as const,
    list: (params: { day: string; type: "online" | "offline" }) =>
        [...slotsKeys.all, params] as const,
};

export type SlotsQueryKey = ReturnType<typeof slotsKeys.grouped>;
