/**
 * Level Quiz Options Feature - Query Hooks
 *
 * TanStack Query hooks for reading level quiz option data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get level quiz options metadata
 * const { data: metadata } = useLevelQuizOptionsMetadata();
 *
 * // List all level quiz options with pagination
 * const { data, isLoading } = useLevelQuizOptionsList({ page: 1 });
 *
 * // Get single level quiz option
 * const { data: option } = useLevelQuizOption(optionId);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { levelQuizOptionKeys } from "./level-quiz-options.keys";
import { levelQuizOptionsApi } from "./level-quiz-options.api";
import {
    LevelQuizOption,
    LevelQuizOptionsListParams,
    LevelQuizOptionsMetadata,
} from "../../types/level-quiz-options.types";
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
 * const { data: metadata, isLoading } = useLevelQuizOptionsMetadata();
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
export function useLevelQuizOptionsMetadata(
    options?: Partial<UseQueryOptions<LevelQuizOptionsMetadata, Error>>
) {
    return useQuery({
        queryKey: levelQuizOptionKeys.metadata(),
        queryFn: ({ signal }) => levelQuizOptionsApi.getMetadata(signal),
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
 * const { data, isLoading, error } = useLevelQuizOptionsList({ page: 1 });
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
export function useLevelQuizOptionsList(
    params?: LevelQuizOptionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LevelQuizOption>, Error>>
) {
    return useQuery({
        queryKey: levelQuizOptionKeys.list(params),
        queryFn: ({ signal }) => levelQuizOptionsApi.getList(params, signal),
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
 * const { data, isLoading, error } = useLevelQuizOptionsByQuestion(questionId, { page: 1 });
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
export function useLevelQuizOptionsByQuestion(
    questionId: string | undefined | null,
    params?: LevelQuizOptionsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LevelQuizOption>, Error>>
) {
    return useQuery({
        queryKey: levelQuizOptionKeys.byQuestion(questionId ?? "", params),
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
            return levelQuizOptionsApi.getByQuestionId(
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
 * } = useLevelQuizOptionsInfinite();
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
export function useLevelQuizOptionsInfinite() {
    return useInfiniteQuery({
        queryKey: levelQuizOptionKeys.infinite(),
        queryFn: ({ pageParam, signal }) =>
            levelQuizOptionsApi.getList({ page: pageParam as number }, signal),
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
 * const { data: option, isLoading, error } = useLevelQuizOption(optionId);
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
export function useLevelQuizOption(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LevelQuizOption, Error>>
) {
    return useQuery({
        queryKey: levelQuizOptionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => levelQuizOptionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
