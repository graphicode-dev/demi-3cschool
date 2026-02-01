/**
 * Level Quizzes Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level quiz data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level quiz
 * const createMutation = useCreateLevelQuiz();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level quiz
 * const updateMutation = useUpdateLevelQuiz();
 * await updateMutation.mutateAsync({ id: quizId, data: payload });
 *
 * // Delete level quiz
 * const deleteMutation = useDeleteLevelQuiz();
 * await deleteMutation.mutateAsync(quizId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { levelQuizKeys } from "./level-quizzes.keys";
import { levelQuizzesApi } from "./level-quizzes.api";
import { LevelQuiz } from "../../types";
import {
    LevelQuizCreatePayload,
    LevelQuizUpdatePayload,
} from "../../types/level-quizzes.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new level quiz
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLevelQuiz();
 *
 * const handleSubmit = async (data: LevelQuizCreatePayload) => {
 *     try {
 *         const quizzes = await mutateAsync(data);
 *         toast.success('Level quiz created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateLevelQuiz() {
    const queryClient = useQueryClient();

    return useMutation<LevelQuiz, ApiError, LevelQuizCreatePayload>({
        mutationFn: levelQuizzesApi.create,
        onSuccess: (newQuiz) => {
            queryClient.invalidateQueries({ queryKey: levelQuizKeys.all });
            if (newQuiz.level?.id) {
                queryClient.invalidateQueries({
                    queryKey: levelQuizKeys.byLevel(String(newQuiz.level.id)),
                });
            }
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing level quiz
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLevelQuiz();
 *
 * const handleUpdate = (data: LevelQuizUpdatePayload) => {
 *     mutate(
 *         { id: quizId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Level quiz updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLevelQuiz() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelQuiz,
        ApiError,
        { id: string; data: LevelQuizUpdatePayload }
    >({
        mutationFn: ({ id, data }) => levelQuizzesApi.update(id, data),
        onSuccess: (updatedQuiz, variables) => {
            queryClient.invalidateQueries({ queryKey: levelQuizKeys.all });
            queryClient.invalidateQueries({
                queryKey: levelQuizKeys.detail(variables.id),
            });
            if (updatedQuiz.level?.id) {
                queryClient.invalidateQueries({
                    queryKey: levelQuizKeys.byLevel(
                        String(updatedQuiz.level.id)
                    ),
                });
            }
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a level quiz
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLevelQuiz();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(quizId, {
 *             onSuccess: () => {
 *                 toast.success('Level quiz deleted');
 *                 navigate('/level-quizzes');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLevelQuiz() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => levelQuizzesApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: levelQuizKeys.all });
            queryClient.removeQueries({ queryKey: levelQuizKeys.detail(id) });
        },
    });
}
