/**
 * Attendance API Module - Public Exports
 */

// Types
export type {
    AttendanceStatus,
    GroupSessionRef,
    TeacherRef,
    TeacherAttendance,
    TeacherAttendancePayload,
    StudentRef,
    StudentAttendanceRecord,
    StudentAttendanceItem,
    StudentAttendancePayload,
} from "../../types";

// Query Keys
export { attendanceKeys, type AttendanceQueryKey } from "./attendance.keys";

// API Functions
export { attendanceApi } from "./attendance.api";

// Query Hooks
export {
    useTeacherAttendanceQuery,
    useStudentAttendanceQuery,
} from "./attendance.queries";

// Mutation Hooks
export {
    useUpdateTeacherAttendanceMutation,
    useUpdateStudentAttendanceMutation,
} from "./attendance.mutations";
