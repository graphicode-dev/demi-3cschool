/**
 * Community Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

import type {
    ChannelsListParams,
    PostsListParams,
    ReportsListParams,
} from "./community.types";

// ============================================================================
// Channels Keys
// ============================================================================

export const channelKeys = {
    all: ["channels"] as const,
    lists: () => [...channelKeys.all, "list"] as const,
    list: (params?: ChannelsListParams) =>
        params
            ? ([...channelKeys.lists(), params] as const)
            : channelKeys.lists(),
    myChannels: () => [...channelKeys.all, "my-channels"] as const,
    details: () => [...channelKeys.all, "detail"] as const,
    detail: (id: number) => [...channelKeys.details(), id] as const,
};

// ============================================================================
// Posts Keys
// ============================================================================

export const postKeys = {
    all: ["posts"] as const,
    lists: () => [...postKeys.all, "list"] as const,
    list: (params?: PostsListParams) =>
        params ? ([...postKeys.lists(), params] as const) : postKeys.lists(),
    feed: () => [...postKeys.all, "feed"] as const,
    saved: () => [...postKeys.all, "saved"] as const,
    myPosts: () => [...postKeys.all, "my-posts"] as const,
    details: () => [...postKeys.all, "detail"] as const,
    detail: (id: number) => [...postKeys.details(), id] as const,
    comments: (postId: number) =>
        [...postKeys.all, "comments", postId] as const,
    infinite: (params?: Omit<PostsListParams, "page">) =>
        params
            ? ([...postKeys.all, "infinite", params] as const)
            : ([...postKeys.all, "infinite"] as const),
};

// ============================================================================
// Comments Keys
// ============================================================================

export const commentKeys = {
    all: ["comments"] as const,
    byPost: (postId: number) => [...commentKeys.all, "post", postId] as const,
    detail: (id: number) => [...commentKeys.all, "detail", id] as const,
};

// ============================================================================
// Reports Keys
// ============================================================================

export const reportKeys = {
    all: ["reports"] as const,
    lists: () => [...reportKeys.all, "list"] as const,
    list: (params?: ReportsListParams) =>
        params
            ? ([...reportKeys.lists(), params] as const)
            : reportKeys.lists(),
    byPost: (postId: number) => [...reportKeys.all, "post", postId] as const,
    detail: (id: number) => [...reportKeys.all, "detail", id] as const,
};

// ============================================================================
// Combined Community Keys
// ============================================================================

export const communityKeys = {
    all: ["community"] as const,
    channels: channelKeys,
    posts: postKeys,
    comments: commentKeys,
    reports: reportKeys,
};
