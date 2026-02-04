/**
 * Channels Feature - Mutation Hooks
 *
 * TanStack Query hooks for writing channel data.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { channelKeys } from "./community.keys";
import { channelsApi } from "./channels.api";
import type {
    Channel,
    ChannelCreatePayload,
    ChannelUpdatePayload,
    AddAdminPayload,
} from "./community.types";
import type { ApiError } from "@/shared/api";

/**
 * Hook to create a new channel
 */
export function useCreateChannel() {
    const queryClient = useQueryClient();

    return useMutation<Channel, ApiError, ChannelCreatePayload>({
        mutationFn: channelsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: channelKeys.all });
        },
    });
}

/**
 * Hook to update a channel
 */
export function useUpdateChannel() {
    const queryClient = useQueryClient();

    return useMutation<
        Channel,
        ApiError,
        { id: number; data: ChannelUpdatePayload }
    >({
        mutationFn: ({ id, data }) => channelsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: channelKeys.detail(variables.id),
            });
        },
    });
}

/**
 * Hook to delete a channel
 */
export function useDeleteChannel() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => channelsApi.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: channelKeys.all });
            queryClient.removeQueries({ queryKey: channelKeys.detail(id) });
        },
    });
}

/**
 * Hook to follow a channel
 */
export function useFollowChannel() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => channelsApi.follow(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: channelKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: channelKeys.myChannels(),
            });
        },
    });
}

/**
 * Hook to unfollow a channel
 */
export function useUnfollowChannel() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, number>({
        mutationFn: (id) => channelsApi.unfollow(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: channelKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: channelKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: channelKeys.myChannels(),
            });
        },
    });
}

/**
 * Hook to add admin to a channel
 */
export function useAddChannelAdmin() {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        ApiError,
        { channelId: number; data: AddAdminPayload }
    >({
        mutationFn: ({ channelId, data }) =>
            channelsApi.addAdmin(channelId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: channelKeys.detail(variables.channelId),
            });
        },
    });
}

/**
 * Hook to remove admin from a channel
 */
export function useRemoveChannelAdmin() {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        ApiError,
        { channelId: number; data: AddAdminPayload }
    >({
        mutationFn: ({ channelId, data }) =>
            channelsApi.removeAdmin(channelId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: channelKeys.detail(variables.channelId),
            });
        },
    });
}
