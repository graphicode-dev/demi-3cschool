/**
 * Acceptance Exams Feature - Query Hooks
 *
 * TanStack Query hooks for reading acceptance exam data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get acceptance exams metadata
 * const { data: metadata } = useAcceptanceExamsMetadata();
 *
 * // List all acceptance exams
 * const { data, isLoading } = useAcceptanceExamsList({ page: 1 });
 *
 * // Get single acceptance exam
 * const { data: acceptanceExam } = useAcceptanceExam(acceptanceExamId);
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { acceptanceExamKeys } from "./acceptance-exams.keys";
import { acceptanceExamApi } from "./acceptance-exams.api";
import {
    AcceptanceExamsListParams,
    AcceptanceExamsMetadata,
} from "../../../../types/acceptance-exams.types";
import { AcceptanceExam } from "../../../../types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch acceptance exams metadata (filters, operators, field types)
 */
export function useAcceptanceExamsMetadata(
    options?: Partial<UseQueryOptions<AcceptanceExamsMetadata, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamKeys.metadata(),
        queryFn: ({ signal }) => acceptanceExamApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30,
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of acceptance exams
 */
export function useAcceptanceExamsList(
    params?: AcceptanceExamsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExam>, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamKeys.list(params),
        queryFn: ({ signal }) => acceptanceExamApi.getList(params, signal),
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single acceptance exam by ID
 */
export function useAcceptanceExam(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<AcceptanceExam, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamKeys.detail(id ?? ""),
        queryFn: ({ signal }) => acceptanceExamApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
