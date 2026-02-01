/**
 * Attendance Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing attendance data.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceKeys } from "./attendance.keys";
import { attendanceApi } from "./attendance.api";
import { ApiError } from "@/shared/api";
import { StudentAttendancePayload, StudentAttendanceRecord, TeacherAttendance, TeacherAttendancePayload } from "../../types";

// ============================================================================
// Teacher Attendance Mutation
// ============================================================================

/**
 * Hook to update teacher attendance for a session
 */
export function useUpdateTeacherAttendanceMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        TeacherAttendance,
        ApiError,
        { sessionId: string | number; data: TeacherAttendancePayload }
    >({
        mutationFn: ({ sessionId, data }) =>
            attendanceApi.updateTeacherAttendance(sessionId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: attendanceKeys.teacherAttendanceBySession(
                    variables.sessionId
                ),
            });
        },
    });
}

// ============================================================================
// Student Attendance Mutation
// ============================================================================

/**
 * Hook to update student attendance for a session (batch)
 */
export function useUpdateStudentAttendanceMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        StudentAttendanceRecord[],
        ApiError,
        { sessionId: string | number; data: StudentAttendancePayload }
    >({
        mutationFn: ({ sessionId, data }) =>
            attendanceApi.updateStudentAttendance(sessionId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: attendanceKeys.studentAttendanceBySession(
                    variables.sessionId
                ),
            });
        },
    });
}
