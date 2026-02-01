/**
 * Attendance Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

export const attendanceKeys = {
    /**
     * Root key for all attendance queries
     */
    all: ["attendance"] as const,

    /**
     * Key for all teacher attendance queries
     */
    teacherAttendance: () => [...attendanceKeys.all, "teacher"] as const,

    /**
     * Key for specific session's teacher attendance
     */
    teacherAttendanceBySession: (sessionId: string | number) =>
        [...attendanceKeys.teacherAttendance(), sessionId] as const,

    /**
     * Key for all student attendance queries
     */
    studentAttendance: () => [...attendanceKeys.all, "student"] as const,

    /**
     * Key for specific session's student attendance
     */
    studentAttendanceBySession: (sessionId: string | number) =>
        [...attendanceKeys.studentAttendance(), sessionId] as const,
};

/**
 * Type for attendance query keys
 */
export type AttendanceQueryKey =
    | typeof attendanceKeys.all
    | ReturnType<typeof attendanceKeys.teacherAttendance>
    | ReturnType<typeof attendanceKeys.teacherAttendanceBySession>
    | ReturnType<typeof attendanceKeys.studentAttendance>
    | ReturnType<typeof attendanceKeys.studentAttendanceBySession>;
