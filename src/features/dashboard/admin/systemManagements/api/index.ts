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
 *     useGrades,
 *     gradeKeys,
 * } from '@/features/systemManagements/api';
 * ```
 *
 */

// Types - Student
export type { Student, StudentRole, UserInformation } from "../types";

// Types - Grade
export type { Grade, GradesResponse } from "../types";

// Query Keys
export {
    studentKeys,
    type StudentQueryKey,
    gradeKeys,
    type GradeQueryKey,
} from "./systemManagement.keys";

// API Functions
export { studentsApi, gradesApi } from "./systemManagement.api";

// Query Hooks
export {
    useStudentsList,
    useStudent,
    useGrades,
} from "./systemManagement.queries";
