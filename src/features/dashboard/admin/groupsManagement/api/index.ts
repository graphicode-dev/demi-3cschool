/**
 * Groups Management Feature - API Module
 *
 * Public exports for the groups API layer.
 * Import from '@/features/groupsManagement/api' or '@/features/groupsManagement'.
 *
 * @example
 * ```ts
 * import {
 *     useGroupsList,
 *     useGroup,
 *     useCreateGroup,
 *     useGroupsMetadata,
 *     useGroupRecommendations,
 *     groupKeys,
 * } from '@/features/groupsManagement';
 * ```
 */

// Types
export type {
    Group,
    GroupSchedule,
    GroupAgeRule,
    GroupCourseRef,
    GroupLevelRef,
    GroupType,
    LocationType,
    DayOfWeek,
    GroupsListParams,
    GroupsByLevelParams,
    GroupCreatePayload,
    GroupUpdatePayload,
    GroupsMetadata,
    GroupFilterDefinition,
    GroupOperators,
    GroupFilterFieldType,
    GroupRecommendPayload,
    GroupRecommendation,
    GroupRecommendationsData,
    RecommendationFeatureScores,
    RecommendationWeights,
    PaginatedResponse,
    PaginatedData,
    ListResponse,
} from "../types/groups.types";

// Sessions Types
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
} from "../types/sessions.types";

// Assign Teacher Types
export type {
    SetPrimaryTeacherPayload,
    SetSessionTeacherPayload,
    GroupWithPrimaryTeacher,
    SessionWithTeacher,
    AvailableTeachersParams,
    AvailableTeacher,
} from "../types/assignTeacher.types";

// Query Keys
export { groupKeys, type GroupQueryKey } from "./groups.keys";
export { sessionKeys, type SessionQueryKey } from "./sessions/sessions.keys";
export {
    assignTeacherKeys,
    type AssignTeacherQueryKey,
} from "./assignTeacher/assignTeacher.keys";

// API Functions
export { groupsApi } from "./groups.api";
export { sessionsApi } from "./sessions/sessions.api";
export { assignTeacherApi } from "./assignTeacher/assignTeacher.api";

// Query Hooks
export {
    useGroupsMetadata,
    useGroupsList,
    useGroupsInfinite,
    useGroup,
    useGroupRecommendations,
    useGroupsByLevel,
} from "./groups.queries";

export {
    useSessionsMetadataQuery,
    useSessionsListQuery,
    useSessionDetailQuery,
    useSessionsByGroupQuery,
    useSessionsByLessonQuery,
    useSessionsWithDataQuery,
} from "./sessions/sessions.queries";

export {
    useAvailableTeachersQuery,
    useAvailableTeachersForGroupQuery,
    useAvailableTeachersForSessionQuery,
    useAvailableTeachersWithSearchQuery,
    useTeacherAvailabilityQuery,
} from "./assignTeacher/assignTeacher.queries";

// Mutation Hooks
export {
    useCreateGroup,
    useUpdateGroup,
    useDeleteGroup,
} from "./groups.mutations";

export {
    useCreateSessionMutation,
    useRescheduleSessionMutation,
    useDeleteSession,
    useSessionMutationWithOptimism,
} from "./sessions/sessions.mutations";

export {
    useSetPrimaryTeacherMutation,
    useSetSessionTeacherMutation,
    useTeacherAssignmentWithOptimism,
    useBatchTeacherAssignmentMutation,
} from "./assignTeacher/assignTeacher.mutations";
