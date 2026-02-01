
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, ChevronRight, Trophy, Zap, LayoutGrid, LayoutList, 
  BookmarkCheck, Image as ImageIcon, 
  Video, FileVideo, Globe, Users as UsersIcon, AtSign, BarChart3, X, Trash2,
  User as UserIcon, Play, Heart, MessageSquare, Share2, Music, UserPlus,
  ArrowLeft, Bell, MoreVertical, CheckCircle2, Send, HelpCircle, BookOpen, GraduationCap, CheckCircle,
  Star, Hash, Smile, Paperclip
} from 'lucide-react';
import { MOCK_POSTS, MOCK_CHANNELS, CURRENT_USER, MOCK_USERS } from '../constants';
import PostCard from './PostCard';
import ChannelCard from './ChannelCard';
import { Post, Channel, Audience, User, PostCategory } from '../types';

type CommunityTab = 'feed' | 'hub' | 'my-posts' | 'channels' | 'saved';

const FEELINGS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🚀', label: 'Excited' },
  { emoji: '💻', label: 'Coding' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '📚', label: 'Learning' },
  { emoji: '🎉', label: 'Celebrating' },
  { emoji: '😴', label: 'Tired' },
];

const EMOJIS = ['😂', '❤️', '🔥', '✨', '👍', '🙏', '🙌', '💯', '👋', '🤖', '🎓', '💡', '✅', '🌈', '⚡', '🌟'];

interface CommunityViewProps {
  posts: Post[];
  channels: Channel[];
  onPostsUpdate: (posts: Post[]) => void;
  onChannelsUpdate: (channels: Channel[]) => void;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onFollow: (id: string) => void;
  onCreatePost: (post: Post) => void;
  onReportPost?: (id: string, reason: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({ 
  posts, 
  channels, 
  onLike, 
  onSave, 
  onPin, 
  onDelete, 
  onEdit, 
  onFollow,
  onCreatePost,
  onReportPost
}) => {
  const [viewMode, setViewMode] = useState<CommunityTab>('feed');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [hubFilter, setHubFilter] = useState<PostCategory | 'All'>('All');
  
  // Creation State
  const [postText, setPostText] = useState('');
  const [postCategory, setPostCategory] = useState<PostCategory>('General');
  const [audience, setAudience] = useState<Audience>('Public');
  const [feeling, setFeeling] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Media State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<{ url: string; type: 'image' | 'video' | 'gif' } | null>(null);
  
  // Poll State
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  
  // Tag State
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [showTagList, setShowTagList] = useState(false);

  // Emoji State
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : file.type === 'image/gif' ? 'gif' : 'image';
    setAttachedFile({ url: URL.createObjectURL(file), type });
  };

  const handleInternalCreatePost = () => {
    if (!postText.trim() && !pollQuestion && !attachedFile) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      author: CURRENT_USER,
      content: postText,
      likes: 0,
      comments: [],
      isSaved: false,
      isPinned: false,
      createdAt: 'Just now',
      audience: selectedChannelId ? 'Group' : audience,
      feeling: feeling || undefined,
      channelId: selectedChannelId || undefined,
      taggedUsers: taggedUsers,
      category: viewMode === 'hub' ? postCategory : 'General',
      status: viewMode === 'hub' ? 'Open' : undefined,
      image: attachedFile?.type === 'image' ? attachedFile.url : undefined,
      video: attachedFile?.type === 'video' ? attachedFile.url : undefined,
      gif: attachedFile?.type === 'gif' ? attachedFile.url : undefined,
      poll: showPollBuilder && pollQuestion ? {
        question: pollQuestion,
        options: pollOptions.filter(o => o.trim()).map((o, i) => ({ id: i.toString(), text: o, votes: 0 })),
        totalVotes: 0
      } : undefined
    };

    onCreatePost(newPost);
    resetForm();
  };

