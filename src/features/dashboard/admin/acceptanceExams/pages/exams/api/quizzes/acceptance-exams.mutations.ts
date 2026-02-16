/**
 * Level Quizzes Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level quiz data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level quiz
 * const createMutation = useCreateAcceptanceExam();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level quiz
 * const updateMutation = useUpdateAcceptanceExam();
 * await updateMutation.mutateAsync({ id: quizId, data: payload });
 *
 * // Delete level quiz
 * const deleteMutation = useDeleteAcceptanceExam();
 * await deleteMutation.mutateAsync(quizId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamKeys } from "./acceptance-exams.keys";
import { acceptanceExamApi } from "./acceptance-exams.api";
import { AcceptanceExam } from "../../../../types";
import {
    AcceptanceExamCreatePayload,
    AcceptanceExamUpdatePayload,
} from "../../../../types/acceptance-exams.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new level quiz
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateAcceptanceExam();
 *
 * const handleSubmit = async (data: AcceptanceExamCreatePayload) => {
 *     try {
 *         const quizzes = await mutateAsync(data);
 *         toast.success('Level quiz created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateAcceptanceExam() {
    const queryClient = useQueryClient();

    return useMutation<AcceptanceExam, ApiError, AcceptanceExamCreatePayload>({
        mutationFn: acceptanceExamApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.all });
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
 * const { mutate, isPending } = useUpdateAcceptanceExam();
 *
 * const handleUpdate = (data: AcceptanceExamUpdatePayload) => {
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
export function useUpdateAcceptanceExam() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExam,
        ApiError,
        { id: string; data: AcceptanceExamUpdatePayload }
    >({
        mutationFn: ({ id, data }) => acceptanceExamApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: acceptanceExamKeys.detail(variables.id),
            });
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
 * const { mutate, isPending } = useDeleteAcceptanceExam();
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
export function useDeleteAcceptanceExam() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => acceptanceExamApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.all });
            queryClient.removeQueries({ queryKey: acceptanceExamKeys.detail(id) });
        },
    });
}
