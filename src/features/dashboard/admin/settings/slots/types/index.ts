/**
 * Slots Feature Types
 */

export interface TimeSlot {
    id: number;
    from: string;
    to: string;
}

export interface DaySlots {
    day: string;
    dayAbbr: string;
    slots: TimeSlot[];
}

export interface GroupedTimeSlotsResponse {
    data: DaySlots[];
}

export type SessionType = "online" | "offline";
