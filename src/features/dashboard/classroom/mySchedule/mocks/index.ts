import type { ScheduleSession } from "../types";

export const MOCK_SCHEDULE_SESSIONS: ScheduleSession[] = [
    {
        id: 1,
        title: "Python Basics",
        type: "online",
        status: "scheduled",
        date: "2026-10-14",
        startTime: "09:00",
        endTime: "10:00",
        dayOfWeek: 0, // Sunday
    },
    {
        id: 2,
        title: "Python Basics",
        type: "offline",
        status: "scheduled",
        date: "2026-10-15",
        startTime: "10:00",
        endTime: "11:00",
        dayOfWeek: 1, // Monday
    },
    {
        id: 3,
        title: "Python Basics",
        type: "online",
        status: "cancelled",
        date: "2026-10-16",
        startTime: "12:00",
        endTime: "13:00",
        dayOfWeek: 2, // Tuesday
    },
];

export const USE_MOCK_DATA = true;
