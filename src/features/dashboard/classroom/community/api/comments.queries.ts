/**
 * Comments Feature - Query Hooks
 *
 * TanStack Query hooks for reading comment data.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { commentKeys } from "./community.keys";
import { commentsApi } from "./comments.api";
import { transformComments } from "./community.transformers";
import type { Comment as UiComment } from "../types";

/**
 * Hook to fetch comments for a post
 */
export function usePostComments(
    postId: number | undefined | null,
    options?: Partial<UseQueryOptions<UiComment[], Error>>
) {
    return useQuery({
        queryKey: commentKeys.byPost(postId ?? 0),
        queryFn: async ({ signal }) => {
            const apiComments = await commentsApi.getByPost(postId!, signal);
            return transformComments(apiComments);
        },
        enabled: !!postId,
        ...options,
    });
}
