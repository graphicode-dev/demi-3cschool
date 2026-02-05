/**
 * Students Feature - API Module
 */

// Types
export type {
    StudentRoleRef,
    StudentUserInformation,
    StudentsListParams,
    StudentCreatePayload,
    StudentUpdatePayload,
} from "../types";

// Query Keys
export { studentsKeys, type StudentsQueryKey } from "./students.keys";

// API Functions
export { studentsApi } from "./students.api";

// Query Hooks
export { useStudentsList, useStudent } from "./students.queries";

// Mutation Hooks
export {
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent,
} from "./students.mutations";
