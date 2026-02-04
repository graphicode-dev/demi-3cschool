/**
 * Comments Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing comment data.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentKeys, postKeys } from "./community.keys";
import { commentsApi } from "./comments.api";
import type {
    Comment,
    CommentCreatePayload,
    CommentUpdatePayload,
    ReactPayload,
    ReactResponse,
} from "./community.types";
import type { ApiError } from "@/shared/api";

/**
 * Hook to create a comment on a post
 */
export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation<
        Comment,
        ApiError,
        { postId: number; data: CommentCreatePayload }
    >({
        mutationFn: ({ postId, data }) => commentsApi.create(postId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

/**
 * Hook to update a comment
 */
export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation<
        Comment,
        ApiError,
        { id: number; postId: number; data: CommentUpdatePayload }
    >({
        mutationFn: ({ id, data }) => commentsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
        },
    });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, { id: number; postId: number }>({
        mutationFn: ({ id }) => commentsApi.delete(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

/**
 * Hook to react to a comment
 */
export function useReactToComment() {
    const queryClient = useQueryClient();

    return useMutation<
        ReactResponse,
        ApiError,
        { id: number; postId: number; data: ReactPayload }
    >({
        mutationFn: ({ id, data }) => commentsApi.react(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
        },
    });
}

/**
 * Hook to mark comment as solution
 */
export function useMarkCommentSolution() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, { id: number; postId: number }>({
        mutationFn: ({ id }) => commentsApi.markSolution(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}

/**
 * Hook to unmark comment as solution
 */
export function useUnmarkCommentSolution() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, { id: number; postId: number }>({
        mutationFn: ({ id }) => commentsApi.unmarkSolution(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: commentKeys.byPost(variables.postId),
            });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
        },
    });
}
