/**
 * Acceptance Exam Attempts Feature - Mutation Hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptanceExamAttemptKeys } from "./acceptance-exam-attempts.keys";
import { acceptanceExamAttemptsApi } from "./acceptance-exam-attempts.api";
import {
    AcceptanceExamAttempt,
    AcceptanceExamAttemptAnswerPayload,
} from "../../../../types/acceptance-exam-attempts.types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Start Attempt Mutation
// ============================================================================

export function useStartAcceptanceExamAttempt() {
    const queryClient = useQueryClient();

    return useMutation<AcceptanceExamAttempt, ApiError, string>({
        mutationFn: (examId) => acceptanceExamAttemptsApi.start(examId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamAttemptKeys.all,
            });
        },
    });
}

// ============================================================================
// Answer Question Mutation
// ============================================================================

export function useAnswerAcceptanceExamQuestion() {
    return useMutation<
        void,
        ApiError,
        { attemptId: string; questionId: string; data: AcceptanceExamAttemptAnswerPayload }
    >({
        mutationFn: ({ attemptId, questionId, data }) =>
            acceptanceExamAttemptsApi.answer(attemptId, questionId, data),
    });
}

// ============================================================================
// Complete Attempt Mutation
// ============================================================================

export function useCompleteAcceptanceExamAttempt() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: (attemptId) => acceptanceExamAttemptsApi.complete(attemptId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: acceptanceExamAttemptKeys.all,
            });
        },
    });
}
