/**
 * Lesson Assignments Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson assignment data.
 * All mutations automatically invalidate relevant queries.
 * Uses FormData for create and update operations.
 *
 * @example
 * ```tsx
 * // Create lesson assignment
 * const createMutation = useCreateLessonAssignment();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson assignment
 * const updateMutation = useUpdateLessonAssignment();
 * await updateMutation.mutateAsync({ id: assignmentId, data: payload });
 *
 * // Delete lesson assignment
 * const deleteMutation = useDeleteLessonAssignment();
 * await deleteMutation.mutateAsync(assignmentId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonAssignmentKeys } from "./lesson-assignments.keys";
import { lessonAssignmentsApi } from "./lesson-assignments.api";
import { LessonAssignment, LessonAssignmentCreatePayload, LessonAssignmentUpdatePayload } from "../../types/lesson-assignments.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new lesson assignment
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLessonAssignment();
 *
 * const handleSubmit = async (data: LessonAssignmentCreatePayload) => {
 *     try {
 *         const assignment = await mutateAsync(data);
 *         toast.success('Lesson assignment created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLessonAssignment() {
    const queryClient = useQueryClient();

    return useMutation<LessonAssignment, ApiError, LessonAssignmentCreatePayload>({
        mutationFn: lessonAssignmentsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonAssignmentKeys.all,
            });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson assignment
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLessonAssignment();
 *
 * const handleUpdate = (data: LessonAssignmentUpdatePayload) => {
 *     mutate(
 *         { id: assignmentId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson assignment updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLessonAssignment() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonAssignment,
        ApiError,
        { id: string; data: LessonAssignmentUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonAssignmentsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: lessonAssignmentKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: lessonAssignmentKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson assignment
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLessonAssignment();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(assignmentId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson assignment deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLessonAssignment() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonAssignmentsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: lessonAssignmentKeys.all,
            });
            queryClient.removeQueries({
                queryKey: lessonAssignmentKeys.detail(id),
            });
        },
    });
}