  const resetForm = () => {
    setPostText('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollBuilder(false);
    setTaggedUsers([]);
    setAttachedFile(null);
    setIsExpanded(false);
    setFeeling(null);
    setShowEmojiPicker(false);
    setShowFeelingPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setPostText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getFilteredPosts = () => {
    let list = [...posts];
    if (selectedChannelId) return list.filter(p => p.channelId === selectedChannelId);
    
    if (viewMode === 'hub') {
      list = list.filter(p => p.category && p.category !== 'General');
      if (hubFilter !== 'All') list = list.filter(p => p.category === hubFilter);
    } else {
      if (viewMode === 'saved') list = list.filter(p => p.isSaved);
      if (viewMode === 'my-posts') list = list.filter(p => p.author.id === CURRENT_USER.id);
      if (viewMode === 'feed') list = list.filter(p => !p.category || p.category === 'General');
    }
    
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const filteredPosts = getFilteredPosts();
  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      {!selectedChannelId ? (
        <>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-[32px] font-black text-gray-900 tracking-tight leading-none mb-2">
                {viewMode === 'hub' ? 'Knowledge Hub' : 'Academy Community'}
              </h2>
              <p className="text-gray-400 font-medium text-[15px]">
                {viewMode === 'hub' 
                  ? 'Help newcomers with their coding journey.' 
                  : 'Stay connected with classmates and instructors.'}
              </p>
            </div>
            
            <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar max-w-full">
              {[
                { id: 'feed', icon: LayoutList, label: 'Feed' },
                { id: 'hub', icon: GraduationCap, label: 'Knowledge Hub' },
                { id: 'my-posts', icon: UserIcon, label: 'My Posts' },
                { id: 'channels', icon: LayoutGrid, label: 'Channels' },
                { id: 'saved', icon: BookmarkCheck, label: 'Saved' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as CommunityTab)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${viewMode === mode.id ? 'bg-[#00ADEF] text-white shadow-lg shadow-[#00ADEF]/20' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <mode.icon size={16} />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <button onClick={() => setSelectedChannelId(null)} className="flex items-center gap-2 text-gray-400 hover:text-[#00ADEF] font-bold text-sm mb-6 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Community
          </button>
          
          <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl mb-8">
            <div className="h-52 relative">
              <img src={selectedChannel?.banner} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
              <div className="absolute bottom-6 left-8 flex items-end gap-6">
                <img src={selectedChannel?.owner.avatar} className="w-24 h-24 rounded-[32px] border-4 border-white shadow-2xl object-cover" alt="" />
                <div className="pb-2">
                  <div className="flex items-center gap-2 text-white">
                    <h2 className="text-3xl font-black tracking-tight">{selectedChannel?.name}</h2>
                    <CheckCircle2 size={24} className="text-[#00ADEF] fill-white" />
                  </div>
                  <p className="text-white/80 font-bold text-sm">{selectedChannel?.followers.toLocaleString()} subscribers • Verified Academy Channel</p>
                </div>
              </div>
            </div>
            <div className="p-8 flex items-center justify-between border-b border-gray-50 bg-[#fcfdfe]">
              <div className="max-w-2xl">
                <p className="text-gray-600 font-medium leading-relaxed text-[15px]">{selectedChannel?.description}</p>
              </div>
              <button 
                onClick={() => selectedChannel && onFollow(selectedChannel.id)} 
                className={`px-10 py-4 rounded-[20px] font-black text-sm transition-all shadow-lg ${selectedChannel?.isFollowing ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-[#00ADEF] text-white shadow-[#00ADEF]/20 hover:scale-[1.02]'}`}
              >
                {selectedChannel?.isFollowing ? 'Following' : 'Follow Channel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'hub' && !selectedChannelId && (
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {['All', 'Project Help', 'Homework', 'Coding Tip', 'Resource'].map(cat => (
            <button
              key={cat}
              onClick={() => setHubFilter(cat as any)}
              className={`px-5 py-2.5 rounded-full text-[12px] font-bold transition-all border ${hubFilter === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Enhanced Post Creator UI matching Screenshot */}
          {(viewMode === 'feed' || viewMode === 'hub' || selectedChannelId) && (
            <div className={`bg-white rounded-[32px] border border-gray-100 shadow-sm mb-8 transition-all duration-300 ${isExpanded ? 'ring-4 ring-blue-50 shadow-xl' : 'hover:shadow-md'}`}>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  <img src={CURRENT_USER.avatar} alt="" className="w-11 h-11 rounded-2xl shadow-sm object-cover" />
                  <div className="flex-1 flex items-center gap-2">
                    {!isExpanded ? (
                      <button 
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-left py-3 px-5 rounded-2xl bg-[#f8fafc] text-gray-400 text-[14px] font-medium transition-all hover:bg-gray-100"
                      >
                        What's the news?
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {/* Audience Selector */}
                        <div className="relative">
                          <button 
                            onClick={() => setAudience(audience === 'Public' ? 'Group' : 'Public')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] rounded-xl text-[11px] font-bold text-gray-500 border border-gray-100 hover:bg-white transition-all"
                          >
                            {audience === 'Public' ? <Globe size={12} /> : <UsersIcon size={12} />}
                            {audience}
                          </button>
                        </div>
                        
                        {/* Feeling Selector */}
                        <div className="relative">
                          <button 
                            onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${feeling ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-[#f8fafc] text-gray-500 border-gray-100'}`}
                          >
                            <Smile size={12} />
                            {feeling ? `Feeling ${feeling}` : 'Feeling...'}
                          </button>
                          {showFeelingPicker && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 p-2 animate-in fade-in zoom-in-95">
                              {FEELINGS.map(f => (
                                <button
                                  key={f.label}
                                  onClick={() => { setFeeling(`${f.emoji} ${f.label}`); setShowFeelingPicker(false); }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-2"
                                >
                                  <span>{f.emoji}</span> {f.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Hub Category if applicable */}
                        {viewMode === 'hub' && (
                          <select 
                            value={postCategory}
                            onChange={(e) => setPostCategory(e.target.value as PostCategory)}
                            className="bg-indigo-50 border-none rounded-xl px-3 py-1.5 text-[11px] font-bold text-indigo-600 outline-none cursor-pointer"
                          >
                            <option value="Project Help">Ask for Help</option>
                            <option value="Homework">Homework</option>
                            <option value="Coding Tip">Coding Tip</option>
                            <option value="Resource">Resource</option>
                          </select>
                        )}
                      </div>
                    )}
                  </div>
                  {isExpanded && (
                    <button onClick={() => resetForm()} className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
                      <X size={20} />
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="animate-in slide-in-from-top-2 duration-300 px-1">
                    <textarea
                      autoFocus
                      placeholder="What's the news?"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      className="w-full bg-transparent border-none p-0 text-[16px] text-gray-700 placeholder-gray-300 focus:ring-0 focus:outline-none outline-none ring-0 shadow-none resize-none min-h-[140px] mb-4 font-medium"
                      style={{ border: 'none', boxShadow: 'none' }}
                    />

                    {/* Poll Builder UI */}
                    {showPollBuilder && (
                      <div className="bg-blue-50/50 rounded-3xl p-5 mb-6 border border-dashed border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={16} /> Poll
                          </h4>
                        </div>
                        <input
                          type="text"
                          placeholder="Question?"
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="space-y-2">
                          {pollOptions.map((opt, i) => (
                            <input
                              key={i}
                              type="text"
                              placeholder={`Option ${i+1}`}
                              value={opt}
                              onChange={(e) => {
                                const n = [...pollOptions];
                                n[i] = e.target.value;
                                setPollOptions(n);
                              }}
                              className="w-full bg-white border border-gray-50 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          ))}
                          <button onClick={() => setPollOptions([...pollOptions, ''])} className="text-[10px] font-bold text-blue-500">+ Add option</button>
                        </div>
                      </div>
                    )}

                    {/* Media Preview */}
                    {attachedFile && (
                      <div className="relative mb-6 rounded-3xl overflow-hidden group max-w-sm border border-gray-100 shadow-lg">
                        {attachedFile.type === 'video' ? (
                          <video src={attachedFile.url} className="w-full h-48 object-cover" />
                        ) : (
                          <img src={attachedFile.url} className="w-full h-48 object-cover" alt="Preview" />
                        )}
                        <button onClick={() => setAttachedFile(null)} className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full hover:bg-black transition-all">
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {/* Tagged Users */}
                    {taggedUsers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {taggedUsers.map(user => (
                          <span key={user.id} className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-[11px] font-bold border border-gray-100">
                            @{user.name.split(' ')[0]}
                            <button onClick={() => setTaggedUsers(prev => prev.filter(u => u.id !== user.id))} className="hover:text-red-500"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Creator Footer matching Screenshot */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,video/*,image/gif" />
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all" title="Upload Media"><ImageIcon size={20}/></button>
                        <button onClick={() => setShowPollBuilder(!showPollBuilder)} className={`p-3 rounded-2xl transition-all ${showPollBuilder ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`} title="Poll"><BarChart3 size={20}/></button>
                        
                        <div className="relative">
                          <button onClick={() => setShowTagList(!showTagList)} className={`p-3 rounded-2xl transition-all ${showTagList ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'}`} title="Tag User"><AtSign size={20}/></button>
                          {showTagList && (
                            <div className="absolute bottom-full left-0 mb-3 w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 p-2 overflow-y-auto max-h-48 no-scrollbar">
                               {MOCK_USERS.map(user => (
                                <button key={user.id} onClick={() => { if(!taggedUsers.find(u => u.id === user.id)) setTaggedUsers(prev => [...prev, user]); setShowTagList(false); }} className="w-full flex items-center gap-2 p-2 hover:bg-blue-50 rounded-xl transition-all text-left">
                                  <img src={user.avatar} className="w-7 h-7 rounded-lg" alt=""/><span className="text-xs font-bold text-gray-700">{user.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Emoji Picker Implementation */}
                        <div className="relative">
                          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-3 rounded-2xl transition-all ${showEmojiPicker ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`} title="Emojis"><Smile size={20}/></button>
                          {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-3 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 p-3 grid grid-cols-4 gap-2 animate-in zoom-in-95">
                               {EMOJIS.map(e => (
                                 <button key={e} onClick={() => addEmoji(e)} className="text-xl hover:scale-125 transition-transform p-1">{e}</button>
                               ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button onClick={() => resetForm()} className="text-[13px] font-black text-gray-400 hover:text-gray-600 px-4 uppercase tracking-widest">Discard</button>
                        <button
                          onClick={handleInternalCreatePost}
                          disabled={!postText.trim() && !pollQuestion && !attachedFile}
                          className="px-8 py-3.5 rounded-[22px] text-[15px] font-black shadow-xl transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 bg-[#A0E2F1] text-[#00ADEF] shadow-blue-200/50 hover:scale-[1.02]"
                        >
                          <Send size={18} />
                          Post to Feed
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feed Content */}
          <div className="space-y-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={onLike} 
                  onSave={onSave}
                  onPin={onPin}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReport={onReportPost}
                />
              ))
            ) : (
              <div className="p-24 text-center bg-white rounded-[48px] border border-dashed border-gray-200">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <BookOpen className="text-gray-200" size={40} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-800 mb-2">No updates yet</h3>
                 <p className="text-gray-400 text-sm font-medium">Follow channels or start a conversation yourself!</p>
              </div>
            )}
          </div>

          {viewMode === 'channels' && !selectedChannelId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6 duration-700">
              {channels.map(channel => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onFollow={onFollow}
                  onClick={setSelectedChannelId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Widgets Area */}
        {!selectedChannelId && (
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-gray-800 text-[14px] uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={18} className="text-[#FFB800]" />
                  Hub Mentors
                </h3>
              </div>
              <div className="space-y-5">
                {MOCK_USERS.filter(u => (u.gradeLevel || 0) >= 8).map((user) => (
                  <div key={user.id} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 -m-2 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <img src={user.avatar} className="w-11 h-11 rounded-2xl border border-gray-100" alt="" />
                         <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 border-2 border-white rounded-full p-1 shadow-sm">
                            <Star size={8} className="text-white fill-white" />
                         </div>
                      </div>
                      <span className="text-[14px] font-bold text-gray-700 group-hover:text-[#00ADEF] transition-colors">{user.name}</span>
                    </div>
                    <div className="px-3 py-1 bg-indigo-50 rounded-xl">
                      <p className="text-[11px] font-black text-indigo-600">Lvl {user.gradeLevel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[40px] p-10 shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000 scale-125">
                <GraduationCap size={150} />
              </div>
              <h3 className="font-black text-2xl mb-4 relative z-10 leading-tight">Join the<br/>Mentor Squad</h3>
              <p className="text-[13px] text-white/80 mb-10 font-medium relative z-10 leading-relaxed">Help others solve coding challenges and earn exclusive rewards.</p>
              <button className="w-full bg-white text-indigo-600 py-4 rounded-[22px] text-[14px] font-black hover:bg-gray-50 transition-all shadow-xl relative z-10 uppercase tracking-widest">Apply to Help</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CommunityView;
