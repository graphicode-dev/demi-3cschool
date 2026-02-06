import { useMemo } from "react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ManagementView } from "../components";
import { useMutationHandler } from "@/shared/api";
import type { Post, Channel, CommunityUser } from "../types";
import {
    usePostsList,
    useChannelsList,
    useReportsList,
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
    useCreateChannel,
    useAddChannelAdmin,
    useRemoveChannelAdmin,
    useReviewReport,
    transformPosts,
    transformChannels,
    toApiCategory,
    toApiAudience,
    toApiAccessType,
    toApiGradeRange,
    type PostCreatePayload,
    type ChannelCreatePayload,
} from "../api";
import { useCreateComment } from "@/features/dashboard/classroom/community/api";

interface PostReport {
    id: string;
    postId: string;
    reporter: CommunityUser;
    reason: string;
    timestamp: string;
}

export function CommunityManagementPage() {
    const { execute } = useMutationHandler();

    // Fetch data
    const { data: postsData, isLoading: postsLoading } = usePostsList();
    const { data: channelsData, isLoading: channelsLoading } =
        useChannelsList();
    const { data: reportsData, isLoading: reportsLoading } = useReportsList();

    // Transform API data to UI types
    const posts = useMemo(() => {
        if (!postsData?.items) return [];
        return transformPosts(postsData.items);
    }, [postsData]);

    const channels = useMemo(() => {
        if (!channelsData?.items) return [];
        return transformChannels(channelsData.items);
    }, [channelsData]);

    const reports = useMemo((): PostReport[] => {
        if (!reportsData?.items) return [];
        return reportsData.items.map((r) => ({
            id: String(r.id),
            postId: String(r.post_id),
            reporter: {
                id: String(r.reporter.id),
                name: r.reporter.name,
                avatar: r.reporter.avatar || "",
                role: "student" as const,
            },
            reason: r.reason,
            timestamp: r.created_at,
        }));
    }, [reportsData]);

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
    const { mutateAsync: createChannel } = useCreateChannel();
    const { mutateAsync: addChannelAdmin } = useAddChannelAdmin();
    const { mutateAsync: removeChannelAdmin } = useRemoveChannelAdmin();
    const { mutateAsync: reviewReport } = useReviewReport();
    const { mutateAsync: createComment } = useCreateComment();

    const handleLike = (postId: string) => {
        execute(
            () => reactToPost({ id: Number(postId), data: { emoji: "👍" } }),
            { showSuccessToast: false }
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
            execute(() => pinPost(Number(postId)), { showSuccessToast: false });
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
            { successMessage: "Post updated successfully" }
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
            is_pinned: newPost.isPinned,
            is_official: newPost.isOfficial,
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

    const handleCreateChannel = (channel: Channel) => {
        // Filter out mock user IDs (non-numeric or invalid IDs)
        // Only include admin_ids if they are valid numeric IDs from the backend
        const validAdminIds = channel.admins
            .map((a) => Number(a.id))
            .filter((id) => !isNaN(id) && id > 0);

        const payload: ChannelCreatePayload = {
            name: channel.name,
            description: channel.description,
            banner: channel.banner,
            thumbnail: channel.thumbnail,
            access_type: toApiAccessType(channel.accessType),
            grade_range: toApiGradeRange(channel.gradeRange),
            // Only include admin_ids if there are valid IDs, otherwise omit the field
            ...(validAdminIds.length > 0 ? { admin_ids: validAdminIds } : {}),
        };

        execute(() => createChannel(payload), {
            successMessage: "Channel created successfully",
        });
    };

    const handleUpdateChannelAdmins = (
        channelId: string,
        admins: CommunityUser[]
    ) => {
        const channel = channels.find((c) => c.id === channelId);
        if (!channel) return;

        const currentAdminIds = channel.admins.map((a) => a.id);
        const newAdminIds = admins.map((a) => a.id);

        // Find admins to add
        const adminsToAdd = newAdminIds.filter(
            (id) => !currentAdminIds.includes(id)
        );
        // Find admins to remove
        const adminsToRemove = currentAdminIds.filter(
            (id) => !newAdminIds.includes(id)
        );

        // Add new admins
        adminsToAdd.forEach((userId) => {
            execute(
                () =>
                    addChannelAdmin({
                        channelId: Number(channelId),
                        data: { user_id: Number(userId) },
                    }),
                { showSuccessToast: false }
            );
        });

        // Remove old admins
        adminsToRemove.forEach((userId) => {
            execute(
                () =>
                    removeChannelAdmin({
                        channelId: Number(channelId),
                        data: { user_id: Number(userId) },
                    }),
                { showSuccessToast: false }
            );
        });
    };

    const handleGlobalPost = (
        content: string,
        media?: { url: string; type: string },
        channelId?: string
    ) => {
        const payload: PostCreatePayload = {
            content,
            channel_id: channelId ? Number(channelId) : undefined,
            image: media?.type === "image" ? media.url : undefined,
            video: media?.type === "video" ? media.url : undefined,
            gif: media?.type === "gif" ? media.url : undefined,
            audience: channelId ? "group" : "public",
            is_pinned: true,
            is_official: true,
            status: "announcement",
        };

        execute(() => createPost(payload), {
            successMessage: "Announcement posted successfully",
        });
    };

    const handleClearReport = (
        reportId: string,
        action?: "dismiss" | "resolve"
    ) => {
        const status = action === "dismiss" ? "dismissed" : "resolved";
        execute(
            () =>
                reviewReport({
                    id: Number(reportId),
                    data: { status },
                }),
            {
                successMessage:
                    action === "dismiss"
                        ? "Report dismissed"
                        : "Report resolved",
            }
        );
    };

    const handleComment = (postId: string, content: string) => {
        execute(
            () =>
                createComment({
                    postId: Number(postId),
                    data: { content },
                }),
            { successMessage: "Comment added" }
        );
    };

    const isLoading = postsLoading || channelsLoading || reportsLoading;

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
                <ManagementView
                    posts={posts}
                    channels={channels}
                    reports={reports}
                    onDeletePost={handleDeletePost}
                    onCreateChannel={handleCreateChannel}
                    onUpdateChannelAdmins={handleUpdateChannelAdmins}
                    onGlobalPost={handleGlobalPost}
                    onClearReport={handleClearReport}
                    onLike={handleLike}
                    onSave={handleSave}
                    onPin={handlePin}
                    onEdit={handleEditPost}
                    onFollow={handleFollowChannel}
                    onCreatePost={handleCreatePost}
                    onComment={handleComment}
                />
            </div>
        </PageWrapper>
    );
}

export default CommunityManagementPage;
