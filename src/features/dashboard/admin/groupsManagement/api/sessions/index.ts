/**
 * Group Sessions Management Feature - API Module
 *
 * Public exports for the sessions API layer.
 * Import from '@/features/groupsManagement/api/sessions' or '@/features/groupsManagement'.
 *
 * @example
 * ```tsx
 * // Import all session hooks
 * import { useSessionsListQuery, useCreateSessionMutation } from '@/features/groupsManagement/api/sessions';
 *
 * // Import specific hooks
 * import { useSessionsListQuery } from '@/features/groupsManagement/api/sessions/sessions.queries';
 * ```
 */

// API functions
export { sessionsApi } from "./sessions.api";

// Query hooks
export {
    useSessionsMetadataQuery,
    useSessionsListQuery,
    useSessionDetailQuery,
    useSessionsByGroupQuery,
    useSessionsByLessonQuery,
    useSessionsWithDataQuery,
} from "./sessions.queries";

// Mutation hooks
export {
    useCreateSessionMutation,
    useRescheduleSessionMutation,
    useDeleteSession,
    useSessionMutationWithOptimism,
} from "./sessions.mutations";

// Query keys
export { sessionKeys, type SessionQueryKey } from "./sessions.keys";

// Types
export type {
    GroupSession,
    SessionStatus,
    SessionsListParams,
    GroupSessionCreatePayload,
    GroupSessionReschedulePayload,
    SessionsMetadata,
    SessionFilterDefinition,
    SessionFilterFieldType,
    SessionOperators,
} from "../../types/sessions.types";

// Re-export shared types from groups.types
export type { ListResponse } from "../../types/groups.types";
