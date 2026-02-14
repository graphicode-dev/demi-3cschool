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

export interface ZoomMeeting {
    id: number;
    meetingId: string;
    meetingUrl: string;
    password: string;
}

export interface MyAllSession {
    id: number;
    sessionState: "current" | "completed" | "upcoming";
    sessionDate: string;
    startTime: string;
    endTime: string;
    locationType: "online" | "offline";
    effectiveLocationType: "online" | "offline";
    offlineLocation: string | null;
    status: string;
    reason: string | null;
    isManual: boolean;
    lesson: {
        id: number;
        title: string;
    };
    group: {
        id: number;
        name: string;
    };
    teacher: {
        id: number;
        name: string;
        teacherNote?: string | null;
    } | null;
    zoomMeeting: ZoomMeeting | null;
    hasZoomMeeting: boolean;
    createdAt: string;
    updatedAt: string;
}

export type MyCurrentSession = MyAllSession;
