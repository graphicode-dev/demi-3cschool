/**
 * Assign Teacher Management Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all teacher assignment data
 * queryClient.invalidateQueries({ queryKey: assignTeacherKeys.all });
 *
 * // Invalidate available teachers for a group
 * queryClient.invalidateQueries({ queryKey: assignTeacherKeys.availableTeachers({ groupId }) });
 * ```
 */

import type { AvailableTeachersParams } from "../../types/assignTeacher.types";

/**
 * Query key factory for teacher assignment
 *
 * Hierarchy:
 * - all: ['assign-teacher']
 * - availableTeachers: ['assign-teacher', 'available-teachers']
 * - availableTeachers(params): ['assign-teacher', 'available-teachers', ...params]
 * - groupDetail: ['assign-teacher', 'group-detail']
 * - groupDetail(groupId): ['assign-teacher', 'group-detail', groupId]
 * - sessionDetail: ['assign-teacher', 'session-detail']
 * - sessionDetail(sessionId): ['assign-teacher', 'session-detail', sessionId]
 */
export const assignTeacherKeys = {
    /**
     * Root key for all assign-teacher queries
     */
    all: ["assign-teacher"] as const,

    /**
     * Key for available teachers queries
     */
    availableTeachers: () =>
        [...assignTeacherKeys.all, "available-teachers"] as const,

    /**
     * Key for specific available teachers query with parameters
     */
    availableTeachersParams: (params: AvailableTeachersParams) =>
        [
            ...assignTeacherKeys.availableTeachers(),
            {
                groupId: params.groupId,
                sessionId: params.sessionId,
                courseId: params.courseId,
                levelId: params.levelId,
                search: params.search,
                page: params.page,
                limit: params.limit,
            },
        ] as const,

    /**
     * Key for group detail queries (for primary teacher info)
     */
    groupDetail: () => [...assignTeacherKeys.all, "group-detail"] as const,

    /**
     * Key for specific group detail
     */
    groupDetailById: (groupId: number) =>
        [...assignTeacherKeys.groupDetail(), groupId] as const,

    /**
     * Key for session detail queries (for session teacher info)
     */
    sessionDetail: () => [...assignTeacherKeys.all, "session-detail"] as const,

    /**
     * Key for specific session detail
     */
    sessionDetailById: (sessionId: number) =>
        [...assignTeacherKeys.sessionDetail(), sessionId] as const,
};

/**
 * Type for assign-teacher query keys
 */
export type AssignTeacherQueryKey =
    | typeof assignTeacherKeys.all
    | ReturnType<typeof assignTeacherKeys.availableTeachers>
    | ReturnType<typeof assignTeacherKeys.availableTeachersParams>
    | ReturnType<typeof assignTeacherKeys.groupDetail>
    | ReturnType<typeof assignTeacherKeys.groupDetailById>
    | ReturnType<typeof assignTeacherKeys.sessionDetail>
    | ReturnType<typeof assignTeacherKeys.sessionDetailById>;
