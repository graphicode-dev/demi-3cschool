/**
 * Attendance Feature - API Functions
 *
 * Raw API functions for attendance domain.
 * These are pure functions that make HTTP requests.
 */

import { api } from "@/shared/api/client";
import {
    StudentAttendancePayload,
    StudentAttendanceRecord,
    StudentAttendanceResponse,
    TeacherAttendance,
    TeacherAttendancePayload,
} from "../../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/group-sessions";

/**
 * Attendance API functions
 */
export const attendanceApi = {
    // ========================================================================
    // Teacher Attendance
    // ========================================================================

    /**
     * Get teacher attendance for a session
     */
    getTeacherAttendance: async (
        sessionId: string | number,
        signal?: AbortSignal
    ): Promise<TeacherAttendance[]> => {
        const response = await api.get<ApiResponse<TeacherAttendance[]>>(
            `${BASE_URL}/${sessionId}/teacher-attendance`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Record/Update teacher attendance for a session
     */
    updateTeacherAttendance: async (
        sessionId: string | number,
        payload: TeacherAttendancePayload
    ): Promise<TeacherAttendance> => {
        const response = await api.put<ApiResponse<TeacherAttendance>>(
            `${BASE_URL}/${sessionId}/teacher-attendance`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    // ========================================================================
    // Student Attendance
    // ========================================================================

    /**
     * Get student attendance for a session
     */
    getStudentAttendance: async (
        sessionId: string | number,
        signal?: AbortSignal
    ): Promise<StudentAttendanceResponse> => {
        const response = await api.get<ApiResponse<StudentAttendanceResponse>>(
            `${BASE_URL}/${sessionId}/student-attendance`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Record/Update student attendance for a session (batch)
     */
    updateStudentAttendance: async (
        sessionId: string | number,
        payload: StudentAttendancePayload
    ): Promise<StudentAttendanceRecord[]> => {
        const response = await api.put<ApiResponse<StudentAttendanceRecord[]>>(
            `${BASE_URL}/${sessionId}/student-attendance`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },
};
