/**
 * Self Study Types
 */

// Term Status
export type TermStatus = "completed" | "current" | "locked";

// Session Status
export type SessionStatus = "completed" | "current" | "locked";

// Session Type
export type SessionType = "online" | "offline";

// Term
export interface Term {
    id: number;
    name: string;
    order: number;
    status: TermStatus;
}

// Course Session
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

// Course
export interface Course {
    id: number;
    termId: number;
    title: string;
    description?: string;
    onlineSessionsCount: number;
    offlineSessionsCount: number;
    sessions: CourseSession[];
}

// Self Study Content
export interface SelfStudyContent {
    terms: Term[];
    currentTermId: number;
    course: Course;
}
