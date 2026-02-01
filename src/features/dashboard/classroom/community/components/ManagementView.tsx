import { useState, useRef } from 'react';
import { 
  ShieldCheck, Trash2, Plus, LayoutGrid, Megaphone, 
  Users as UsersIcon, MessageSquare, AlertCircle,
  Image as ImageIcon, CheckCircle, Search, UserPlus, X, Send,
  ChevronRight, Video, Bell, ArrowLeft, Filter,
  LayoutList
} from 'lucide-react';
import type { Post, Channel, CommunityUser, PostReport } from '../types';
import { MOCK_USERS, CURRENT_USER } from '../mocks';
import { PostCard } from './PostCard';

interface ManagementViewProps {
  posts: Post[];
  channels: Channel[];
  reports: PostReport[];
  onDeletePost: (id: string) => void;
  onCreateChannel: (channel: Channel) => void;
  onUpdateChannelAdmins: (channelId: string, admins: CommunityUser[]) => void;
  onGlobalPost: (content: string, media?: { url: string, type: string }, channelId?: string) => void;
  onClearReport: (id: string) => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onPin: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onFollow: (id: string) => void;
  onCreatePost: (post: Post) => void;
}

type ManagementTab = 'feed' | 'moderate' | 'channels' | 'announcement' | 'reports' | 'post';

