/**
 * Level Quiz Questions Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level quiz question data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level quiz question
 * const createMutation = useCreateLevelQuizQuestion();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level quiz question
 * const updateMutation = useUpdateLevelQuizQuestion();
 * await updateMutation.mutateAsync({ id: questionId, data: payload });
 *
 * // Delete level quiz question
 * const deleteMutation = useDeleteLevelQuizQuestion();
 * await deleteMutation.mutateAsync(questionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { levelQuizQuestionKeys } from "./level-quiz-questions.keys";
import { levelQuizQuestionsApi } from "./level-quiz-questions.api";
import { LevelQuizQuestion, LevelQuizQuestionCreatePayload, LevelQuizQuestionUpdatePayload } from "../../types/level-quiz-questions.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new level quiz question
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLevelQuizQuestion();
 *
 * const handleSubmit = async (data: LevelQuizQuestionCreatePayload) => {
 *     try {
 *         const questions = await mutateAsync(data);
 *         toast.success('Level quiz question created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLevelQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelQuizQuestion[],
        ApiError,
        LevelQuizQuestionCreatePayload
    >({
        mutationFn: levelQuizQuestionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: levelQuizQuestionKeys.all,
            });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing level quiz question
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLevelQuizQuestion();
 *
 * const handleUpdate = (data: LevelQuizQuestionUpdatePayload) => {
 *     mutate(
 *         { id: questionId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Level quiz question updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLevelQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelQuizQuestion,
        ApiError,
        { id: string; data: LevelQuizQuestionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => levelQuizQuestionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: levelQuizQuestionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: levelQuizQuestionKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a level quiz question
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLevelQuizQuestion();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(questionId, {
 *             onSuccess: () => {
 *                 toast.success('Level quiz question deleted');
 *                 navigate('/level-quiz-questions');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLevelQuizQuestion() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => levelQuizQuestionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: levelQuizQuestionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: levelQuizQuestionKeys.detail(id),
            });
        },
    });
}
