/**
 * Assign Teacher Management Feature - API Module
 *
 * Public exports for the teacher assignment API layer.
 * Import from '@/features/groupsManagement/api/assignTeacher' or '@/features/groupsManagement'.
 *
 * @example
 * ```tsx
 * // Import all teacher assignment hooks
 * import {
 *     useAvailableTeachersQuery,
 *     useSetPrimaryTeacherMutation,
 *     useSetSessionTeacherMutation
 * } from '@/features/groupsManagement/api/assignTeacher';
 *
 * // Import specific hooks
 * import { useAvailableTeachersQuery } from '@/features/groupsManagement/api/assignTeacher/assignTeacher.queries';
 * ```
 */

// API functions
export { assignTeacherApi } from "./assignTeacher.api";

// Query hooks
export {
    useAvailableTeachersQuery,
    useAvailableTeachersForGroupQuery,
    useAvailableTeachersForSessionQuery,
    useAvailableTeachersWithSearchQuery,
    useTeacherAvailabilityQuery,
} from "./assignTeacher.queries";

// Mutation hooks
export {
    useSetPrimaryTeacherMutation,
    useSetSessionTeacherMutation,
    useTeacherAssignmentWithOptimism,
    useBatchTeacherAssignmentMutation,
} from "./assignTeacher.mutations";

// Query keys
export {
    assignTeacherKeys,
    type AssignTeacherQueryKey,
} from "./assignTeacher.keys";

// Types
export type {
    SetPrimaryTeacherPayload,
    SetSessionTeacherPayload,
    GroupWithPrimaryTeacher,
    SessionWithTeacher,
} from "../../types/assignTeacher.types";

// Re-export shared types from groups.types
export type { ListResponse } from "../../types/groups.types";