export function ManagementView({ 
  posts, 
  channels, 
  reports,
  onDeletePost, 
  onCreateChannel,
  onUpdateChannelAdmins,
  onGlobalPost,
  onClearReport,
  onLike,
  onSave,
  onPin,
  onEdit,
  onFollow,
}: ManagementViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<ManagementTab>('moderate');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedChannelForAdmins, setSelectedChannelForAdmins] = useState<string | null>(null);
  
  const [postContent, setPostContent] = useState('');
  const [postTargetChannel, setPostTargetChannel] = useState<string>('');
  const [attachedMedia, setAttachedMedia] = useState<{ url: string; type: string } | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    banner: 'https://picsum.photos/seed/new/800/400',
    thumbnail: 'https://picsum.photos/seed/thumb/200/200',
    ownerId: MOCK_USERS[0].id,
    accessType: 'General' as 'General' | 'Restricted',
    gradeRange: 'All' as Channel['gradeRange']
  });

  const [announcement, setAnnouncement] = useState('');

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : file.type === 'image/gif' ? 'gif' : 'image';
    setAttachedMedia({ url: URL.createObjectURL(file), type });
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewChannel({ ...newChannel, thumbnail: URL.createObjectURL(file) });
  };

  const handleToggleAdmin = (channelId: string, user: CommunityUser) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;
    const isAdmin = channel.admins.some(a => a.id === user.id);
    const newAdmins = isAdmin 
      ? channel.admins.filter(a => a.id !== user.id)
      : [...channel.admins, user];
    onUpdateChannelAdmins(channelId, newAdmins);
  };

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const channelPosts = posts.filter(p => p.channelId === selectedChannelId);

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {selectedChannelId ? (
        <div className="mb-10">
          <button 
            onClick={() => setSelectedChannelId(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00ADEF] font-bold text-sm mb-6 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Management
          </button>
          
          <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl mb-8">
            <div className="h-40 relative">
              <img src={selectedChannel?.banner} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs border border-white/30">Edit Banner</button>
              </div>
            </div>
            <div className="p-8 flex items-start justify-between">
              <div className="flex gap-6">
                 <img src={selectedChannel?.thumbnail || selectedChannel?.owner.avatar} className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg -mt-16 relative z-10 bg-white" alt="" />
                 <div>
                    <h3 className="text-2xl font-black text-gray-900">{selectedChannel?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="px-2 py-0.5 bg-[#E0F4FF] text-[#00ADEF] text-[10px] font-black rounded uppercase">{selectedChannel?.gradeRange}</span>
                       <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-black rounded uppercase">{selectedChannel?.accessType}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <h4 className="font-black text-gray-800 uppercase tracking-widest text-xs px-2">Channel Posts</h4>
                {channelPosts.map(post => (
                   <PostCard 
                     key={post.id} 
                     post={post} 
                     onLike={onLike} onSave={onSave} onPin={onPin} onDelete={onDeletePost} onEdit={onEdit}
                     showReportCount
                   />
                ))}
                {channelPosts.length === 0 && (
                  <div className="p-10 text-center bg-white border border-dashed border-gray-200 rounded-[32px]">
                    <p className="text-gray-400 font-medium">No official posts in this channel yet.</p>
                  </div>
                )}
             </div>
             <div>
                <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm sticky top-24">
                   <h4 className="font-black text-gray-800 text-[13px] uppercase mb-6 tracking-widest">Admin Control</h4>
                   <button className="w-full py-4 bg-[#00ADEF] text-white rounded-2xl font-black text-sm mb-3">Add Official Post</button>
                   <button className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm">Channel Settings</button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#E0F4FF] text-[#00ADEF] rounded-2xl">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Community Management</h2>
                <p className="text-gray-400 font-medium text-sm">Moderate content and manage academy channels.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 relative">
                  <Bell size={20} />
                  {(reports.length > 0) && <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                </button>
              </div>
              <button 
                onClick={() => setActiveSubTab('post')}
                className="flex items-center gap-2 px-6 py-3 bg-[#00ADEF] text-white rounded-[20px] font-black text-sm shadow-xl shadow-[#00ADEF]/20 hover:scale-[1.02] transition-all"
              >
                <Plus size={18} /> New Official Post
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Posts', value: posts.length, icon: MessageSquare, color: 'text-blue-500' },
              { label: 'Active Channels', value: channels.length, icon: LayoutGrid, color: 'text-purple-500' },
              { label: 'Unresolved Reports', value: reports.length, icon: AlertCircle, color: 'text-red-500' },
              { label: 'Verified Admins', value: channels.reduce((acc, c) => acc + c.admins.length, 0), icon: UsersIcon, color: 'text-green-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <p className="text-2xl font-black text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="flex border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'feed', label: 'Feed Overview', icon: LayoutList },
              { id: 'moderate', label: 'Post Moderation', icon: ShieldCheck },
              { id: 'reports', label: `Reports (${reports.length})`, icon: AlertCircle },
              { id: 'channels', label: 'Channel Management', icon: LayoutGrid },
              { id: 'announcement', label: 'Global Broadcast', icon: Megaphone },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as ManagementTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeSubTab === tab.id 
                    ? 'border-[#00ADEF] text-[#00ADEF]' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeSubTab === 'feed' && (
                <div className="space-y-6">
                  {posts.map(post => (
                    <PostCard 
                      key={post.id} post={post} 
                      onLike={onLike} onSave={onSave} onPin={onPin} onDelete={onDeletePost} onEdit={onEdit}
                      showReportCount
                    />
                  ))}
                </div>
              )}

              {activeSubTab === 'reports' && (
                 <div className="space-y-4">
                    {reports.length === 0 ? (
                       <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                          <CheckCircle size={48} className="mx-auto mb-4 text-green-400 opacity-20" />
                          <h3 className="text-xl font-bold text-gray-800 mb-2">No Reports Pending</h3>
                          <p className="text-gray-400 text-sm font-medium">Your community is behaving well!</p>
                       </div>
                    ) : (
                       reports.map(report => {
                          const post = posts.find(p => p.id === report.postId);
                          return (
                             <div key={report.id} className="bg-white p-6 rounded-[24px] border border-red-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                      <div className="p-2 bg-red-50 text-red-500 rounded-lg"><AlertCircle size={16} /></div>
                                      <div>
                                         <p className="text-xs font-black text-gray-800">REPORT: {report.reason}</p>
                                         <p className="text-[10px] text-gray-400 font-bold uppercase">Reported by {report.reporter.name} • {report.timestamp}</p>
                                      </div>
                                   </div>
                                   <div className="flex gap-2">
                                      <button onClick={() => onClearReport(report.id)} className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg hover:bg-gray-100">Dismiss</button>
                                      <button onClick={() => onDeletePost(report.postId)} className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600">Delete Post</button>
                                   </div>
                                </div>
                                {post && (
                                   <div className="p-4 bg-gray-50 rounded-xl opacity-60">
                                      <p className="text-xs font-bold text-gray-500 mb-1">Content Preview:</p>
                                      <p className="text-xs text-gray-600 italic line-clamp-2">"{post.content}"</p>
                                   </div>
                                )}
                             </div>
                          );
                       })
                    )}
                 </div>
              )}

              {activeSubTab === 'moderate' && (
                <div className="space-y-4">
                  <div className="relative mb-6">
                    <input 
                      type="text" 
                      placeholder="Search posts or users to moderate..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/10 outline-none"
                    />
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  {filteredPosts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-start justify-between group">
                      <div className="flex gap-4">
                        <img src={post.author.avatar} className="w-12 h-12 rounded-xl object-cover" alt=""/>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-sm">{post.author.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{post.createdAt}</span>
                            {post.isOfficial && <ShieldCheck size={12} className="text-[#00ADEF]" />}
                            {(post.reportCount || 0) > 0 && <span className="text-[10px] px-2 py-0.5 bg-red-50 text-red-500 font-black rounded-full border border-red-100">{post.reportCount} Reports</span>}
                          </div>
                          <p className="text-gray-600 text-[13px] leading-relaxed line-clamp-2 max-w-lg">{post.content}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => window.alert('Post Details UI placeholder')} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100"><Filter size={16} /></button>
                         <button onClick={() => onDeletePost(post.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === 'channels' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-lg font-black text-gray-800 mb-6">Create New Official Channel</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">General Thumbnail</label>
                          <div className="relative w-20 h-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer group">
                             {newChannel.thumbnail ? <img src={newChannel.thumbnail} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="text-gray-300" />}
                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleThumbnailUpload} />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Plus size={16} className="text-white" />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Channel Name"
                        value={newChannel.name}
                        onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/20"
                      />
                      <textarea 
                        placeholder="Description"
                        value={newChannel.description}
                        onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/20 h-24"
                      />
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Access Setting</label>
                            <select 
                              value={newChannel.accessType}
                              onChange={(e) => setNewChannel({...newChannel, accessType: e.target.value as 'General' | 'Restricted'})}
                              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/20"
                            >
                               <option value="General">General</option>
                               <option value="Restricted">Restricted (Invite Only)</option>
                            </select>
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Grade Focus</label>
                            <select 
                              value={newChannel.gradeRange}
                              onChange={(e) => setNewChannel({...newChannel, gradeRange: e.target.value as Channel['gradeRange']})}
                              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/20"
                            >
                               <option value="All">All Grades</option>
                               <option value="Grade 1-3">Grade 1-3</option>
                               <option value="Grade 4-6">Grade 4-6</option>
                               <option value="Grade 7-9">Grade 7-9</option>
                               <option value="Grade 10-12">Grade 10-12</option>
                            </select>
                         </div>
                      </div>
                      <button 
                        onClick={() => {
                          const owner = MOCK_USERS.find(u => u.id === newChannel.ownerId)!;
                          onCreateChannel({
                            id: crypto.randomUUID(),
                            name: newChannel.name,
                            description: newChannel.description,
                            banner: newChannel.banner,
                            thumbnail: newChannel.thumbnail,
                            owner: owner,
                            admins: [owner],
                            followers: 0,
                            isFollowing: false,
                            accessType: newChannel.accessType,
                            gradeRange: newChannel.gradeRange
                          });
                          setNewChannel({name: '', description: '', banner: 'https://picsum.photos/seed/new/800/400', thumbnail: 'https://picsum.photos/seed/thumb/200/200', ownerId: MOCK_USERS[0].id, accessType: 'General', gradeRange: 'All'});
                        }}
                        className="w-full bg-[#00ADEF] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#0095CC] transition-all"
                      >
                        Create Channel
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-lg font-black text-gray-800 mb-6">Manage All Channels</h3>
                    <div className="space-y-3">
                      {channels.map(channel => (
                        <div key={channel.id} className="border border-gray-50 rounded-2xl overflow-hidden">
                          <div className="w-full flex items-center justify-between p-4 bg-white">
                             <div className="flex items-center gap-3">
                                <img src={channel.thumbnail || channel.banner} className="w-10 h-10 rounded-xl object-cover border border-gray-100" alt=""/>
                                <div>
                                   <span className="font-bold text-gray-700 block text-sm">{channel.name}</span>
                                   <span className="text-[9px] text-gray-400 font-black uppercase">{channel.gradeRange} • {channel.followers} Followers</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setSelectedChannelId(channel.id)}
                                  className="px-3 py-1.5 bg-[#E0F4FF] text-[#00ADEF] rounded-lg text-[10px] font-black uppercase hover:bg-[#00ADEF] hover:text-white transition-all"
                                >
                                   View Inside
                                </button>
                                <button 
                                  onClick={() => setSelectedChannelForAdmins(selectedChannelForAdmins === channel.id ? null : channel.id)}
                                  className="p-1.5 bg-gray-50 text-gray-400 rounded-lg"
                                >
                                   <UsersIcon size={14} />
                                </button>
                             </div>
                          </div>
                          
                          {selectedChannelForAdmins === channel.id && (
                            <div className="p-4 bg-[#fcfdfe] border-t border-gray-50 animate-in slide-in-from-top-2">
                              <h5 className="text-[10px] font-black text-gray-400 uppercase mb-3">Manage Admins</h5>
                              <div className="grid grid-cols-2 gap-3">
                                {MOCK_USERS.filter(u => u.role !== 'student').map(user => {
                                  const isChanAdmin = channel.admins.some(a => a.id === user.id);
                                  return (
                                    <button 
                                      key={user.id}
                                      onClick={() => handleToggleAdmin(channel.id, user)}
                                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isChanAdmin ? 'bg-white border-[#00ADEF] shadow-sm' : 'border-gray-100 hover:border-gray-300 opacity-60'}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <img src={user.avatar} className="w-6 h-6 rounded-full" alt=""/>
                                        <span className="text-xs font-bold text-gray-700">{user.name}</span>
                                      </div>
                                      {isChanAdmin ? <CheckCircle size={14} className="text-[#00ADEF]" /> : <UserPlus size={14} className="text-gray-300" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === 'announcement' && (
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-gray-800 mb-6">Global Broadcast</h3>
                  <p className="text-gray-400 text-sm mb-6">Send an announcement to all students across the main feed.</p>
                  <textarea 
                    placeholder="Write your announcement..."
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-[24px] p-6 text-[15px] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none h-40 mb-6"
                  />
                  <button 
                    onClick={() => {
                      onGlobalPost(announcement);
                      setAnnouncement('');
                    }}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <Megaphone size={18} /> Broadcast to Everyone
                  </button>
                </div>
              )}

              {activeSubTab === 'post' && (
                <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-gray-800 mb-6">Create Official Post</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[11px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Select Target</label>
                      <select 
                        value={postTargetChannel}
                        onChange={(e) => setPostTargetChannel(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/20"
                      >
                        <option value="">Main Public Feed</option>
                        {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <textarea 
                        placeholder="What's the official update?"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-[24px] p-6 text-[15px] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none h-40"
                      />
                    </div>

                    {attachedMedia && (
                      <div className="relative group rounded-2xl overflow-hidden border border-gray-100 max-w-sm">
                        {attachedMedia.type === 'video' ? (
                          <video src={attachedMedia.url} className="w-full h-40 object-cover" />
                        ) : (
                          <img src={attachedMedia.url} className="w-full h-40 object-cover" alt="" />
                        )}
                        <button 
                          onClick={() => setAttachedMedia(null)}
                          className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex gap-2">
                        <input type="file" ref={mediaInputRef} onChange={handleMediaUpload} className="hidden" accept="image/*,video/*" />
                        <button onClick={() => mediaInputRef.current?.click()} className="p-4 bg-gray-50 text-gray-400 hover:text-[#00ADEF] rounded-2xl transition-all"><ImageIcon size={20}/></button>
                        <button onClick={() => mediaInputRef.current?.click()} className="p-4 bg-gray-50 text-gray-400 hover:text-[#00ADEF] rounded-2xl transition-all"><Video size={20}/></button>
                      </div>
                      <button 
                        onClick={() => {
                          onGlobalPost(postContent, attachedMedia || undefined, postTargetChannel || undefined);
                          setPostContent('');
                          setAttachedMedia(null);
                          setPostTargetChannel('');
                        }}
                        className="px-10 py-4 bg-[#00ADEF] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#00ADEF]/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                      >
                        <Send size={18} /> Post Officially
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-[#fcfdfe] rounded-[32px] border border-[#00ADEF]/10 p-7">
                <h4 className="font-black text-gray-800 text-[13px] uppercase tracking-widest mb-6">Moderator Quick Tips</h4>
                <div className="space-y-4">
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">System notifications will highlight posts with 2+ reports automatically.</p>
                  <div className="flex items-center gap-2 p-3 bg-[#E0F4FF] rounded-xl text-[#00ADEF]">
                    <ShieldCheck size={16} />
                    <span className="text-[11px] font-bold">Manager Mode Active</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-[32px] border border-gray-100 p-7 shadow-sm">
                <h4 className="font-black text-gray-800 text-[13px] uppercase tracking-widest mb-6">Live Activity Reports</h4>
                <div className="space-y-4">
                   {reports.length > 0 ? (
                      <div className="space-y-3">
                         {reports.slice(0, 3).map(r => (
                            <div key={r.id} className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                               <div>
                                  <p className="text-[10px] font-bold text-red-600">New Report: {r.reason}</p>
                                  <p className="text-[9px] text-red-400">By {r.reporter.name}</p>
                               </div>
                               <button onClick={() => setActiveSubTab('reports')}><ChevronRight size={12} className="text-red-400" /></button>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-3xl">
                        <div className="text-center">
                          <CheckCircle size={32} className="text-green-400 mx-auto mb-3" />
                          <p className="text-xs font-bold text-gray-400">All clear! No pending reports.</p>
                        </div>
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ManagementView;
