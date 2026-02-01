import { useState } from "react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { CommunityView } from "../components";
import { MOCK_POSTS, MOCK_CHANNELS } from "../mocks";
import type { Post, Channel, Audience } from "../types";

export function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(
        MOCK_POSTS.map((p) => ({
            ...p,
            audience: "Public" as Audience,
            isPinned: false,
        }))
    );
    const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);

    const handleLike = (postId: string) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, likes: p.likes + 1 } : p
            )
        );
    };

    const handleSave = (postId: string) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, isSaved: !p.isSaved } : p
            )
        );
    };

    const handlePin = (postId: string) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, isPinned: !p.isPinned } : p
            )
        );
    };

    const handleDeletePost = (postId: string) => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
    };

    const handleEditPost = (postId: string, newContent: string) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, content: newContent } : p
            )
        );
    };

    const handleFollowChannel = (channelId: string) => {
        setChannels((prev) =>
            prev.map((c) =>
                c.id === channelId ? { ...c, isFollowing: !c.isFollowing } : c
            )
        );
    };

    const handleCreatePost = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <PageWrapper>
            <div className="min-h-screen bg-background dark:bg-background-dark">
                <CommunityView
                    posts={posts}
                    channels={channels}
                    onPostsUpdate={setPosts}
                    onChannelsUpdate={setChannels}
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
