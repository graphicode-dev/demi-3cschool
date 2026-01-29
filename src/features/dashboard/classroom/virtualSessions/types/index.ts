import type { Term, TermStatus } from "../../components";

export type { Term, TermStatus };

export type VirtualSessionStatus = "live" | "upcoming" | "completed";

export interface SessionInstructor {
    id: number;
    name: string;
    avatar?: string;
    course: string;
}

export interface SessionGroup {
    id: number;
    name: string;
    locationType: "online" | "offline";
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

export interface VirtualSession {
    id: number;
    group: SessionGroup;
    course: SessionCourse;
    term: SessionTerm;
    sessionDate: string;
    startTime: string;
    endTime: string;
    topic: string;
    lesson: SessionLesson;
    description?: string;
    isCancelled: boolean;
    cancellationReason: string | null;
    meetingProvider: string;
    meetingId: string;
    linkMeeting: string;
    recordingUrl?: string;
    contentProgress: ContentProgress;
    instructor: SessionInstructor;
    duration?: number;
    timezone?: string;
    createdAt: string;
    updatedAt: string;
    // Computed for UI
    status?: VirtualSessionStatus;
}

export interface VirtualSessionsResponse {
    success: boolean;
    message: string;
    data: VirtualSession[];
}

export interface VirtualSessionsData {
    terms: Term[];
    sessions: VirtualSession[];
    currentTermId: number;
}
