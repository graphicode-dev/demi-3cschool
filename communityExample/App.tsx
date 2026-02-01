
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommunityView from './components/CommunityView';
import ManagementView from './components/ManagementView';
import { MOCK_POSTS, MOCK_CHANNELS, CURRENT_USER } from './constants';
import { Post, Channel, Audience, User, PostReport } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('community');
  
  // Lifted Community State
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS.map(p => ({ ...p, audience: 'Public' as Audience, isPinned: false })));
  const [channels, setChannels] = useState<Channel[]>(MOCK_CHANNELS);
  const [reports, setReports] = useState<PostReport[]>([]);

  // Common Post Actions
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

  const handleUpdateChannelAdmins = (channelId: string, admins: User[]) => {
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, admins } : c));
  };

  const handleReportPost = (postId: string, reason: string) => {
    const newReport: PostReport = {
      id: Date.now().toString(),
      postId,
      reporter: CURRENT_USER,
      reason,
      timestamp: 'Just now'
    };
    setReports([newReport, ...reports]);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, reportCount: (p.reportCount || 0) + 1 } : p));
  };

  const handleGlobalPost = (content: string, media?: { url: string, type: string }, channelId?: string) => {
    const announcement: Post = {
      id: Date.now().toString(),
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
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 min-w-0">
        <Header />
        
        <div className="content-area">
          {activeTab === 'community' && (
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
              onReportPost={handleReportPost}
            />
          )}

          {activeTab === 'management' && (
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
          )}

          {activeTab !== 'community' && activeTab !== 'management' && (
            <div className="p-16 text-center mt-20 max-w-lg mx-auto bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-[#E0F4FF] rounded-full flex items-center justify-center mx-auto mb-8">
                 <span className="text-5xl">🚧</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Coming Soon!</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                We're currently building the <span className="text-[#00ADEF] font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span> section.
              </p>
              <button 
                onClick={() => setActiveTab('community')}
                className="w-full bg-[#00ADEF] text-white py-4 rounded-[20px] font-bold shadow-xl shadow-[#00ADEF]/20 hover:bg-[#0095CC] hover:-translate-y-1 transition-all"
              >
                Go back to Community
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
