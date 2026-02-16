/**
 * Level Quiz Questions Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing level quiz question data.
 * All mutations automatically invalidate relevant queries.
 *
 * @example
 * ```tsx
 * // Create level quiz question
 * const createMutation = useCreateAcceptanceExamQuestion();
 * await createMutation.mutateAsync(payload);
 *
 * // Update level quiz question
 * const updateMutation = useUpdateAcceptanceExamQuestion();
 * await updateMutation.mutateAsync({ id: questionId, data: payload });
 *
 * // Delete level quiz question
 * const deleteMutation = useDeleteAcceptanceExamQuestion();
 * await deleteMutation.mutateAsync(questionId);
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamQuestionKeys } from "./acceptance-exam-questions.keys";
import { acceptanceExamQuestionsApi } from "./acceptance-exam-questions.api";
import { AcceptanceExamQuestion, AcceptanceExamQuestionCreatePayload, AcceptanceExamQuestionUpdatePayload } from "../../../../types/acceptance-exam-questions.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new level quiz question
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateAcceptanceExamQuestion();
 *
 * const handleSubmit = async (data: AcceptanceExamQuestionCreatePayload) => {
 *     try {
 *         const questions = await mutateAsync(data);
 *         toast.success('Level quiz question created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateAcceptanceExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamQuestion[],
        ApiError,
        AcceptanceExamQuestionCreatePayload
    >({
        mutationFn: acceptanceExamQuestionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamQuestionKeys.all,
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
 * const { mutate, isPending } = useUpdateAcceptanceExamQuestion();
 *
 * const handleUpdate = (data: AcceptanceExamQuestionUpdatePayload) => {
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
export function useUpdateAcceptanceExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamQuestion,
        ApiError,
        { id: string; data: AcceptanceExamQuestionUpdatePayload }
    >({
        mutationFn: ({ id, data }) => acceptanceExamQuestionsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamQuestionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: acceptanceExamQuestionKeys.detail(variables.id),
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
 * const { mutate, isPending } = useDeleteAcceptanceExamQuestion();
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
export function useDeleteAcceptanceExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (id) => acceptanceExamQuestionsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamQuestionKeys.all,
            });
            queryClient.removeQueries({
                queryKey: acceptanceExamQuestionKeys.detail(id),
            });
        },
    });
}
