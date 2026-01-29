export type SessionType = "online" | "offline";
export type SessionStatus = "scheduled" | "cancelled";

export interface ScheduleSession {
    id: number;
    title: string;
    type: SessionType;
    status: SessionStatus;
    date: string; // ISO date string
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
}

export interface WeekDay {
    date: number;
    dayName: string;
    fullDate: string;
    isToday: boolean;
}
