/**
 * Channels Feature - Query Hooks
 *
 * TanStack Query hooks for reading channel data.
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { channelKeys } from "./community.keys";
import { channelsApi } from "./channels.api";
import type { Channel, ChannelsListParams } from "./community.types";
import type { PaginatedData } from "@/shared/api";

/**
 * Hook to fetch list of channels (paginated)
 */
export function useChannelsList(
    params?: ChannelsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<Channel>, Error>>
) {
    return useQuery({
        queryKey: channelKeys.list(params),
        queryFn: ({ signal }) => channelsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch my followed channels
 */
export function useMyChannels(
    options?: Partial<UseQueryOptions<Channel[], Error>>
) {
    return useQuery({
        queryKey: channelKeys.myChannels(),
        queryFn: ({ signal }) => channelsApi.getMyChannels(signal),
        ...options,
    });
}

/**
 * Hook to fetch single channel by ID
 */
export function useChannel(
    id: number | undefined | null,
    options?: Partial<UseQueryOptions<Channel, Error>>
) {
    return useQuery({
        queryKey: channelKeys.detail(id ?? 0),
        queryFn: ({ signal }) => channelsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to fetch infinite list of channels (for infinite scroll)
 */
export function useChannelsInfinite(params?: Omit<ChannelsListParams, "page">) {
    return useInfiniteQuery({
        queryKey: [...channelKeys.lists(), "infinite", params],
        queryFn: ({ pageParam, signal }) =>
            channelsApi.getList(
                { ...params, page: pageParam as number },
                signal
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const { currentPage, lastPage: totalPages } = lastPage;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
    });
}
