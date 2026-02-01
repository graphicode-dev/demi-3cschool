import { useState } from 'react';
import PageWrapper from '@/design-system/components/PageWrapper';
import { ManagementView } from '../components';
import { MOCK_POSTS, MOCK_CHANNELS, CURRENT_USER } from '../mocks';
import type { Post, Channel, Audience, CommunityUser, PostReport } from '../types';

export function CommunityManagementPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS.map(p => ({ ...p, audience: 'Public' as Audience, isPinned: false })));
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [reports, setReports] = useState<PostReport[]>([]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
  };

  const handlePin = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setReports(prev => prev.filter(r => r.postId !== postId));
  };

  const handleEditPost = (postId: string, newContent: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: newContent } : p));
  };

  const handleFollowChannel = (channelId: string) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, isFollowing: !c.isFollowing } : c));
  };

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleCreateChannel = (channel: Channel) => {
    setChannels([channel, ...channels]);
  };

  const handleUpdateChannelAdmins = (channelId: string, admins: CommunityUser[]) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, admins } : c));
  };

  const handleGlobalPost = (content: string, media?: { url: string, type: string }, channelId?: string) => {
    const announcement: Post = {
      id: crypto.randomUUID(),
      author: { ...CURRENT_USER, role: 'manager' }, 
      content,
      likes: 0,
      comments: [],
      isSaved: false,
      isPinned: true,
      isOfficial: true,
      createdAt: 'Just now',
      audience: channelId ? 'Group' : 'Public',
      channelId: channelId,
      image: media?.type === 'image' ? media.url : undefined,
      video: media?.type === 'video' ? media.url : undefined,
      gif: media?.type === 'gif' ? media.url : undefined,
    };
    setPosts([announcement, ...posts]);
  };

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
          onClearReport={(id) => setReports(prev => prev.filter(r => r.id !== id))}
          onLike={handleLike}
          onSave={handleSave}
          onPin={handlePin}
          onEdit={handleEditPost}
          onFollow={handleFollowChannel}
          onCreatePost={handleCreatePost}
        />
      </div>
    </PageWrapper>
  );
}

export default CommunityManagementPage;
