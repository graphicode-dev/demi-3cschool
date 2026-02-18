/**
 * Acceptance Exam Questions Feature - Query Hooks
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { acceptanceExamQuestionKeys } from "./acceptance-exam-questions.keys";
import { acceptanceExamQuestionsApi } from "./acceptance-exam-questions.api";
import {
    AcceptanceExamQuestion,
    AcceptanceExamQuestionsListParams,
    AcceptanceExamQuestionsMetadata,
} from "../../../../types/acceptance-exam-questions.types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

export function useAcceptanceExamQuestionsMetadata(
    options?: Partial<UseQueryOptions<AcceptanceExamQuestionsMetadata, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.metadata(),
        queryFn: ({ signal }) => acceptanceExamQuestionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30,
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch questions by exam ID
 */
export function useAcceptanceExamQuestionsByExam(
    examId: string | undefined | null,
    params?: AcceptanceExamQuestionsListParams,
    options?: Partial<
        UseQueryOptions<PaginatedData<AcceptanceExamQuestion>, Error>
    >
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.byExam(examId ?? "", params),
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
            return acceptanceExamQuestionsApi.getByExamId(
                examId,
                params,
                signal
            );
        },
        enabled: !!examId,
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single question by ID
 */
export function useAcceptanceExamQuestion(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<AcceptanceExamQuestion, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamQuestionKeys.detail(id ?? ""),
        queryFn: ({ signal }) =>
            acceptanceExamQuestionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
