/**
 * Lesson Quiz Options Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson quiz option data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create lesson quiz option(s)
 * const createMutation = useCreateLessonQuizOption();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson quiz option
 * const updateMutation = useUpdateLessonQuizOption();
 * await updateMutation.mutateAsync({ id: optionId, data: payload });
 *
 * // Delete lesson quiz option
 * const deleteMutation = useDeleteLessonQuizOption();
 * await deleteMutation.mutateAsync(optionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonQuizOptionKeys } from "./lesson-quiz-options.keys";
import { lessonQuizOptionsApi } from "./lesson-quiz-options.api";
import { LessonQuizOption, LessonQuizOptionCreatePayload, LessonQuizOptionUpdatePayload } from "../../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create lesson quiz option(s) - supports single or multiple options
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLessonQuizOption();
 *
 * // Create single option
 * const handleCreateSingle = async () => {
 *     await mutateAsync({
 *         question_id: '1',
 *         option_text: 'Option A',
 *         is_correct: true,
 *         order: 1,
 *     });
 * };
 *
 * // Create multiple options
 * const handleCreateMultiple = async () => {
 *     await mutateAsync({
 *         question_id: '1',
 *         options: [
 *             { option_text: 'Option A', is_correct: true, order: 1 },
 *             { option_text: 'Option B', is_correct: false, order: 2 },
 *         ],
 *     });
 * };
 * ```
 */
export function useCreateLessonQuizOption() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonQuizOption | LessonQuizOption[],
        ApiError,
        LessonQuizOptionCreatePayload
    >({
        mutationFn: lessonQuizOptionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizOptionKeys.all,
            });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson quiz option
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLessonQuizOption();
 *
 * const handleUpdate = (data: LessonQuizOptionUpdatePayload) => {
 *     mutate(
 *         { id: optionId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson quiz option updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLessonQuizOption() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonQuizOption,
        ApiError,
        { id: string; data: LessonQuizOptionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonQuizOptionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizOptionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: lessonQuizOptionKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson quiz option
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLessonQuizOption();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(optionId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson quiz option deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLessonQuizOption() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonQuizOptionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizOptionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: lessonQuizOptionKeys.detail(id),
            });
        },
    });
}
