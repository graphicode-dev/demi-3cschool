export type SessionType = "online" | "offline";
export type SessionStatus = "scheduled" | "cancelled";

export type MyAllSessionState = "completed" | "current" | "locked";

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

export interface MyAllSession {
    id: number;
    sessionState: MyAllSessionState | string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    locationType: SessionType;
    effectiveLocationType: SessionType;
    offlineLocation: string | null;
    status: string;
    reason: string | null;
    isManual: boolean;
    recordingsCount?: Record<string, unknown> | null;
    lesson: {
        id: number;
        title: string;
    };
    group: {
        id: number;
        name: string;
    } | null;
    teacher: {
        id: number;
        name: string;
        teacherNote: string | null;
    } | null;
    bbbMeetingId: string | null;
    bbbIsRunning: boolean;
    bbbRecord: boolean;
    bbbStartedAt: string | null;
    bbbEndedAt: string | null;
    hasMeeting: boolean;
    createdAt: string;
    updatedAt: string;
}

export type MyCurrentSession = MyAllSession;
