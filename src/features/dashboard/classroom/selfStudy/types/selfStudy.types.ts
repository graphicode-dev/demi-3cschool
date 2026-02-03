/**
 * Self Study Types
 */

// Term Status
export type TermStatus = "completed" | "current" | "locked";

// Session Status
export type SessionStatus = "completed" | "current" | "locked" | "PLANNED";

// Session Type
export type SessionType = "online" | "offline";

// Term
export interface Term {
    id: number;
    name: string;
    label?: string;
    order?: number;
    status: TermStatus;
}

// Online Session from API
export interface OnlineSession {
    id: number;
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
export interface PhysicalSession {
    id: number;
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

export interface MySession {
    virtualSessions: OnlineSession[];
    physicalSessions: PhysicalSession[];
}

// Course Session (legacy - kept for compatibility)
export interface CourseSession {
    id: number;
    courseId: number;
    title: string;
    description?: string;
    type: SessionType;
    order: number;
    status: SessionStatus;
    location?: string;
}

// Course (legacy - kept for compatibility)
export interface Course {
    id: number;
    termId: number;
    title: string;
    description?: string;
    onlineSessionsCount: number;
    offlineSessionsCount: number;
    sessions: CourseSession[];
}

// Self Study Content (legacy - kept for compatibility)
export interface SelfStudyContent {
    terms: Term[];
    currentTermId: number;
    course: Course;
}
