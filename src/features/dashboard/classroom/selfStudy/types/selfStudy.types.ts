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


export interface MySession {
    id: number;
    sessionState: SessionStatus;
    sessionDate: string;
    startTime: string;
    endTime: string;
    locationType: SessionType;
    effectiveLocationType: SessionType;
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
