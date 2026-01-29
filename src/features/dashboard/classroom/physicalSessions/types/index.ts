import type { Term, TermStatus } from "../../components";

export type { Term, TermStatus };

export type PhysicalSessionStatus =
    | "completed"
    | "upcoming"
    | "next"
    | "locked";

export interface SessionGroup {
    id: number;
    name: string;
    locationType: "offline" | "online";
    location: string;
    locationMapUrl: string;
}

export interface SessionCourse {
    id: number;
    title: string;
}

export interface SessionTerm {
    id: number;
    name: string;
}

export interface SessionLesson {
    id: number;
    title: string;
}

export interface ContentProgressItem {
    lessonContentId: number;
    title: string;
    contentType: "video" | "material";
    progressPercentage: number;
    isCompleted: boolean;
    lastPosition: number;
    watchTime: number;
}

export interface ContentProgress {
    total: {
        totalContents: number;
        completedContents: number;
        totalProgressPercentage: number;
    };
    items: ContentProgressItem[];
}

export interface PhysicalSession {
    id: number;
    group: SessionGroup;
    course: SessionCourse;
    term: SessionTerm;
    sessionDate: string;
    startTime: string;
    endTime: string;
    topic: string;
    lesson: SessionLesson;
    isCancelled: boolean;
    cancellationReason: string | null;
    meetingProvider: string;
    meetingId: string;
    linkMeeting: string;
    contentProgress: ContentProgress;
    createdAt: string;
    updatedAt: string;
    // Computed for UI
    status?: PhysicalSessionStatus;
    order?: number;
}

export interface PhysicalSessionsResponse {
    success: boolean;
    message: string;
    data: PhysicalSession[];
}

export interface PhysicalSessionsData {
    terms: Term[];
    sessions: PhysicalSession[];
    currentTermId: number;
    isSummerTerm?: boolean;
    summerProgress?: {
        completed: number;
        total: number;
    };
}
