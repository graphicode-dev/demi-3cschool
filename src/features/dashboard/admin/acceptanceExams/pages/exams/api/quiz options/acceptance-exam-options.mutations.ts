/**
 * Level Quiz Options Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level quiz option data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level quiz option(s)
 * const createMutation = useCreateAcceptanceExamOption();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level quiz option
 * const updateMutation = useUpdateAcceptanceExamOption();
 * await updateMutation.mutateAsync({ id: optionId, data: payload });
 *
 * // Delete level quiz option
 * const deleteMutation = useDeleteAcceptanceExamOption();
 * await deleteMutation.mutateAsync(optionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamOptionKeys } from "./acceptance-exam-options.keys";
import { acceptanceExamOptionsApi } from "./acceptance-exam-options.api";
import { AcceptanceExamOption, AcceptanceExamOptionCreatePayload, AcceptanceExamOptionUpdatePayload } from "../../../../types/acceptance-exam-options.types";
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
 * const { mutate, mutateAsync, isPending, error } = useCreateAcceptanceExamOption();
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
export function useCreateAcceptanceExamOption() {
    const queryClient = useQueryClient();

    return useMutation<AcceptanceExamOption[], ApiError, AcceptanceExamOptionCreatePayload>({
        mutationFn: acceptanceExamOptionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.all,
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
 * const { mutate, isPending } = useUpdateAcceptanceExamOption();
 *
 * const handleUpdate = (data: AcceptanceExamOptionUpdatePayload) => {
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
export function useUpdateAcceptanceExamOption() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamOption,
        ApiError,
        { id: string; data: AcceptanceExamOptionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => acceptanceExamOptionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.detail(variables.id),
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
 * const { mutate, isPending } = useDeleteAcceptanceExamOption();
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
export function useDeleteAcceptanceExamOption() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => acceptanceExamOptionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamOptionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: acceptanceExamOptionKeys.detail(id),
            });
        },
    });
}
