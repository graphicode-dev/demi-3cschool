/**
 * Level Quiz Options Feature - Query Hooks
 *
 * TanStack Query hooks for reading level quiz option data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get level quiz options metadata
 * const { data: metadata } = useAcceptanceExamOptionsMetadata();
 *
 * // List all level quiz options with pagination
 * const { data, isLoading } = useAcceptanceExamOptionsList({ page: 1 });
 *
 * // Get single level quiz option
 * const { data: option } = useAcceptanceExamOption(optionId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
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

/**
 * Hook to fetch level quiz options metadata (filters, operators, field types)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useAcceptanceExamOptionsMetadata();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *     <FilterBuilder
 *         filters={metadata.filters}
 *         operators={metadata.operators}
 *     />
 * );
 * ```
 */
export function useAcceptanceExamOptionsMetadata(
    options?: Partial<UseQueryOptions<AcceptanceExamOptionsMetadata, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamOptionKeys.metadata(),
        queryFn: ({ signal }) => acceptanceExamOptionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch paginated list of all level quiz options
 *
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAcceptanceExamOptionsList({ page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(option => (
 *             <li key={option.id}>{option.optionText}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useAcceptanceExamOptionsList(
    params?: AcceptanceExamOptionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExamOption>, Error>>
) {
    return useQuery({
        queryKey: acceptanceExamOptionKeys.list(params),
        queryFn: ({ signal }) => acceptanceExamOptionsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of level quiz options by question ID
 *
 * @param questionId - Question ID to fetch options for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useAcceptanceExamOptionsByQuestion(questionId, { page: 1 });
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data.items.map(option => (
 *             <li key={option.id}>{option.optionText}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useAcceptanceExamOptionsByQuestion(
    questionId: string | undefined | null,
    params?: AcceptanceExamOptionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<AcceptanceExamOption>, Error>>
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

/**
 * Hook to fetch infinite list of all level quiz options (for infinite scroll)
 *
 * @example
 * ```tsx
 * const {
 *     data,
 *     fetchNextPage,
 *     hasNextPage,
 *     isFetchingNextPage,
 * } = useAcceptanceExamOptionsInfinite();
 *
 * return (
 *     <>
 *         {data?.pages.map(page =>
 *             page.items.map(option => <OptionCard key={option.id} option={option} />)
 *         )}
 *         {hasNextPage && (
 *             <button onClick={() => fetchNextPage()}>
 *                 {isFetchingNextPage ? 'Loading...' : 'Load More'}
 *             </button>
 *         )}
 *     </>
 * );
 * ```
 */
export function useAcceptanceExamOptionsInfinite() {
    return useInfiniteQuery({
        queryKey: acceptanceExamOptionKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            acceptanceExamOptionsApi.getList({ page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single level quiz option by ID
 *
 * @param id - Level Quiz Option ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: option, isLoading, error } = useAcceptanceExamOption(optionId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <p>{option.optionText}</p>
 *         <p>Correct: {option.isCorrect ? 'Yes' : 'No'}</p>
 *     </div>
 * );
 * ```
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
