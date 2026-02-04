import { useMemo } from "react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { CommunityView } from "../components";
import { useMutationHandler } from "@/shared/api";
import type { Post, Channel } from "../types";
import {
    usePostsList,
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
    transformPosts,
    transformChannels,
    toApiCategory,
    toApiAudience,
    type PostCreatePayload,
} from "../api";

export function CommunityPage() {
    const { execute } = useMutationHandler();

    // Fetch posts
    const { data: postsData, isLoading: postsLoading } = usePostsList();
    const { data: channelsData, isLoading: channelsLoading } =
        useChannelsList();

    // Transform API data to UI types
    const posts = useMemo(() => {
        if (!postsData?.items) return [];
        return transformPosts(postsData.items);
    }, [postsData]);

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
            tagged_user_ids: newPost.taggedUsers?.map((u) => Number(u.id)),
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

    const isLoading = postsLoading || channelsLoading;

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
                    onPostsUpdate={() => {}}
                    onChannelsUpdate={() => {}}
                    onLike={handleLike}
                    onSave={handleSave}
                    onPin={handlePin}
                    onDelete={handleDeletePost}
                    onEdit={handleEditPost}
                    onFollow={handleFollowChannel}
                    onCreatePost={handleCreatePost}
                />
            </div>
        </PageWrapper>
    );
}

export default CommunityPage;
