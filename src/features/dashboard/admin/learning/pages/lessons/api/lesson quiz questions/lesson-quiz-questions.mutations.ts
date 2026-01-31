/**
 * Lesson Quiz Questions Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson quiz question data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create lesson quiz question
 * const createMutation = useCreateLessonQuizQuestion();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson quiz question
 * const updateMutation = useUpdateLessonQuizQuestion();
 * await updateMutation.mutateAsync({ id: questionId, data: payload });
 *
 * // Delete lesson quiz question
 * const deleteMutation = useDeleteLessonQuizQuestion();
 * await deleteMutation.mutateAsync(questionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonQuizQuestionKeys } from "./lesson-quiz-questions.keys";
import { lessonQuizQuestionsApi } from "./lesson-quiz-questions.api";
import { LessonQuizQuestion, LessonQuizQuestionCreatePayload, LessonQuizQuestionUpdatePayload } from "../../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new lesson quiz question
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLessonQuizQuestion();
 *
 * const handleSubmit = async (data: LessonQuizQuestionCreatePayload) => {
 *     try {
 *         const question = await mutateAsync(data);
 *         toast.success('Lesson quiz question created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLessonQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonQuizQuestion,
        ApiError,
        LessonQuizQuestionCreatePayload
    >({
        mutationFn: lessonQuizQuestionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizQuestionKeys.all,
            });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson quiz question
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLessonQuizQuestion();
 *
 * const handleUpdate = (data: LessonQuizQuestionUpdatePayload) => {
 *     mutate(
 *         { id: questionId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson quiz question updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLessonQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonQuizQuestion,
        ApiError,
        { id: string; data: LessonQuizQuestionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonQuizQuestionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizQuestionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: lessonQuizQuestionKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson quiz question
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLessonQuizQuestion();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(questionId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson quiz question deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLessonQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonQuizQuestionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: lessonQuizQuestionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: lessonQuizQuestionKeys.detail(id),
            });
        },
    });
}
