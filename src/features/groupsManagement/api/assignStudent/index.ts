/**
 * Assign Student Management Feature - API Module
 *
 * Public exports for the student assignment API layer.
 * Import from '@/features/groupsManagement/api/assignStudent' or '@/features/groupsManagement'.
 *
 * @example
 * ```tsx
 * // Import all student assignment hooks
 * import {
 *     useGetGroupStudentsQuery,
 *     useAssignStudentMutation,
 *     useUpdateStudentEnrollmentMutation,
 *     useTransferStudentMutation,
 *     useRemoveStudentMutation
 * } from '@/features/groupsManagement/api/assignStudent';
 *
 * // Import specific hooks
 * import { useGetGroupStudentsQuery } from '@/features/groupsManagement/api/assignStudent/assignStudent.queries';
 * ```
 */

// API functions
export { assignStudentApi } from "./assignStudent.api";

// Query hooks
export {
    useGetGroupStudentsQuery,
    useGetGroupStudentsWithSearchQuery,
    useGetStudentDetailQuery,
    useGetAvailableStudentsQuery,
    useGetStudentStatisticsQuery,
} from "./assignStudent.queries";

// Mutation hooks
export {
    useAssignStudentMutation,
    useUpdateStudentEnrollmentMutation,
    useTransferStudentMutation,
    useRemoveStudentMutation,
    useAssignStudentWithOptimism,
    useBatchStudentAssignmentMutation,
} from "./assignStudent.mutations";

// Query keys
export {
    assignStudentKeys,
    type AssignStudentQueryKey,
} from "./assignStudent.keys";

// Types
export type {
    GroupStudent,
    StudentStatus,
    AssignStudentPayload,
    UpdateStudentEnrollmentPayload,
    TransferStudentPayload,
    GetGroupStudentsResponse,
    AssignStudentResponse,
    UpdateStudentEnrollmentResponse,
    TransferStudentResponse,
    DeleteStudentResponse,
} from "../../types/assignStudent.types";

// Re-export shared types from groups.types
export type { ListResponse } from "../../types/groups.types";
