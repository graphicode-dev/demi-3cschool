/**
 * Posts Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing post data.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./community.keys";
import { postsApi } from "./posts.api";
import type {
    Post,
    PostCreatePayload,
    PostUpdatePayload,
    ReactPayload,
    ReactResponse,
    PollVotePayload,
} from "./community.types";
import type { ApiError } from "@/shared/api";

/**
 * Hook to create a new post
 */
export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation<Post, ApiError, PostCreatePayload>({
        mutationFn: postsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: postKeys.all });
        },
    });
}

/**
 * Hook to update a post
 */
export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation<Post, ApiError, { id: number; data: PostUpdatePayload }>(
        {
            mutationFn: ({ id, data }) => postsApi.update(id, data),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: postKeys.lists() });
                queryClient.invalidateQueries({
                    queryKey: postKeys.detail(variables.id),
                });
            },
        }
    );
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => postsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: postKeys.all });
            queryClient.removeQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

/**
 * Hook to react to a post
 */
export function useReactToPost() {
    const queryClient = useQueryClient();

    return useMutation<
        ReactResponse,
        ApiError,
        { id: number; data: ReactPayload }
    >({
        mutationFn: ({ id, data }) => postsApi.react(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to save a post
 */
export function useSavePost() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => postsApi.save(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.saved() });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

/**
 * Hook to unsave a post
 */
export function useUnsavePost() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => postsApi.unsave(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.saved() });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

/**
 * Hook to pin a post (Admin)
 */
export function usePinPost() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => postsApi.pin(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

/**
 * Hook to unpin a post (Admin)
 */
export function useUnpinPost() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => postsApi.unpin(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
        },
    });
}

/**
 * Hook to vote on a poll
 */
export function useVoteOnPoll() {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        ApiError,
        { postId: number; data: PollVotePayload }
    >({
        mutationFn: ({ postId, data }) => postsApi.vote(postId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: postKeys.detail(variables.postId),
            });
        },
    });
}
