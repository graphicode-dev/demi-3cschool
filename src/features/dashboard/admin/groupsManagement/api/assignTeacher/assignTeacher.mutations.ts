/**
 * Assign Teacher Management Feature - Mutation Hooks
 *
 * TanStack Query hooks for teacher assignment operations.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Set primary teacher
 * const setPrimaryMutation = useSetPrimaryTeacherMutation();
 * await setPrimaryMutation.mutateAsync({ groupId: 1, payload: { primaryTeacherId: 2 } });
 *
 * // Set session teacher
 * const setSessionMutation = useSetSessionTeacherMutation();
 * await setSessionMutation.mutateAsync({ sessionId: 1, payload: { teacherId: 2 } });
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignTeacherKeys } from "./assignTeacher.keys";
import { assignTeacherApi } from "./assignTeacher.api";
import type { ApiError } from "@/shared/api";
import type {
    SetPrimaryTeacherPayload,
    SetSessionTeacherPayload,
    GroupWithPrimaryTeacher,
    SessionWithTeacher,
} from "../../types/assignTeacher.types";
import { groupKeys } from "../groups.keys";
import { teachersKeys } from "@/features/dashboard/admin/settings/teachers/api";

// ============================================================================
// Primary Teacher Assignment Mutation
// ============================================================================

/**
 * Hook for setting primary teacher for a group
 */
export const useSetPrimaryTeacherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        GroupWithPrimaryTeacher,
        ApiError,
        { groupId: number; payload: SetPrimaryTeacherPayload }
    >({
        mutationFn: ({
            groupId,
            payload,
        }: {
            groupId: number;
            payload: SetPrimaryTeacherPayload;
        }) => assignTeacherApi.setPrimaryTeacher(groupId, payload),
        onSuccess: (updatedGroup, { groupId }) => {
            // Invalidate group detail queries
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.groupDetailById(groupId),
            });

            // Invalidate group detail in groups domain
            queryClient.invalidateQueries({
                queryKey: groupKeys.detail(String(groupId)),
            });

            // Invalidate teachers list/detail (since teacher assignment changed)
            queryClient.invalidateQueries({ queryKey: teachersKeys.all });

            // Invalidate available teachers queries for this group
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.availableTeachers(),
                refetchType: "active",
            });
        },
        onError: (error) => {
            console.error("Failed to set primary teacher:", error);
        },
    });
};

// ============================================================================
// Session Teacher Assignment Mutation
// ============================================================================

/**
 * Hook for setting teacher for a specific session
 */
export const useSetSessionTeacherMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        SessionWithTeacher,
        ApiError,
        { sessionId: number; payload: SetSessionTeacherPayload }
    >({
        mutationFn: ({
            sessionId,
            payload,
        }: {
            sessionId: number;
            payload: SetSessionTeacherPayload;
        }) => assignTeacherApi.setSessionTeacher(sessionId, payload),
        onSuccess: (updatedSession, { sessionId }) => {
            // Invalidate session detail queries
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.sessionDetailById(sessionId),
            });

            // Invalidate sessions list queries (if they exist in sessions API)
            queryClient.invalidateQueries({
                queryKey: ["group-sessions", "detail", sessionId],
            });

            // Invalidate available teachers queries for this session
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.availableTeachers(),
                refetchType: "active",
            });
        },
        onError: (error) => {
            console.error("Failed to set session teacher:", error);
        },
    });
};

// ============================================================================
// Combined Mutations with Optimistic Updates
// ============================================================================

/**
 * Hook for teacher assignment operations with optimistic updates
 * Provides better UX by updating cache immediately and rolling back on error
 */
