import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePostComments } from "@/features/dashboard/classroom/community/api";
import {
    Heart,
    MessageSquare,
    Bookmark,
    MoreHorizontal,
    Globe,
    Users as UsersIcon,
    CornerDownRight,
    Pin,
    Trash2,
    Edit3,
    Link2,
    ThumbsUp,
    Zap,
    Star,
    ShieldCheck,
    CheckCircle2,
    Flag,
    BookOpen,
    Check,
    AtSign,
    BarChart3,
    Forward,
    Send,
} from "lucide-react";
import type { Post, Comment } from "../types";
import { authStore } from "@/auth";

interface PostCardProps {
    post: Post;
    onLike: (id: string) => void;
    onSave: (id: string) => void;
    onPin: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newContent: string) => void;
    onReport?: (id: string, reason: string) => void;
    onComment?: (postId: string, content: string, parentId?: string) => void;
    showReportCount?: boolean;
}

export function PostCard({
    post,
    onLike,
    onSave,
    onPin,
    onDelete,
    onEdit,
    onReport,
    onComment,
    showReportCount = false,
}: PostCardProps) {
    const { user } = authStore();
    const { t } = useTranslation("communityManagement");
    const [showComments, setShowComments] = useState(false);
    const [voted, setVoted] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(post.content);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    // Fetch comments when comment section is opened
    const { data: fetchedComments, isLoading: commentsLoading } =
        usePostComments(showComments ? Number(post.id) : null, {
            enabled: showComments,
        });

    // Admin panel always has admin privileges
    const isAdmin = true;

    // Format relative time
    const formatRelativeTime = (dateString: string) => {
        if (!dateString || dateString === "Just now") return dateString;

        // Parse date - handle "YYYY-MM-DD HH:mm:ss" format from API (local time)
        let date: Date;
        if (dateString.includes(" ") && !dateString.includes("T")) {
            // Convert "2026-02-06 21:09:04" to ISO format (treated as local time)
            date = new Date(dateString.replace(" ", "T"));
        } else {
            date = new Date(dateString);
        }

        // Check for invalid date
        if (isNaN(date.getTime())) return dateString;

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        // Handle negative diff (future dates)
        if (diffMs < 0) return "Just now";

        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        // Less than 60 seconds = "Just now"
        if (diffSecs < 60) return "Just now";
        // Less than 60 minutes = show minutes
        if (diffMins < 60) return `${diffMins}m ago`;
        // Less than 24 hours = show hours
        if (diffHours < 24) return `${diffHours}h ago`;
        // Less than 7 days = show days
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const copyLink = () => {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postUrl);
        alert(t("postCard.linkCopied", "Link copied to clipboard!"));
        setShowMenu(false);
    };

    const handleReport = () => {
        const reason = window.prompt(
            t("postCard.reportReason", "Reason for reporting this post?")
        );
        if (reason && onReport) {
            onReport(post.id, reason);
            alert(
                t(
                    "postCard.reportSubmitted",
                    "Report submitted to community managers."
                )
            );
        }
        setShowMenu(false);
    };

    // Use fetched comments or fall back to post.comments
    const comments = fetchedComments || post.comments || [];
    const sortedComments = [...comments].sort((a, b) => {
        if (a.isSolution) return -1;
        if (b.isSolution) return 1;
        return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    const categoryColors: Record<string, string> = {
        "Project Help":
            "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
        Homework:
            "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
        "Coding Tip":
            "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
        Resource:
            "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
    };

    const CommentItem = ({
        comment,
        depth = 0,
    }: {
        comment: Comment;
        depth?: number;
    }) => {
        const isReply = depth > 0;
        const maxDepth = 3;

        return (
            <div
                className={`${isReply ? "mt-3" : "mt-5"}`}
                style={{
                    marginLeft: isReply
                        ? `${Math.min(depth, maxDepth) * 24}px`
                        : 0,
                }}
            >
                <div className="flex gap-3">
                    {isReply && (
                        <CornerDownRight
                            size={14}
                            className="text-gray-300 dark:text-gray-600 mt-2 shrink-0"
                        />
                    )}
                    {comment.author.avatar ? (
                        <img
                            src={comment.author.avatar}
                            alt=""
                            className="w-9 h-9 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-gray-700 border border-gray-100 dark:border-gray-600"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                            {comment.author.name.slice(0, 2)}
                        </div>
                    )}
                    <div className="flex-1">
                        <div
                            className={`bg-white dark:bg-gray-800 border rounded-2xl p-4 shadow-sm relative ${comment.isSolution ? "border-emerald-500 ring-2 ring-emerald-50 dark:ring-emerald-900/30" : "border-gray-100 dark:border-gray-700"}`}
                        >
                            {comment.isSolution && (
                                <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest w-fit">
                                    <Check size={12} strokeWidth={3} />{" "}
                                    {t(
                                        "postCard.bestSolution",
                                        "Best Solution"
                                    )}
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-1 gap-4">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-[12px] font-bold text-gray-800 dark:text-gray-200">
                                        {comment.author.name}
                                    </p>
                                    {comment.author.role === "manager" && (
                                        <ShieldCheck
                                            size={10}
                                            className="text-[#00ADEF]"
                                        />
                                    )}
                                    {(comment.author.gradeLevel || 0) >= 8 && (
                                        <Zap
                                            size={10}
                                            className="text-yellow-500 fill-yellow-500"
                                        />
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                                    {formatRelativeTime(comment.createdAt)}
                                </p>
                            </div>
                            <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                        <div className="flex items-center gap-5 mt-2 ml-2">
                            <button className="text-[11px] font-bold text-gray-400 hover:text-[#00ADEF] transition-colors flex items-center gap-1">
                                <ThumbsUp size={12} />{" "}
                                {t("postCard.helpful", "Helpful")}
                            </button>
                            <button
                                onClick={() => {
                                    setReplyingTo(
                                        replyingTo === comment.id
                                            ? null
                                            : comment.id
                                    );
                                    setReplyText("");
                                }}
                                className={`text-[11px] font-bold transition-colors ${replyingTo === comment.id ? "text-[#00ADEF]" : "text-gray-400 hover:text-[#00ADEF]"}`}
                            >
                                {t("postCard.reply", "Reply")}
                            </button>
                        </div>

                        {/* Reply input */}
                        {replyingTo === comment.id && (
                            <div className="flex gap-3 mt-3 ml-2 animate-in slide-in-from-top-2">
                                <img
                                    src={user?.image}
                                    alt=""
                                    className="w-8 h-8 rounded-lg shrink-0 border border-gray-100 dark:border-gray-700"
                                />
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) =>
                                            setReplyText(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" &&
                                                replyText.trim() &&
                                                onComment
                                            ) {
                                                onComment(
                                                    post.id,
                                                    replyText.trim(),
                                                    comment.id
                                                );
                                                setReplyText("");
                                                setReplyingTo(null);
                                            }
                                            if (e.key === "Escape") {
                                                setReplyingTo(null);
                                                setReplyText("");
                                            }
                                        }}
                                        placeholder={t("postCard.replyTo", {
                                            name: comment.author.name,
                                            defaultValue: `Reply to ${comment.author.name}...`,
                                        })}
                                        className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2 px-4 text-[13px] text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#00ADEF]/20 focus:border-[#00ADEF] transition-all"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            if (replyText.trim() && onComment) {
                                                onComment(
                                                    post.id,
                                                    replyText.trim(),
                                                    comment.id
                                                );
                                                setReplyText("");
                                                setReplyingTo(null);
                                            }
                                        }}
                                        disabled={!replyText.trim()}
                                        className="bg-[#00ADEF] text-white p-2 rounded-xl hover:bg-[#0095CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Render nested replies recursively */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-1">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-lg ${post.isPinned ? "ring-2 ring-[#00ADEF]/20" : ""} ${post.isOfficial ? "border-l-8 border-l-[#00ADEF]" : ""}`}
        >
            {post.isPinned && (
                <div className="bg-[#E0F4FF] dark:bg-[#00ADEF]/20 px-8 py-2.5 flex items-center gap-2">
                    <Pin size={14} className="text-[#00ADEF] fill-[#00ADEF]" />
                    <span className="text-[10px] font-black text-[#00ADEF] uppercase tracking-widest">
                        {t("postCard.pinnedPost", "Pinned Post")}
                    </span>
                </div>
            )}

            {post.category && post.category !== "General" && (
                <div
                    className={`px-8 py-3 flex items-center justify-between border-b ${categoryColors[post.category]}`}
                >
                    <div className="flex items-center gap-2">
                        <BookOpen size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {post.category}
                        </span>
                    </div>
                    {post.status && (
                        <span
                            className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-tighter ${post.status === "Solved" ? "bg-emerald-500 text-white border-emerald-600" : "bg-white dark:bg-gray-700 text-current border-current"}`}
                        >
                            {post.status}
                        </span>
                    )}
                </div>
            )}

            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {post.author.avatar ? (
                                <img
                                    src={post.author.avatar}
                                    alt=""
                                    className="w-12 h-12 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-gray-700 border border-gray-100 dark:border-gray-600"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                                    {post.author.name.slice(0, 2)}
                                </div>
                            )}
                            {(post.author.gradeLevel || 0) >= 8 && (
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-lg flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm">
                                    <Star
                                        size={10}
                                        className="text-white fill-white"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-[15px] font-black text-gray-800 dark:text-gray-100 tracking-tight">
                                    {post.author.name}
                                    {post.feeling && (
                                        <span className="text-gray-400 dark:text-gray-500 font-medium ml-1">
                                            is feeling {post.feeling}
                                        </span>
                                    )}
                                </p>
                                {(post.author.role === "manager" ||
                                    post.isOfficial) && (
                                    <CheckCircle2
                                        size={16}
                                        className="text-[#00ADEF]"
                                    />
                                )}
                                {post.author.role === "instructor" && (
                                    <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">
                                        {t("postCard.teacher", "Teacher")}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                                <span>
                                    {t("postCard.lvl", "Lvl")}{" "}
                                    {post.author.gradeLevel || 1}{" "}
                                    {t("postCard.student", "Student")}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                <span>
                                    {formatRelativeTime(post.createdAt)}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                                {post.audience === "Group" ? (
                                    <UsersIcon
                                        size={11}
                                        className="text-gray-300 dark:text-gray-600"
                                    />
                                ) : (
                                    <Globe
                                        size={11}
                                        className="text-gray-300 dark:text-gray-600"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl z-50 overflow-hidden py-1.5 animate-in zoom-in-95">
                                {!post.category ||
                                post.category === "General" ? (
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Edit3 size={16} />{" "}
                                        {t("postCard.edit", "Edit")}
                                    </button>
                                ) : null}
                                <button
                                    onClick={copyLink}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Link2 size={16} />{" "}
                                    {t("postCard.copyLink", "Copy Link")}
                                </button>
                                <button
                                    onClick={handleReport}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                                >
                                    <Flag size={16} />{" "}
                                    {t("postCard.report", "Report")}
                                </button>
                                <div className="h-px bg-gray-50 dark:bg-gray-700 my-1.5 mx-2"></div>
                                <button
                                    onClick={() => {
                                        onDelete(post.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 size={16} />{" "}
                                    {t("postCard.delete", "Delete")}
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
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl p-4 text-[15px] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20 outline-none h-32 mb-3"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        onEdit(post.id, editValue);
                                        setIsEditing(false);
                                    }}
                                    className="bg-[#00ADEF] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#00ADEF]/20"
                                >
                                    {t("postCard.saveChanges", "Save Changes")}
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-400 text-xs font-bold px-4"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-700 dark:text-gray-200 text-[16px] leading-relaxed font-medium whitespace-pre-wrap">
                                {post.content}
                            </p>
                            {post.taggedUsers &&
                                post.taggedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {post.taggedUsers.map((u) => (
                                            <span
                                                key={u.id}
                                                className="inline-flex items-center gap-1 text-[12px] font-bold text-[#00ADEF] bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-800"
                                            >
                                                <AtSign size={11} />{" "}
                                                {u.name.split(" ")[0]}
                                            </span>
                                        ))}
                                    </div>
                                )}
                        </>
                    )}
                </div>

                {post.poll && (
                    <div className="bg-[#f8fafc] dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-3xl p-6 mb-6">
                        <h4 className="text-[14px] font-black text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                            <BarChart3 size={18} className="text-[#00ADEF]" />
                            {post.poll.question}
                        </h4>
                        <div className="space-y-3">
                            {post.poll.options.map((opt) => {
                                const percent = post.poll
                                    ? Math.round(
                                          (opt.votes / post.poll.totalVotes) *
                                              100
                                      )
                                    : 0;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => setVoted(true)}
                                        className="w-full relative h-12 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-600 rounded-landing-badge overflow-hidden group hover:border-[#00ADEF] transition-all"
                                    >
                                        <div
                                            className="absolute left-0 top-0 h-full bg-[#E0F4FF] dark:bg-[#00ADEF]/20 transition-all duration-1000"
                                            style={{
                                                width: voted
                                                    ? `${percent}%`
                                                    : "0%",
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-between px-5">
                                            <span className="text-[13px] font-bold text-gray-700 dark:text-gray-200">
                                                {opt.text}
                                            </span>
                                            {voted && (
                                                <span className="text-[11px] font-black text-[#00ADEF]">
                                                    {percent}%
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {(post.image || post.video || post.gif) && (
                    <div className="rounded-[32px] overflow-hidden mb-6 border border-gray-50 dark:border-gray-700 bg-black shadow-inner">
                        {post.image && (
                            <img
                                src={post.image}
                                alt=""
                                className="w-full object-cover max-h-[500px]"
                            />
                        )}
                        {post.gif && (
                            <img
                                src={post.gif}
                                alt=""
                                className="w-full object-cover max-h-[500px]"
                            />
                        )}
                        {post.video && (
                            <video
                                src={post.video}
                                controls
                                className="w-full max-h-[500px]"
                            />
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => onLike(post.id)}
                            className="flex items-center gap-2 text-[#64748b] dark:text-gray-400 hover:text-[#00ADEF] transition-all font-bold text-[13px]"
                        >
                            <ThumbsUp
                                size={18}
                                className={
                                    post.likes > 0 ? "text-[#00ADEF]" : ""
                                }
                            />
                            <span>
                                {post.likes > 0
                                    ? post.likes
                                    : t("postCard.like", "Like")}
                            </span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center gap-2 text-[#64748b] dark:text-gray-400 hover:text-indigo-600 transition-all font-bold text-[13px]"
                        >
                            <MessageSquare size={18} />
                            <span>
                                {post.commentsCount}{" "}
                                <span className="hidden sm:inline">
                                    {t("postCard.comment", "Comment")}
                                </span>
                            </span>
                        </button>
                        <button className="flex items-center gap-2 text-[#64748b] dark:text-gray-400 hover:text-green-600 transition-all font-bold text-[13px]">
                            <Forward size={18} />
                            <span className="hidden sm:inline">
                                {t("postCard.forward", "Forward")}
                            </span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPin(post.id)}
                            className={`p-2.5 rounded-xl transition-all ${post.isPinned ? "text-[#00ADEF] bg-[#E0F4FF] dark:bg-[#00ADEF]/20" : "text-gray-300 dark:text-gray-600 hover:text-[#00ADEF] hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                            <Pin
                                size={18}
                                fill={post.isPinned ? "currentColor" : "none"}
                            />
                        </button>
                        <button
                            onClick={() => onSave(post.id)}
                            className={`p-2.5 rounded-xl transition-all ${post.isSaved ? "text-[#00ADEF] bg-[#E0F4FF] dark:bg-[#00ADEF]/20" : "text-gray-300 dark:text-gray-600 hover:text-[#00ADEF] hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                            <Bookmark
                                size={20}
                                fill={post.isSaved ? "currentColor" : "none"}
                            />
                        </button>
                    </div>
                </div>

                {showComments && (
                    <div className="mt-8 space-y-4 pt-6 bg-[#fcfdfe] dark:bg-gray-700/30 border-t border-gray-50 dark:border-gray-700 rounded-[40px] px-8 pb-8 -mx-8 -mb-8 animate-in slide-in-from-bottom-4 duration-300">
                        <h5 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                            {t(
                                "postCard.discussionThread",
                                "Discussion Thread"
                            )}
                        </h5>

                        {commentsLoading ? (
                            <div className="flex justify-center py-6">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00ADEF]"></div>
                            </div>
                        ) : sortedComments.length > 0 ? (
                            sortedComments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                />
                            ))
                        ) : (
                            <p className="text-center py-6 text-[13px] text-gray-400 dark:text-gray-500 font-medium">
                                {t(
                                    "postCard.beFirstToComment",
                                    "Be the first to comment on this post"
                                )}
                            </p>
                        )}

                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-600">
                            {post.author.avatar ? (
                                <img
                                    src={user?.image}
                                    alt=""
                                    className="w-10 h-10 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-gray-700 border border-gray-100 dark:border-gray-600"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                                    {post.author.name.slice(0, 2)}
                                </div>
                            )}
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) =>
                                        setCommentText(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            commentText.trim() &&
                                            onComment
                                        ) {
                                            onComment(
                                                post.id,
                                                commentText.trim()
                                            );
                                            setCommentText("");
                                        }
                                    }}
                                    placeholder={t(
                                        "postCard.addComment",
                                        "Add a comment..."
                                    )}
                                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl py-3 px-5 text-[14px] text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-[#00ADEF]/10 focus:border-[#00ADEF] transition-all shadow-sm"
                                />
                                <button
                                    onClick={() => {
                                        if (commentText.trim() && onComment) {
                                            onComment(
                                                post.id,
                                                commentText.trim()
                                            );
                                            setCommentText("");
                                        }
                                    }}
                                    disabled={!commentText.trim()}
                                    className="bg-[#00ADEF] text-white p-3 rounded-xl hover:bg-[#0095CC] transition-colors shadow-lg shadow-[#00ADEF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostCard;
