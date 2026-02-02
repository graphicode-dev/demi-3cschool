/**
 * Slots Feature - Main Export
 */

// Types
export type { TimeSlot, DaySlots, SessionType } from "./types";

// API
export { slotsApi, slotsKeys, useGroupedSlots } from "./api";

// Components
export { SlotsView, DayCard } from "./components";

// Pages
export { SlotsPage } from "./pages";

// Navigation
export { slotsPaths, slotsRoutes } from "./navigation";
