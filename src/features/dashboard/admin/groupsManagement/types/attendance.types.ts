export type StudentAttendance = {
    id: string;
    studentAvatar: string;
    selected: boolean;
    studentName: string;
    status: string;
    attendanceDate: string;
    attendanceTime: string;
    primaryTeacher: {
        name: string;
    };
};

export type CurrentSession = {
    date: string;
    startTime: string;
    endTime: string;
    totalEnrolled: string;
    instructor: {
        name: string;
    };
};

export type AttendanceSummary = {
    totalStudents: number;
    presentCount: number;
    absentCount: number;
    attendanceRate: number;
};

/**
 * Attendance API Types
 *
 * Types for teacher and student attendance endpoints.
 */

// ============================================================================
// Common Types
// ============================================================================

export type AttendanceStatus = "present" | "absent" | "late" | "cancelled";

export interface GroupSessionRef {
    id: number;
    sessionDate: string;
    startTime: string;
    endTime: string;
}

// ============================================================================
// Teacher Attendance Types
// ============================================================================

export interface TeacherRef {
    id: number;
    name: string;
}

export interface TeacherAttendance {
    id: number;
    status: AttendanceStatus;
    statusLabel: string;
    minutesTaught: number;
    note: string;
    teacher: TeacherRef;
    groupSession: GroupSessionRef;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherAttendancePayload {
    teacher_id: number;
    status: AttendanceStatus;
    minutes_taught?: number;
    note?: string;
}

// ============================================================================
// Student Attendance Types
// ============================================================================

export interface StudentRef {
    id: number;
    name: string;
}

export interface StudentAttendanceRecord {
    id: number;
    status: AttendanceStatus;
    note: string;
    student: StudentRef;
    createdAt: string;
    updatedAt: string;
}

export interface StudentAttendanceItem {
    student_id: number;
    status: AttendanceStatus;
    note?: string;
}

export interface StudentAttendancePayload {
    attendances: StudentAttendanceItem[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface AttendanceApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
