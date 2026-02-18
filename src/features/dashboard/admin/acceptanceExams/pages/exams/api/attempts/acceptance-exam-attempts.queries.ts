/**
 * Acceptance Exam Attempts Feature - Query Hooks
 */

import {
    useQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { acceptanceExamAttemptKeys } from "./acceptance-exam-attempts.keys";
import { acceptanceExamAttemptsApi } from "./acceptance-exam-attempts.api";
import {
    AcceptanceExamAttempt,
    AcceptanceExamAttemptsListParams,
} from "../../../../types/acceptance-exam-attempts.types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// My Attempts Query
// ============================================================================

/**
 * Hook to fetch current user's attempts
 */
export function useMyAcceptanceExamAttempts(
    options?: Partial<UseQueryOptions<AcceptanceExamAttempt[], Error>>
) {
    return useQuery({
        queryKey: acceptanceExamAttemptKeys.myAttempts(),
        queryFn: ({ signal }) => acceptanceExamAttemptsApi.getMyAttempts(signal),
        ...options,
    });
}

// ============================================================================
// Exam History Query
// ============================================================================

/**
 * Hook to fetch attempt history for an exam
 */
export function useAcceptanceExamAttemptHistory(
    examId: string | undefined | null,
    params?: AcceptanceExamAttemptsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExamAttempt>, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamAttemptKeys.examHistory(examId ?? "", params),
        queryFn: ({ signal }) => {
            if (!examId) {
                return Promise.resolve({
                    items: [],
                    currentPage: 1,
                    perPage: 0,
                    lastPage: 1,
                    nextPageUrl: null,
                });
            }
            return acceptanceExamAttemptsApi.getExamHistory(examId, params, signal);
        },
        enabled: !!examId,
        ...options,
    });
}

// ============================================================================
// Result Query
// ============================================================================

/**
 * Hook to fetch attempt result
 */
export function useAcceptanceExamAttemptResult(
    attemptId: string | undefined | null,
    options?: Partial<UseQueryOptions<AcceptanceExamAttempt, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamAttemptKeys.result(attemptId ?? ""),
        queryFn: ({ signal }) => acceptanceExamAttemptsApi.getResult(attemptId!, signal),
        enabled: !!attemptId,
        ...options,
    });
}
