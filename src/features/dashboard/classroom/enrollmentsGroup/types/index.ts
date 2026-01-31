/**
 * Enrollments Group Types
 */

export type SessionType = "online" | "offline";

export type DayOfWeek =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";

export interface EnrollmentGroup {
    id: number;
    sessionType: SessionType;
    day: DayOfWeek;
    startTime: string;
    endTime: string;
    location?: string;
    address?: string;
    isEnrolled?: boolean;
}

export interface EnrolledGroup extends EnrollmentGroup {
    isEnrolled: true;
    isActive: boolean;
}

export interface EnrollmentState {
    onlineGroup: EnrolledGroup | null;
    offlineGroup: EnrolledGroup | null;
    offlineUnlocked: boolean;
    onlineSessionsCompleted: number;
    requiredOnlineSessions: number;
}
