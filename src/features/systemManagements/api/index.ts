/**
 * System Managements Feature - API Module
 *
 * Public exports for the System Managements API layer.
 * Import from '@/features/systemManagements/api' or '@/features/systemManagements'.
 *
 * @example
 * ```ts
 * import {
 *     useStudentsList,
 *     useStudent,
 *     studentKeys,
 * } from '@/features/systemManagements/api';
 * ```
 *
 */

// Types - Student
export type {
    Student,
    StudentRole,
    UserInformation,
    StudentListParams,
    PaginatedStudentData,
    StudentListResponse,
} from "../types";

// Query Keys
export { studentKeys, type StudentQueryKey } from "./systemManagement.keys";

// API Functions
export { studentsApi } from "./systemManagement.api";

// Query Hooks
export { useStudentsList, useStudent } from "./systemManagement.queries";
