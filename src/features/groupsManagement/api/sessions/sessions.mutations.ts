/**
 * Group Sessions Management Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing session data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create session
 * const createMutation = useCreateSessionMutation();
 * await createMutation.mutateAsync(payload);
 *
 * // Reschedule session
 * const rescheduleMutation = useRescheduleSessionMutation();
 * await rescheduleMutation.mutateAsync({ id: sessionId, data: payload });
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionKeys } from "./sessions.keys";
import { sessionsApi } from "./sessions.api";
import type {
    GroupSession,
    GroupSessionCreatePayload,
    GroupSessionReschedulePayload,
} from "../../types/sessions.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook for creating a new session
 */
export const useCreateSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: GroupSessionCreatePayload) =>
            sessionsApi.create(payload),
        onSuccess: (newSession) => {
            // Invalidate only relevant list queries with specific filters
            // Instead of invalidating all lists, we should be more specific
            queryClient.invalidateQueries({
                queryKey: sessionKeys.lists(),
                refetchType: "active", // Only refetch active queries
            });

            // Invalidate specific group queries if we have group filtering capability
            if (newSession.group?.id) {
                queryClient.invalidateQueries({
                    queryKey: sessionKeys.byGroup(newSession.group.id),
                });
            }
            if (newSession.lesson?.id) {
                queryClient.invalidateQueries({
                    queryKey: sessionKeys.byLesson(newSession.lesson.id),
                });
            }
        },
        onError: (error) => {
            console.error("Failed to create session:", error);
        },
    });
};

// ============================================================================
// Reschedule Mutation
// ============================================================================

/**
 * Hook for rescheduling an existing session
 */
export const useRescheduleSessionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: GroupSessionReschedulePayload;
        }) => sessionsApi.reschedule(id, payload),
        onSuccess: (updatedSession, { id }) => {
            // Update the specific session detail cache
            queryClient.setQueryData(sessionKeys.detail(id), updatedSession);

            // Invalidate all list queries since rescheduling affects list order
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });

            // Invalidate related group and lesson queries
            if (updatedSession.group?.id) {
                queryClient.invalidateQueries({
                    queryKey: sessionKeys.byGroup(updatedSession.group.id),
                });
            }
            if (updatedSession.lesson?.id) {
                queryClient.invalidateQueries({
                    queryKey: sessionKeys.byLesson(updatedSession.lesson.id),
                });
            }
        },
        onError: (error) => {
            console.error("Failed to reschedule session:", error);
        },
    });
};

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a group
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteGroup();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(groupId, {
 *             onSuccess: () => {
 *                 toast.success('Group deleted');
 *                 navigate('/groups');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteSession() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => sessionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.all });
            queryClient.removeQueries({
                queryKey: sessionKeys.detail(Number(id)),
            });
        },
    });
}

// ============================================================================
// Combined Mutations
// ============================================================================

/**
 * Hook for session operations with optimistic updates
 * Provides better UX by updating cache immediately and rolling back on error
 */
export const useSessionMutationWithOptimism = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: GroupSessionCreatePayload) =>
            sessionsApi.create(payload),
        onMutate: async (newSessionData) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: sessionKeys.lists() });

            // Snapshot the previous value
            const previousSessions = queryClient.getQueryData(
                sessionKeys.lists()
            );

            // Optimistically update to the new value
            const optimisticSession: GroupSession = {
                id: Date.now(), // Temporary ID
                sessionDate: newSessionData.session_date,
                startTime: newSessionData.start_time + ":00",
                endTime: newSessionData.end_time + ":00",
                status: "PLANNED",
                reason: null,
                isManual: true,
                lesson: { id: newSessionData.lesson_id, title: "New Lesson" },
                group: { id: newSessionData.group_id, name: "New Group" },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            queryClient.setQueryData(
                sessionKeys.lists(),
                (old: GroupSession[] = []) => [...old, optimisticSession]
            );

            return { previousSessions };
        },
        onError: (error, newSessionData, context) => {
            console.error("Failed to create session:", error);
            // Rollback on error
            if (context?.previousSessions) {
                queryClient.setQueryData(
                    sessionKeys.lists(),
                    context.previousSessions
                );
            }
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        },
    });

    const rescheduleMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: GroupSessionReschedulePayload;
        }) => sessionsApi.reschedule(id, payload),
        onMutate: async ({ id, payload }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: sessionKeys.detail(id),
            });

            // Snapshot the previous value
            const previousSession = queryClient.getQueryData(
                sessionKeys.detail(id)
            );

            // Optimistically update
            queryClient.setQueryData(
                sessionKeys.detail(id),
                (old: GroupSession) => ({
                    ...old!,
                    sessionDate: payload.session_date,
                    startTime: payload.start_time + ":00",
                    endTime: payload.end_time + ":00",
                    status: "POSTPONED",
                    reason: payload.reason || null,
                    updatedAt: new Date().toISOString(),
                })
            );

            return { previousSession };
        },
        onError: (error, { id }, context) => {
            console.error("Failed to reschedule session:", error);
            // Rollback on error
            if (context?.previousSession) {
                queryClient.setQueryData(
                    sessionKeys.detail(id),
                    context.previousSession
                );
            }
        },
        onSettled: (_, __, { id }) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
        },
    });

    return {
        createSession: createMutation,
        rescheduleSession: rescheduleMutation,
    };
};
