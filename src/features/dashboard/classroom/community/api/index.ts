/**
 * Community Feature - API Module
 *
 * Public exports for the community API layer.
 */

// Types
export * from "./community.types";

// Query Keys
export {
    channelKeys,
    postKeys,
    commentKeys,
    reportKeys,
    communityKeys,
} from "./community.keys";

// API Functions
export { channelsApi } from "./channels.api";
export { postsApi } from "./posts.api";
export { commentsApi } from "./comments.api";
export { reportsApi } from "./reports.api";

// Channels Hooks
export {
    useChannelsList,
    useMyChannels,
    useChannel,
    useChannelsInfinite,
} from "./channels.queries";

export {
    useCreateChannel,
    useUpdateChannel,
    useDeleteChannel,
    useFollowChannel,
    useUnfollowChannel,
    useAddChannelAdmin,
    useRemoveChannelAdmin,
} from "./channels.mutations";

// Posts Hooks
export {
    usePostsList,
    useSavedPosts,
    useMyPosts,
    usePost,
    usePostsInfinite,
} from "./posts.queries";

export {
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useReactToPost,
    useSavePost,
    useUnsavePost,
    usePinPost,
    useUnpinPost,
    useVoteOnPoll,
} from "./posts.mutations";

// Comments Hooks
export { usePostComments } from "./comments.queries";

export {
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
    useReactToComment,
    useMarkCommentSolution,
    useUnmarkCommentSolution,
} from "./comments.mutations";

// Reports Hooks
export { useReportsList, usePostReports } from "./reports.queries";

export { useReportPost, useReviewReport } from "./reports.mutations";

// Transformers
export {
    transformUser,
    transformChannel,
    transformChannels,
    transformPoll,
    transformComment,
    transformComments,
    transformPost,
    transformPostDetail,
    transformPosts,
    toApiAudience,
    toApiCategory,
    toApiStatus,
    toApiGradeRange,
    toApiAccessType,
} from "./community.transformers";
