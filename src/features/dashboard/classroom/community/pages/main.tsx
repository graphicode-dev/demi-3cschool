import { useMemo, useState } from "react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { CommunityView } from "../components";
import { useMutationHandler } from "@/shared/api";
import type { Post, Channel } from "../types";
import {
    usePostsList,
    useSavedPosts,
    useMyPosts,
    useChannelsList,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useReactToPost,
    useSavePost,
    useUnsavePost,
    usePinPost,
    useUnpinPost,
    useFollowChannel,
    useUnfollowChannel,
    useVoteOnPoll,
    useReportPost,
    useCreateComment,
    transformPosts,
    transformChannels,
    toApiCategory,
    toApiAudience,
    type PostCreatePayload,
    type PollVotePayload,
} from "../api";
import type { CommunityTab } from "../types";

export function CommunityPage() {
    const { execute } = useMutationHandler();
    const [activeTab, setActiveTab] = useState<CommunityTab>("feed");

    // Fetch posts based on active tab
    // For feed tab, fetch general posts; for hub tab, fetch all posts (filtered client-side by category)
    const { data: postsData, isLoading: postsLoading } = usePostsList(
        activeTab === "feed" ? { category: "general" } : undefined,
        {
            enabled:
                activeTab === "feed" ||
                activeTab === "hub" ||
                activeTab === "channels",
        }
    );
    const { data: savedPostsData, isLoading: savedLoading } = useSavedPosts({
        enabled: activeTab === "saved",
    });
    const { data: myPostsData, isLoading: myPostsLoading } = useMyPosts({
        enabled: activeTab === "my-posts",
    });
    const { data: channelsData, isLoading: channelsLoading } =
        useChannelsList();

    // Transform API data to UI types based on active tab
    const posts = useMemo(() => {
        let data;
        switch (activeTab) {
            case "saved":
                data = savedPostsData?.items;
                break;
            case "my-posts":
                data = myPostsData?.items;
                break;
            default:
                data = postsData?.items;
        }
        if (!data) return [];
        return transformPosts(data);
    }, [postsData, savedPostsData, myPostsData, activeTab]);

    const channels = useMemo(() => {
        if (!channelsData?.items) return [];
        return transformChannels(channelsData.items);
    }, [channelsData]);

    // Mutations
    const { mutateAsync: createPost } = useCreatePost();
    const { mutateAsync: updatePost } = useUpdatePost();
    const { mutateAsync: deletePost } = useDeletePost();
    const { mutateAsync: reactToPost } = useReactToPost();
    const { mutateAsync: savePost } = useSavePost();
    const { mutateAsync: unsavePost } = useUnsavePost();
    const { mutateAsync: pinPost } = usePinPost();
    const { mutateAsync: unpinPost } = useUnpinPost();
    const { mutateAsync: followChannel } = useFollowChannel();
    const { mutateAsync: unfollowChannel } = useUnfollowChannel();
    const { mutateAsync: voteOnPoll } = useVoteOnPoll();
    const { mutateAsync: reportPost } = useReportPost();
    const { mutateAsync: createComment } = useCreateComment();

    const handleLike = (postId: string) => {
        execute(
            () => reactToPost({ id: Number(postId), data: { emoji: "👍" } }),
            {
                showSuccessToast: false,
            }
        );
    };

    const handleSave = (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (post?.isSaved) {
            execute(() => unsavePost(Number(postId)), {
                showSuccessToast: false,
            });
        } else {
            execute(() => savePost(Number(postId)), {
                showSuccessToast: false,
            });
        }
    };

    const handlePin = (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (post?.isPinned) {
            execute(() => unpinPost(Number(postId)), {
                showSuccessToast: false,
            });
        } else {
            execute(() => pinPost(Number(postId)), {
                showSuccessToast: false,
            });
        }
    };

    const handleDeletePost = (postId: string) => {
        execute(() => deletePost(Number(postId)), {
            successMessage: "Post deleted successfully",
        });
    };

    const handleEditPost = (postId: string, newContent: string) => {
        execute(
            () =>
                updatePost({
                    id: Number(postId),
                    data: { content: newContent },
                }),
            {
                successMessage: "Post updated successfully",
            }
        );
    };

    const handleFollowChannel = (channelId: string) => {
        const channel = channels.find((c) => c.id === channelId);
        if (channel?.isFollowing) {
            execute(() => unfollowChannel(Number(channelId)), {
                showSuccessToast: false,
            });
        } else {
            execute(() => followChannel(Number(channelId)), {
                showSuccessToast: false,
            });
        }
    };

    const handleCreatePost = (newPost: Post) => {
        // Filter out invalid mock user IDs - only include valid numeric IDs
        const validTaggedUserIds = newPost.taggedUsers
            ?.map((u) => Number(u.id))
            .filter((id) => !isNaN(id) && id > 0);

        const payload: PostCreatePayload = {
            content: newPost.content,
            channel_id: newPost.channelId
                ? Number(newPost.channelId)
                : undefined,
            image: newPost.image,
            video: newPost.video,
            gif: newPost.gif,
            audience: toApiAudience(newPost.audience),
            category: toApiCategory(newPost.category || "General"),
            feeling: newPost.feeling,
            // Only include tagged_user_ids if there are valid IDs
            ...(validTaggedUserIds && validTaggedUserIds.length > 0
                ? { tagged_user_ids: validTaggedUserIds }
                : {}),
            poll: newPost.poll
                ? {
                      question: newPost.poll.question,
                      options: newPost.poll.options.map((o) => o.text),
                  }
                : undefined,
        };

        execute(() => createPost(payload), {
            successMessage: "Post created successfully",
        });
    };

    const handleVote = (postId: string, optionId: string) => {
        execute(
            () =>
                voteOnPoll({
                    postId: Number(postId),
                    data: { option_id: Number(optionId) },
                }),
            { showSuccessToast: false }
        );
    };

    const handleTabChange = (tab: CommunityTab) => {
        setActiveTab(tab);
    };

    const handleReportPost = (postId: string, reason: string) => {
        execute(
            () =>
                reportPost({
                    postId: Number(postId),
                    data: { reason },
                }),
            { successMessage: "Post reported successfully" }
        );
    };

    const handleComment = (
        postId: string,
        content: string,
        parentId?: string
    ) => {
        execute(
            () =>
                createComment({
                    postId: Number(postId),
                    data: {
                        content,
                        parent_id: parentId ? Number(parentId) : null,
                    },
                }),
            { successMessage: parentId ? "Reply added" : "Comment added" }
        );
    };

    const isLoading =
        (activeTab === "feed" || activeTab === "hub" || activeTab === "channels"
            ? postsLoading
            : activeTab === "saved"
              ? savedLoading
              : activeTab === "my-posts"
                ? myPostsLoading
                : false) || channelsLoading;

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="min-h-screen bg-background dark:bg-background-dark">
                <CommunityView
                    posts={posts}
                    channels={channels}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onPostsUpdate={() => {}}
                    onChannelsUpdate={() => {}}
                    onLike={handleLike}
                    onSave={handleSave}
                    onPin={handlePin}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                    onFollow={handleFollowChannel}
                    onCreatePost={handleCreatePost}
                    onVote={handleVote}
                    onReportPost={handleReportPost}
                    onComment={handleComment}
                />
            </div>
        </PageWrapper>
    );
}

export default CommunityPage;
