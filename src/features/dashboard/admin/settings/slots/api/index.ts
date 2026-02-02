/**
 * Slots Feature - API Module
 */

// Types
export type { TimeSlot, DaySlots, SessionType } from "../types";

// Query Keys
export { slotsKeys, type SlotsQueryKey } from "./slots.keys";

// API Functions
export { slotsApi } from "./slots.api";

// Query Hooks
export { useGroupedSlots } from "./slots.queries";
