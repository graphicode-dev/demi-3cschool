/**
 * Instructor Management Types
 */

export interface Instructor {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    assignedSince: string;
}

export interface InstructorSummary {
    totalStudents: number;
    totalGroups: number;
    totalSessions: number;
    teachingHours: number;
    averageRating: number;
}

export interface Session {
    id: string;
    name: string;
    dateTime: string;
    group: string;
    currentTeacher: string;
}

export interface InstructorSession {
    id: string;
    sessionName: string;
    date: string;
    time: string;
    group: string;
    currentTeacher: string;
}
