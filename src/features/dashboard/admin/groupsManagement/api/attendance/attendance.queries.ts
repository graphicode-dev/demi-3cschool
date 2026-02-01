/**
 * Attendance Feature - Query Hooks
 *
 * TanStack Query hooks for reading attendance data.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { attendanceKeys } from "./attendance.keys";
import { attendanceApi } from "./attendance.api";
import { StudentAttendanceRecord, TeacherAttendance } from "../../types";

// ============================================================================
// Teacher Attendance Queries
// ============================================================================

/**
 * Hook to fetch teacher attendance for a session
 */
export function useTeacherAttendanceQuery(
    sessionId: string | number,
    options?: Partial<UseQueryOptions<TeacherAttendance[], Error>>
) {
    return useQuery({
        queryKey: attendanceKeys.teacherAttendanceBySession(sessionId),
        queryFn: ({ signal }) =>
            attendanceApi.getTeacherAttendance(sessionId, signal),
        enabled: !!sessionId,
        ...options,
    });
}

// ============================================================================
// Student Attendance Queries
// ============================================================================

/**
 * Hook to fetch student attendance for a session
 */
export function useStudentAttendanceQuery(
    sessionId: string | number,
    options?: Partial<UseQueryOptions<StudentAttendanceRecord[], Error>>
) {
    return useQuery({
        queryKey: attendanceKeys.studentAttendanceBySession(sessionId),
        queryFn: ({ signal }) =>
            attendanceApi.getStudentAttendance(sessionId, signal),
        enabled: !!sessionId,
        ...options,
    });
}
