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

export type EnrollVariables = {
    groupId: number | string;
    programId: number | string;
};

// ============================================================================
// API Response Types
// ============================================================================

export interface SlotProgramRef {
    id: number;
    name: string;
}

export interface AvailableSlot {
    id: number;
    day: DayOfWeek;
    type: SessionType;
    startTime: string;
    endTime: string;
    totalCapacity: number;
    enrolledCount: number;
    availableSlots: number;
    program: SlotProgramRef;
}

export interface EnrollmentGroupRef {
    id: number;
    name: string;
}

export interface Enrollment {
    id: number;
    enrolledAt: string;
    status: string;
    student: Record<string, unknown>;
    group: EnrollmentGroupRef;
    createdAt: string;
    updatedAt: string;
}

/**
 * Schedule entity from API
 */
export interface GroupSchedule {
    id: number;
    groupId: number;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Level entity from API
 */
export interface GroupLevel {
    id: number;
    title: string;
    slug: string;
}

/**
 * Programs Curriculum entity from API
 */
export interface GroupProgramsCurriculum {
    id: number;
    name: string;
    caption: string;
    description: string;
    isActive: number | boolean;
}

/**
 * Grade entity from API
 */
export interface GroupGrade {
    id: number;
    name: string;
    code: string;
}

/**
 * Grade Rule entity from API
 */
export interface GroupGradeRule {
    id: number;
    name: string;
    code: string;
}

/**
 * Location entity for offline groups
 */
export interface GroupLocation {
    id: number;
    name: string;
    address?: string;
}

/**
 * Available Group entity from API
 */
export interface AvailableGroup {
    id: number;
    name: string;
    maxCapacity: number;
    enrolledCount: number | null;
    availableSlots: number | null;
    isFull: boolean | null;
    locationType: "online" | "offline";
    isActive: boolean;
    level: GroupLevel;
    programsCurriculum: GroupProgramsCurriculum;
    grade: GroupGrade;
    schedules: GroupSchedule[];
    trainer: unknown | null;
    gradeRule: GroupGradeRule;
    location?: GroupLocation;
    primaryTeacher?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

/**
 * My Program Groups Response Data
 */
export interface MyProgramGroupsData {
    enrolled: boolean;
    slots?: AvailableSlot[];
    enrollment?: Enrollment;
    group?: AvailableGroup;
}

/**
 * My Program Groups API Response
 */
export interface MyProgramGroupsResponse {
    success: boolean;
    message: string;
    data: MyProgramGroupsData;
}

/**
 * Enroll Response
 */
export interface EnrollResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
