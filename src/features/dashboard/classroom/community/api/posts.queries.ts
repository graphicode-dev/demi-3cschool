/**
 * Posts Feature - Query Hooks
 *
 * TanStack Query hooks for reading post data.
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { postKeys } from "./community.keys";
import { postsApi } from "./posts.api";
import type { Post, PostDetail, PostsListParams } from "./community.types";
import type { PaginatedData } from "@/shared/api";

/**
 * Hook to fetch feed (list of posts)
 */
export function usePostsList(
    params?: PostsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<Post>, Error>>
) {
    return useQuery({
        queryKey: postKeys.list(params),
        queryFn: ({ signal }) => postsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch saved posts
 */
export function useSavedPosts(
    options?: Partial<UseQueryOptions<PaginatedData<Post>, Error>>
) {
    return useQuery({
        queryKey: postKeys.saved(),
        queryFn: ({ signal }) => postsApi.getSaved(signal),
        ...options,
    });
}

/**
 * Hook to fetch my posts
 */
export function useMyPosts(
    options?: Partial<UseQueryOptions<PaginatedData<Post>, Error>>
) {
    return useQuery({
        queryKey: postKeys.myPosts(),
        queryFn: ({ signal }) => postsApi.getMyPosts(signal),
        ...options,
    });
}

/**
 * Hook to fetch single post by ID (includes comments)
 */
export function usePost(
    id: number | undefined | null,
    options?: Partial<UseQueryOptions<PostDetail, Error>>
) {
    return useQuery({
        queryKey: postKeys.detail(id ?? 0),
        queryFn: ({ signal }) => postsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of posts (for infinite scroll)
 */
export function usePostsInfinite(params?: Omit<PostsListParams, "page">) {
    return useInfiniteQuery({
        queryKey: postKeys.infinite(params),
        queryFn: ({ pageParam, signal }) =>
            postsApi.getList({ ...params, page: pageParam as number }, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}
