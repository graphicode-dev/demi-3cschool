/**
 * Acceptance Exam Options Feature - Query Hooks
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { acceptanceExamOptionKeys } from "./acceptance-exam-options.keys";
import { acceptanceExamOptionsApi } from "./acceptance-exam-options.api";
import {
    AcceptanceExamOption,
    AcceptanceExamOptionsListParams,
    AcceptanceExamOptionsMetadata,
} from "../../../../types/acceptance-exam-options.types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

export function useAcceptanceExamOptionsMetadata(
    options?: Partial<UseQueryOptions<AcceptanceExamOptionsMetadata, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamOptionKeys.metadata(),
        queryFn: ({ signal }) => acceptanceExamOptionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30,
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch options by question ID
 */
export function useAcceptanceExamOptionsByQuestion(
    questionId: string | undefined | null,
    params?: AcceptanceExamOptionsListParams,
    options?: Partial<
        UseQueryOptions<PaginatedData<AcceptanceExamOption>, Error>
    >
) {
    return useQuery({
        queryKey: acceptanceExamOptionKeys.byQuestion(questionId ?? "", params),
        queryFn: ({ signal }) => {
            if (!questionId) {
                return Promise.resolve({
                    items: [],
                    currentPage: 1,
                    perPage: 0,
                    lastPage: 1,
                    nextPageUrl: null,
                });
            }
            return acceptanceExamOptionsApi.getByQuestionId(
                questionId,
                params,
                signal
            );
        },
        enabled: !!questionId,
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single option by ID
 */
export function useAcceptanceExamOption(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<AcceptanceExamOption, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamOptionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => acceptanceExamOptionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
