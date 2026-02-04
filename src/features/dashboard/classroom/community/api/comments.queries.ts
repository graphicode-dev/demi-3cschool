/**
 * Comments Feature - Query Hooks
 *
 * TanStack Query hooks for reading comment data.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { commentKeys } from "./community.keys";
import { commentsApi } from "./comments.api";
import type { Comment } from "./community.types";

/**
 * Hook to fetch comments for a post
 */
export function usePostComments(
    postId: number | undefined | null,
    options?: Partial<UseQueryOptions<Comment[], Error>>
) {
    return useQuery({
        queryKey: commentKeys.byPost(postId ?? 0),
        queryFn: ({ signal }) => commentsApi.getByPost(postId!, signal),
        enabled: !!postId,
        ...options,
    });
}
