/**
 * Assign Teacher Management Feature - Domain Types
 */

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Set primary teacher in group payload
 */
export interface SetPrimaryTeacherPayload {
    primaryTeacherId: number;
}

/**
 * Set teacher in session payload
 */
export interface SetSessionTeacherPayload {
    teacherId: number;
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Group response with primary teacher
 */
export interface GroupWithPrimaryTeacher {
    id: number;
    courseId: number;
    levelId: number;
    name: string;
    maxCapacity: number;
    locationType: "online" | "offline" | "hybrid";
    groupType: "regular" | "semi_private" | "private";
    isActive: boolean;
    course: {
        id: number;
        name: string;
    };
    level: {
        id: number;
        name: string;
    };
    schedules: any; // Define based on actual schedule structure
    ageRule: any; // Define based on actual age rule structure
    primaryTeacher: {
        id: number;
        name: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

/**
 * Session response with assigned teacher
 */
export interface SessionWithTeacher {
    id: number;
    sessionDate: string; // YYYY-MM-DD format
    startTime: string; // HH:mm:ss format
    endTime: string; // HH:mm:ss format
    status: "PLANNED" | "POSTPONED" | "COMPLETED" | "CANCELLED";
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
        email?: string;
        teacherNote?: string | null;
    };
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Query Parameters (for fetching available teachers)
// ============================================================================

/**
 * Parameters for fetching available teachers
 */
export interface AvailableTeachersParams {
    groupId?: number;
    sessionId?: number;
    courseId?: number;
    levelId?: number;
    search?: string;
    page?: number;
    limit?: number;
}

/**
 * Available teacher entity
 */
export interface AvailableTeacher {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
    specialization?: string[];
    experience?: number;
    rating?: number;
    availability?: {
        [date: string]: boolean; // Date -> availability
    };
}
