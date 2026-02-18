/**
 * Acceptance Exam Questions Feature - Mutation Hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamQuestionKeys } from "./acceptance-exam-questions.keys";
import { acceptanceExamQuestionsApi } from "./acceptance-exam-questions.api";
import {
    AcceptanceExamQuestion,
    AcceptanceExamQuestionCreatePayload,
    AcceptanceExamQuestionUpdatePayload,
} from "../../../../types/acceptance-exam-questions.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

export function useCreateAcceptanceExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamQuestion,
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

export function useUpdateAcceptanceExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation<
        AcceptanceExamQuestion,
        ApiError,
        { id: string; data: AcceptanceExamQuestionUpdatePayload }
    >({
        mutationFn: ({ id, data }) =>
            acceptanceExamQuestionsApi.update(id, data),
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