export const useTeacherAssignmentWithOptimism = () => {
    const queryClient = useQueryClient();

    const setPrimaryTeacherMutation = useMutation<
        GroupWithPrimaryTeacher,
        ApiError,
        { groupId: number; payload: SetPrimaryTeacherPayload },
        { previousGroup: GroupWithPrimaryTeacher | undefined }
    >({
        mutationFn: ({ groupId, payload }) =>
            assignTeacherApi.setPrimaryTeacher(groupId, payload),
        onMutate: async ({ groupId, payload }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: assignTeacherKeys.groupDetailById(groupId),
            });

            // Snapshot the previous value
            const previousGroup =
                queryClient.getQueryData<GroupWithPrimaryTeacher>(
                    assignTeacherKeys.groupDetailById(groupId)
                );

            // Optimistically update
            queryClient.setQueryData(
                assignTeacherKeys.groupDetailById(groupId),
                (old: GroupWithPrimaryTeacher) => ({
                    ...old!,
                    primaryTeacher: {
                        id: payload.primaryTeacherId,
                        name: "Teacher", // This would be updated with actual teacher data
                    },
                    updatedAt: new Date().toISOString(),
                })
            );

            return { previousGroup };
        },
        onError: (error, { groupId }, context) => {
            console.error("Failed to set primary teacher:", error);
            // Rollback on error
            if (context?.previousGroup) {
                queryClient.setQueryData(
                    assignTeacherKeys.groupDetailById(groupId),
                    context.previousGroup
                );
            }
        },
        onSettled: (_, __, { groupId }) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.groupDetailById(groupId),
            });
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.availableTeachers(),
            });
        },
    });

    const setSessionTeacherMutation = useMutation<
        SessionWithTeacher,
        ApiError,
        { sessionId: number; payload: SetSessionTeacherPayload },
        { previousSession: SessionWithTeacher | undefined }
    >({
        mutationFn: ({ sessionId, payload }) =>
            assignTeacherApi.setSessionTeacher(sessionId, payload),
        onMutate: async ({ sessionId, payload }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: assignTeacherKeys.sessionDetailById(sessionId),
            });

            // Snapshot the previous value
            const previousSession =
                queryClient.getQueryData<SessionWithTeacher>(
                    assignTeacherKeys.sessionDetailById(sessionId)
                );

            // Optimistically update
            queryClient.setQueryData(
                assignTeacherKeys.sessionDetailById(sessionId),
                (old: SessionWithTeacher) => ({
                    ...old!,
                    teacher: {
                        id: payload.teacherId,
                        name: "Teacher", // This would be updated with actual teacher data
                        teacherNote: null,
                    },
                    updatedAt: new Date().toISOString(),
                })
            );

            return { previousSession };
        },
        onError: (error, { sessionId }, context) => {
            console.error("Failed to set session teacher:", error);
            // Rollback on error
            if (context?.previousSession) {
                queryClient.setQueryData(
                    assignTeacherKeys.sessionDetailById(sessionId),
                    context.previousSession
                );
            }
        },
        onSettled: (_, __, { sessionId }) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.sessionDetailById(sessionId),
            });
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.availableTeachers(),
            });
        },
    });

    return {
        setPrimaryTeacher: setPrimaryTeacherMutation,
        setSessionTeacher: setSessionTeacherMutation,
    };
};

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Hook for batch teacher assignment operations
 * Useful for setting teachers for multiple sessions at once
 */
export const useBatchTeacherAssignmentMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        SessionWithTeacher[],
        ApiError,
        { sessionIds: number[]; teacherId: number }
    >({
        mutationFn: async ({ sessionIds, teacherId }) => {
            const promises = sessionIds.map((sessionId) =>
                assignTeacherApi.setSessionTeacher(sessionId, { teacherId })
            );
            return Promise.all(promises);
        },
        onSuccess: (_, { sessionIds }) => {
            // Invalidate all affected session details
            sessionIds.forEach((sessionId) => {
                queryClient.invalidateQueries({
                    queryKey: assignTeacherKeys.sessionDetailById(sessionId),
                });
            });

            // Invalidate sessions list queries
            queryClient.invalidateQueries({
                queryKey: ["group-sessions", "list"],
            });

            // Invalidate available teachers queries
            queryClient.invalidateQueries({
                queryKey: assignTeacherKeys.availableTeachers(),
                refetchType: "active",
            });
        },
        onError: (error) => {
            console.error("Failed to assign teachers in batch:", error);
        },
    });
};
