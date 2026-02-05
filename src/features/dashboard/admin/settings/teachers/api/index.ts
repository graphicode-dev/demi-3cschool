/**
 * Teachers Feature - API Module
 */

// Types
export type {
    TeacherRoleRef,
    TeachersListParams,
    TeacherCreatePayload,
    TeacherUpdatePayload,
} from "../types";

// Query Keys
export { teachersKeys, type TeachersQueryKey } from "./teachers.keys";

// API Functions
export { teachersApi } from "./teachers.api";

// Query Hooks
export { useTeachersList, useTeacher } from "./teachers.queries";

// Mutation Hooks
export {
    useCreateTeacher,
    useUpdateTeacher,
    useDeleteTeacher,
} from "./teachers.mutations";
