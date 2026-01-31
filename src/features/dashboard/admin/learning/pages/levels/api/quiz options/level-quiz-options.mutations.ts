/**
 * Level Quiz Options Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level quiz option data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level quiz option(s)
 * const createMutation = useCreateLevelQuizOption();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level quiz option
 * const updateMutation = useUpdateLevelQuizOption();
 * await updateMutation.mutateAsync({ id: optionId, data: payload });
 *
 * // Delete level quiz option
 * const deleteMutation = useDeleteLevelQuizOption();
 * await deleteMutation.mutateAsync(optionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { levelQuizOptionKeys } from "./level-quiz-options.keys";
import { levelQuizOptionsApi } from "./level-quiz-options.api";
import { LevelQuizOption, LevelQuizOptionCreatePayload, LevelQuizOptionUpdatePayload } from "../../types/level-quiz-options.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create level quiz option(s)
 * Supports both single option and multiple options payload
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateLevelQuizOption();
 *
 * // Single option
 * const handleSubmitSingle = async () => {
 *     await mutateAsync({
 *         question_id: '1',
 *         option_text: 'Option A',
 *         is_correct: true,
 *         order: 1,
 *     });
 * };
 *
 * // Multiple options
 * const handleSubmitMultiple = async () => {
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
export function useCreateLevelQuizOption() {
    const queryClient = useQueryClient();

    return useMutation<LevelQuizOption[], ApiError, LevelQuizOptionCreatePayload>({
        mutationFn: levelQuizOptionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: levelQuizOptionKeys.all,
            });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing level quiz option
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateLevelQuizOption();
 *
 * const handleUpdate = (data: LevelQuizOptionUpdatePayload) => {
 *     mutate(
 *         { id: optionId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Level quiz option updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateLevelQuizOption() {
    const queryClient = useQueryClient();

    return useMutation<
        LevelQuizOption,
        ApiError,
        { id: string; data: LevelQuizOptionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => levelQuizOptionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: levelQuizOptionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: levelQuizOptionKeys.detail(variables.id),
            });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete a level quiz option
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteLevelQuizOption();
 *
 * const handleDelete = () => {
 *     if (confirm('Are you sure?')) {
 *         mutate(optionId, {
 *             onSuccess: () => {
 *                 toast.success('Level quiz option deleted');
 *             },
 *         });
 *     }
 * };
 * ```
 */
export function useDeleteLevelQuizOption() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => levelQuizOptionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: levelQuizOptionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: levelQuizOptionKeys.detail(id),
            });
        },
    });
}
