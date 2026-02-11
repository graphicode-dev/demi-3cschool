import type { Term, TermStatus } from "../../components";

export type { Term, TermStatus };

export type VirtualSessionStatus = "current" | "upcoming" | "completed";

export interface SessionInstructor {
    id: number;
    name: string;
    avatar?: string;
    course: string;
}

export interface ZoomMeeting {
    id: number;
    meetingId: string;
    meetingUrl: string;
    password: string;
}

export interface OnlineSession {
    id: number;
    sessionDate: string;
    startTime: string;
    endTime: string;
    locationType: "online" | "offline";
    effectiveLocationType: "online" | "offline";
    offlineLocation: string | null;
    sessionState: "current" | "completed" | "upcoming";
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
    bbbMeetingId: string | null;
    bbbIsRunning: boolean;
    bbbRecord: boolean;
    bbbStartedAt: string | null;
    bbbEndedAt: string | null;
    hasMeeting: boolean;
    // Zoom meeting fields
    zoomMeeting: ZoomMeeting | null;
    hasZoomMeeting: boolean;
    createdAt: string;
    updatedAt: string;
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
    // Zoom meeting fields
    zoomMeeting?: ZoomMeeting | null;
    hasZoomMeeting?: boolean;
    // Computed for UI
    status?: VirtualSessionStatus;
}

export interface VirtualSessionsData {
    terms: Term[];
    sessions: VirtualSession[];
    currentTermId: number;
}

// ============================================================================
// Zoom Meeting Types
// ============================================================================

export interface CreateZoomMeetingResponse {
    session: OnlineSession;
    zoom: {
        id: number;
        meetingId: string;
        joinUrl: string;
        startUrl: string;
        password: string;
    };
    alreadyExisted: boolean;
}

// ============================================================================
// Attendance Summary Types
// ============================================================================

export type AttendanceStatus = "present" | "absent" | "late" | "excused";
export type TeacherAttendanceStatus =
    | "present"
    | "absent"
    | "late"
    | "cancelled";

/**
 * Student attendance summary from API
 */
export interface StudentAttendanceSummary {
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    attendanceRate: number;
}

export interface StudentAttendanceGroupSession {
    id: number;
    sessionDate: string;
    group: {
        id: number;
        name: string;
    };
}

export interface StudentAttendanceRecord {
    id: number;
    status: AttendanceStatus;
    note: string;
    groupSession: StudentAttendanceGroupSession;
    createdAt: string;
    updatedAt: string;
}

export interface StudentAttendanceSummaryData {
    student: {
        id: number;
        name: string;
    };
    summary: StudentAttendanceSummary;
    attendances: StudentAttendanceRecord[];
}

/**
 * Teacher attendance summary from API
 */
export interface TeacherAttendanceSummary {
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    cancelledCount: number;
    totalMinutesTaught: number;
}

export interface TeacherAttendanceRecord {
    id: number;
    status: TeacherAttendanceStatus;
    note: string;
    minutesTaught: number;
    groupSession: StudentAttendanceGroupSession;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherAttendanceSummaryData {
    teacher: {
        id: number;
        name: string;
    };
    summary: TeacherAttendanceSummary;
    attendances: TeacherAttendanceRecord[];
}
