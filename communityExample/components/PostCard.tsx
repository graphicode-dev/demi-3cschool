
import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, 
  Globe, Users as UsersIcon, Smile, CornerDownRight, Pin, 
  Trash2, Edit3, Link2, ChevronDown, ThumbsUp, Laugh, Zap, Star,
  ShieldCheck, CheckCircle2, AlertTriangle, Flag, HelpCircle, BookOpen, Check,
  AtSign, BarChart3, Paperclip
} from 'lucide-react';
import { Post, Comment } from '../types';
import { CURRENT_USER } from '../constants';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newContent: string) => void;
  onReport?: (id: string, reason: string) => void;
  showReportCount?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onSave, 
  onPin, 
  onDelete, 
  onEdit, 
  onReport,
  showReportCount = false
}) => {
  const [showComments, setShowComments] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(post.content);
  const [commentSort, setCommentSort] = useState<'newest' | 'top'>('newest');
  const [showReactPicker, setShowReactPicker] = useState(false);

  const copyLink = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    alert('Link copied to clipboard!');
    setShowMenu(false);
  };

  const handleReport = () => {
    const reason = window.prompt('Reason for reporting this post?');
    if (reason && onReport) {
      onReport(post.id, reason);
      alert('Report submitted to community managers.');
    }
    setShowMenu(false);
  };

  const sortedComments = [...post.comments].sort((a, b) => {
    if (a.isSolution) return -1;
    if (b.isSolution) return 1;
    if (commentSort === 'top') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categoryColors: Record<string, string> = {
    'Project Help': 'bg-red-50 text-red-600 border-red-100',
    'Homework': 'bg-amber-50 text-amber-600 border-amber-100',
    'Coding Tip': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Resource': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  const reactions = [
    { label: 'Like', icon: ThumbsUp, color: 'text-blue-500' },
    { label: 'Love', icon: Heart, color: 'text-red-500' },
    { label: 'Haha', icon: Laugh, color: 'text-yellow-500' },
    { label: 'Wow', icon: Zap, color: 'text-orange-500' },
    { label: 'Star', icon: Star, color: 'text-yellow-400' },
  ];

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => {
    return (
      <div className={`flex gap-3 ${isReply ? 'ml-10 mt-3' : 'mt-5'}`}>
        {isReply && <CornerDownRight size={14} className="text-gray-300 mt-2 flex-shrink-0" />}
        <img src={comment.author.avatar} alt="" className="w-9 h-9 rounded-xl flex-shrink-0 border border-gray-100 shadow-sm" />
        <div className="flex-1">
          <div className={`bg-white border rounded-2xl p-4 shadow-sm relative ${comment.isSolution ? 'border-emerald-500 ring-2 ring-emerald-50' : 'border-gray-100'}`}>
            {comment.isSolution && (
              <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                <Check size={12} strokeWidth={3} /> Best Solution
              </div>
            )}
            <div className="flex items-center justify-between mb-1 gap-4">
              <div className="flex items-center gap-1.5">
                <p className="text-[12px] font-bold text-gray-800">{comment.author.name}</p>
                {comment.author.role === 'manager' && <ShieldCheck size={10} className="text-[#00ADEF]" />}
                {(comment.author.gradeLevel || 0) >= 8 && <Zap size={10} className="text-yellow-500 fill-yellow-500" />}
              </div>
              <p className="text-[10px] text-gray-400 font-medium">{comment.createdAt}</p>
            </div>
            <p className="text-[13px] text-gray-600 leading-relaxed">{comment.content}</p>
          </div>
          <div className="flex items-center gap-5 mt-2 ml-2">
            <button className="text-[11px] font-bold text-gray-400 hover:text-[#00ADEF] transition-colors flex items-center gap-1"><ThumbsUp size={12}/> Helpful</button>
            <button className="text-[11px] font-bold text-gray-400 hover:text-[#00ADEF] transition-colors">Reply</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-lg ${post.isPinned ? 'ring-2 ring-[#00ADEF]/20' : ''} ${post.isOfficial ? 'border-l-8 border-l-[#00ADEF]' : ''}`}>
      {post.isPinned && (
        <div className="bg-[#E0F4FF] px-8 py-2.5 flex items-center gap-2">
          <Pin size={14} className="text-[#00ADEF] fill-[#00ADEF]" />
          <span className="text-[10px] font-black text-[#00ADEF] uppercase tracking-widest">Pinned Post</span>
        </div>
      )}
      
      {post.category && post.category !== 'General' && (
        <div className={`px-8 py-3 flex items-center justify-between border-b ${categoryColors[post.category]}`}>
          <div className="flex items-center gap-2">
            <BookOpen size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{post.category}</span>
          </div>
          {post.status && (
            <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter ${post.status === 'Solved' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white text-current border-current'}`}>
              {post.status}
            </span>
          )}
        </div>
      )}

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
               <img src={post.author.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-gray-50 border border-gray-100" />
               {(post.author.gradeLevel || 0) >= 8 && (
                 <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-white shadow-sm">
                   <Star size={10} className="text-white fill-white" />
                 </div>
               )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-black text-gray-800 tracking-tight">
                  {post.author.name}
                  {post.feeling && <span className="text-gray-400 font-medium ml-1">is feeling {post.feeling}</span>}
                </p>
                {(post.author.role === 'manager' || post.isOfficial) && <CheckCircle2 size={16} className="text-[#00ADEF]" />}
                {post.author.role === 'instructor' && <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">Teacher</span>}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                <span>Lvl {post.author.gradeLevel || 1} Student</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{post.createdAt}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <Globe size={11} className="text-gray-300" />
              </div>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-300 hover:text-gray-500 p-2.5 hover:bg-gray-50 rounded-xl transition-all">
              <MoreHorizontal size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden py-1.5 animate-in zoom-in-95">
                {!post.category || post.category === 'General' ? (
                   <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                    <Edit3 size={16} /> Edit
                  </button>
                ) : null}
                <button onClick={copyLink} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors">
                  <Link2 size={16} /> Copy Link
                </button>
                <button onClick={handleReport} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-orange-500 hover:bg-orange-50 transition-colors">
                  <Flag size={16} /> Report
                </button>
                <div className="h-px bg-gray-50 my-1.5 mx-2"></div>
                <button onClick={() => { onDelete(post.id); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          {isEditing ? (
            <div className="animate-in fade-in slide-in-from-top-1">
              <textarea 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[15px] focus:ring-2 focus:ring-[#00ADEF]/20 outline-none h-32 mb-3"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => { onEdit(post.id, editValue); setIsEditing(false); }}
                  className="bg-[#00ADEF] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#00ADEF]/20"
                >
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 text-xs font-bold px-4">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 text-[16px] leading-relaxed font-medium whitespace-pre-wrap">
                {post.content}
              </p>
              {post.taggedUsers && post.taggedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.taggedUsers.map(u => (
                    <span key={u.id} className="inline-flex items-center gap-1 text-[12px] font-bold text-[#00ADEF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                      <AtSign size={11} /> {u.name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {post.poll && (
          <div className="bg-[#f8fafc] border border-gray-100 rounded-3xl p-6 mb-6">
            <h4 className="text-[14px] font-black text-gray-800 mb-5 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#00ADEF]" />
              {post.poll.question}
            </h4>
            <div className="space-y-3">
              {post.poll.options.map(opt => {
                const percent = post.poll ? Math.round((opt.votes / post.poll.totalVotes) * 100) : 0;
                return (
                  <button 
                    key={opt.id} 
                    onClick={() => setVoted(true)}
                    className="w-full relative h-12 bg-white border border-gray-100 rounded-[18px] overflow-hidden group hover:border-[#00ADEF] transition-all"
                  >
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#E0F4FF] transition-all duration-1000" 
                      style={{ width: voted ? `${percent}%` : '0%' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-5">
                      <span className="text-[13px] font-bold text-gray-700">{opt.text}</span>
                      {voted && <span className="text-[11px] font-black text-[#00ADEF]">{percent}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(post.image || post.video || post.gif) && (
          <div className="rounded-[32px] overflow-hidden mb-6 border border-gray-50 bg-black shadow-inner">
            {post.image && <img src={post.image} alt="" className="w-full object-cover max-h-[500px]" />}
            {post.gif && <img src={post.gif} alt="" className="w-full object-cover max-h-[500px]" />}
            {post.video && <video src={post.video} controls className="w-full max-h-[500px]" />}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button 
                onClick={() => onLike(post.id)}
                onMouseEnter={() => setShowReactPicker(true)}
                onMouseLeave={() => setShowReactPicker(false)}
                className="flex items-center gap-2 text-[#64748b] hover:text-[#00ADEF] transition-all font-bold text-[13px] group/btn"
              >
                <ThumbsUp size={18} className={post.likes > 0 ? 'text-[#00ADEF]' : ''} /> 
                <span>{post.likes > 0 ? post.likes : 'React'}</span>
              </button>
              {showReactPicker && (
                <div 
                  onMouseEnter={() => setShowReactPicker(true)}
                  onMouseLeave={() => setShowReactPicker(false)}
                  className="absolute bottom-full left-0 mb-3 flex gap-2.5 bg-white border border-gray-100 shadow-2xl rounded-full px-4 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  {reactions.map(r => (
                    <button key={r.label} onClick={() => { onLike(post.id); setShowReactPicker(false); }} className={`p-1.5 hover:scale-125 transition-transform ${r.color}`}>
                      <r.icon size={18} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-[#64748b] hover:text-indigo-600 transition-all font-bold text-[13px]">
              <MessageSquare size={18} /> 
              <span>{post.comments.length} <span className="hidden sm:inline">Comment</span></span>
            </button>
            <button className="flex items-center gap-2 text-[#64748b] hover:text-green-600 transition-all font-bold text-[13px]">
              <Share2 size={18} /> 
              <span className="hidden sm:inline">Share</span>
            </button>
            <button onClick={copyLink} className="flex items-center gap-2 text-[#64748b] hover:text-blue-500 transition-all font-bold text-[13px]">
              <Link2 size={18} />
              <span className="hidden sm:inline">Link</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onPin(post.id)} className={`p-2.5 rounded-xl transition-all ${post.isPinned ? 'text-[#00ADEF] bg-[#E0F4FF]' : 'text-gray-300 hover:text-[#00ADEF] hover:bg-gray-50'}`}>
              <Pin size={18} fill={post.isPinned ? 'currentColor' : 'none'} />
            </button>
            <button onClick={() => onSave(post.id)} className={`p-2.5 rounded-xl transition-all ${post.isSaved ? 'text-[#00ADEF] bg-[#E0F4FF]' : 'text-gray-300 hover:text-[#00ADEF] hover:bg-gray-50'}`}>
              <Bookmark size={20} fill={post.isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-8 space-y-4 pt-6 bg-[#fcfdfe] border-t border-gray-50 rounded-[40px] px-8 pb-8 -mx-8 -mb-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Discussion Thread</h5>
              <div className="flex gap-4">
                <button onClick={() => setCommentSort('newest')} className={`text-[10px] font-black uppercase tracking-tight ${commentSort === 'newest' ? 'text-[#00ADEF]' : 'text-gray-300'}`}>Newest</button>
                <button onClick={() => setCommentSort('top')} className={`text-[10px] font-black uppercase tracking-tight ${commentSort === 'top' ? 'text-[#00ADEF]' : 'text-gray-300'}`}>Top Rated</button>
              </div>
            </div>
            
            {sortedComments.length > 0 ? (
              sortedComments.map(comment => <CommentItem key={comment.id} comment={comment} />)
            ) : (
              <p className="text-center py-6 text-[13px] text-gray-400 font-medium">No comments yet. Start the conversation!</p>
            )}

            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
              <img src={CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-xl shadow-sm border border-white" />
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#00ADEF]/10 focus:border-[#00ADEF] transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
