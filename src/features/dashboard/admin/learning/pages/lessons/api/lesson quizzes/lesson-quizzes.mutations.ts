/**
 * Lesson Quizzes Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing lesson quiz data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create lesson quiz
 * const createMutation = useCreateLessonQuiz();
 * await createMutation.mutateAsync(payload);
 *
 * // Update lesson quiz
 * const updateMutation = useUpdateLessonQuiz();
 * await updateMutation.mutateAsync({ id: quizId, data: payload });
 *
 * // Delete lesson quiz
 * const deleteMutation = useDeleteLessonQuiz();
 * await deleteMutation.mutateAsync(quizId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonQuizKeys } from "./lesson-quizzes.keys";
import { lessonQuizzesApi } from "./lesson-quizzes.api";
import { LessonQuiz, LessonQuizCreatePayload, LessonQuizUpdatePayload } from "../../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new lesson quiz
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLessonQuiz();
 *
 * const handleSubmit = async (data: LessonQuizCreatePayload) => {
 *     try {
 *         const quiz = await mutateAsync(data);
 *         toast.success('Lesson quiz created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLessonQuiz() {
    const queryClient = useQueryClient();

    return useMutation<LessonQuiz, ApiError, LessonQuizCreatePayload>({
        mutationFn: lessonQuizzesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lessonQuizKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing lesson quiz
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLessonQuiz();
 *
 * const handleUpdate = (data: LessonQuizUpdatePayload) => {
 *     mutate(
 *         { id: quizId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Lesson quiz updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLessonQuiz() {
    const queryClient = useQueryClient();

    return useMutation<
        LessonQuiz,
        ApiError,
        { id: string; data: LessonQuizUpdatePayload }
    >({
        mutationFn: ({ id, data }) => lessonQuizzesApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: lessonQuizKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: lessonQuizKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a lesson quiz
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLessonQuiz();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(quizId, {
 *             onSuccess: () => {
 *                 toast.success('Lesson quiz deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLessonQuiz() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => lessonQuizzesApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: lessonQuizKeys.all });
            queryClient.removeQueries({ queryKey: lessonQuizKeys.detail(id) });
        },
    });
}
