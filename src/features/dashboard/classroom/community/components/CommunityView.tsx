import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Plus,
    Trophy,
    LayoutGrid,
    LayoutList,
    BookmarkCheck,
    Image as ImageIcon,
    Globe,
    Users as UsersIcon,
    AtSign,
    BarChart3,
    X,
    User as UserIcon,
    ArrowLeft,
    CheckCircle2,
    Send,
    BookOpen,
    GraduationCap,
    Star,
    Smile,
} from "lucide-react";
import { PostCard } from "./PostCard";
import { ChannelCard } from "./ChannelCard";
import type {
    Post,
    Channel,
    Audience,
    CommunityUser,
    PostCategory,
    CommunityTab,
} from "../types";
import { authStore } from "@/auth";

const FEELINGS = [
    { emoji: "😊", label: "Happy" },
    { emoji: "🚀", label: "Excited" },
    { emoji: "💻", label: "Coding" },
    { emoji: "🤔", label: "Thinking" },
    { emoji: "📚", label: "Learning" },
    { emoji: "🎉", label: "Celebrating" },
    { emoji: "😴", label: "Tired" },
];

const EMOJIS = [
    "😂",
    "❤️",
    "🔥",
    "✨",
    "👍",
    "🙏",
    "🙌",
    "💯",
    "👋",
    "🤖",
    "🎓",
    "💡",
    "✅",
    "🌈",
    "⚡",
    "🌟",
];

interface CommunityViewProps {
    posts: Post[];
    channels: Channel[];
    activeTab?: CommunityTab;
    onTabChange?: (tab: CommunityTab) => void;
    onPostsUpdate: (posts: Post[]) => void;
    onChannelsUpdate: (channels: Channel[]) => void;
    onLike: (id: string) => void;
    onSave: (id: string) => void;
    onPin: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, content: string) => void;
    onFollow: (id: string) => void;
    onCreatePost: (post: Post) => void;
    onVote?: (postId: string, optionId: string) => void;
    onReportPost?: (id: string, reason: string) => void;
    onComment?: (postId: string, content: string, parentId?: string) => void;
}

export function CommunityView({
    posts,
    channels,
    activeTab,
    onTabChange,
    onLike,
    onSave,
    onPin,
    onDelete,
    onEdit,
    onFollow,
    onCreatePost,
    onVote,
    onReportPost,
    onComment,
}: CommunityViewProps) {
    const { user } = authStore();
    const { t } = useTranslation("community");
    // Use controlled tab if provided, otherwise use internal state
    const [internalViewMode, setInternalViewMode] =
        useState<CommunityTab>("feed");
    const viewMode = activeTab ?? internalViewMode;
    const setViewMode = (tab: CommunityTab) => {
        if (onTabChange) {
            onTabChange(tab);
        } else {
            setInternalViewMode(tab);
        }
    };
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
        null
    );
    const [hubFilter, setHubFilter] = useState<PostCategory | "All">("All");

    const [postText, setPostText] = useState("");
    const [postCategory, setPostCategory] =
        useState<PostCategory>("Project Help");
    const [audience, setAudience] = useState<Audience>("Public");
    const [feeling, setFeeling] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedFile, setAttachedFile] = useState<{
        url: string;
        type: "image" | "video" | "gif";
    } | null>(null);

    const [showPollBuilder, setShowPollBuilder] = useState(false);
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);

    const [taggedUsers, setTaggedUsers] = useState<CommunityUser[]>([]);
    const [showTagList, setShowTagList] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFeelingPicker, setShowFeelingPicker] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const type = file.type.startsWith("video")
            ? "video"
            : file.type === "image/gif"
              ? "gif"
              : "image";
        setAttachedFile({ url: URL.createObjectURL(file), type });
    };

    const handleInternalCreatePost = () => {
        if (!postText.trim() && !pollQuestion && !attachedFile) return;

        const newPost: Post = {
            commentsCount: 0,
            id: crypto.randomUUID(),
            author: {
                id: user!.id,
                name: user!.name,
                avatar: user!.image || "",
                role: (user!.role as any) || "student",
                gradeLevel: user!.grade ? (user!.grade as any).id : undefined,
            },
            content: postText,
            likes: 0,
            comments: [],
            isSaved: false,
            isPinned: false,
            createdAt: "Just now",
            audience: selectedChannelId ? "Group" : audience,
            feeling: feeling || undefined,
            channelId: selectedChannelId || undefined,
            taggedUsers: taggedUsers,
            category: viewMode === "hub" ? postCategory : "General",
            status: viewMode === "hub" ? "Open" : undefined,
            image:
                attachedFile?.type === "image" ? attachedFile.url : undefined,
            video:
                attachedFile?.type === "video" ? attachedFile.url : undefined,
            gif: attachedFile?.type === "gif" ? attachedFile.url : undefined,
            poll:
                showPollBuilder && pollQuestion
                    ? {
                          question: pollQuestion,
                          options: pollOptions
                              .filter((o) => o.trim())
                              .map((o, i) => ({
                                  id: i.toString(),
                                  text: o,
                                  votes: 0,
                              })),
                          totalVotes: 0,
                      }
                    : undefined,
        };

        onCreatePost(newPost);
        resetForm();
    };

    const resetForm = () => {
        setPostText("");
        setPollQuestion("");
        setPollOptions(["", ""]);
        setShowPollBuilder(false);
        setTaggedUsers([]);
        setAttachedFile(null);
        setIsExpanded(false);
        setFeeling(null);
        setShowEmojiPicker(false);
        setShowFeelingPicker(false);
    };

    const addEmoji = (emoji: string) => {
        setPostText((prev) => prev + emoji);
        setShowEmojiPicker(false);
    };

    const getFilteredPosts = () => {
        let list = [...posts];
        if (selectedChannelId)
            return list.filter((p) => p.channelId === selectedChannelId);

        if (viewMode === "hub") {
            list = list.filter((p) => p.category && p.category !== "General");
            if (hubFilter !== "All")
                list = list.filter((p) => p.category === hubFilter);
        } else if (viewMode === "feed") {
            // Only filter for feed - saved and my-posts are already filtered by API
            list = list.filter((p) => !p.category || p.category === "General");
        }
        // For "saved" and "my-posts" tabs, the API already returns the correct data
        // so no additional filtering is needed

        return list.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });
    };

    const filteredPosts = getFilteredPosts();
    const selectedChannel = channels.find((c) => c.id === selectedChannelId);

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-background dark:bg-background-dark">
            {!selectedChannelId ? (
                <>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                        <div>
                            <h2 className="text-[32px] font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
                                {viewMode === "hub"
                                    ? t("hub.title")
                                    : t("feed.title")}
                            </h2>
                            <p className="text-gray-400 dark:text-gray-500 font-medium text-[15px]">
                                {viewMode === "hub"
                                    ? t("hub.subtitle")
                                    : t("feed.subtitle")}
                            </p>
                        </div>

                        <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                            {[
                                {
                                    id: "feed",
                                    icon: LayoutList,
                                    labelKey: "viewModes.feed",
                                },
                                {
                                    id: "hub",
                                    icon: GraduationCap,
                                    labelKey: "viewModes.hub",
                                },
                                {
                                    id: "my-posts",
                                    icon: UserIcon,
                                    labelKey: "viewModes.myPosts",
                                },
                                {
                                    id: "channels",
                                    icon: LayoutGrid,
                                    labelKey: "viewModes.channels",
                                },
                                {
                                    id: "saved",
                                    icon: BookmarkCheck,
                                    labelKey: "viewModes.saved",
                                },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() =>
                                        setViewMode(mode.id as CommunityTab)
                                    }
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${viewMode === mode.id ? "bg-[#00ADEF] text-white shadow-lg shadow-[#00ADEF]/20" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                >
                                    <mode.icon size={16} />
                                    {t(mode.labelKey)}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <button
                        onClick={() => setSelectedChannelId(null)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#00ADEF] font-bold text-sm mb-6 transition-colors group"
                    >
                        <ArrowLeft
                            size={18}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        {t("channel.backToCommunity")}
                    </button>

                    <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl mb-8">
                        <div className="h-52 relative">
                            <img
                                src={selectedChannel?.banner}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/60"></div>
                            <div className="absolute bottom-6 left-8 flex items-end gap-6">
                                <img
                                    src={selectedChannel?.owner.avatar}
                                    className="w-24 h-24 rounded-[32px] border-4 border-white shadow-2xl object-cover"
                                    alt=""
                                />
                                <div className="pb-2">
                                    <div className="flex items-center gap-2 text-white">
                                        <h2 className="text-3xl font-black tracking-tight">
                                            {selectedChannel?.name}
                                        </h2>
                                        <CheckCircle2
                                            size={24}
                                            className="text-[#00ADEF] fill-white"
                                        />
                                    </div>
                                    <p className="text-white/80 font-bold text-sm">
                                        {selectedChannel?.followers.toLocaleString()}{" "}
                                        {t("channel.subscribers")} •{" "}
                                        {t("channel.verifiedChannel")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex items-center justify-between border-b border-gray-50 dark:border-gray-700 bg-[#fcfdfe] dark:bg-gray-800">
                            <div className="max-w-2xl">
                                <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed text-[15px]">
                                    {selectedChannel?.description}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    selectedChannel &&
                                    onFollow(selectedChannel.id)
                                }
                                className={`px-10 py-4 rounded-[20px] font-black text-sm transition-all shadow-lg ${selectedChannel?.isFollowing ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-[#00ADEF] text-white shadow-[#00ADEF]/20 hover:scale-[1.02]"}`}
                            >
                                {selectedChannel?.isFollowing
                                    ? t("channel.following")
                                    : t("channel.followChannel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === "hub" && !selectedChannelId && (
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                    {[
                        "All",
                        "Project Help",
                        "Homework",
                        "Coding Tip",
                        "Resource",
                    ].map((cat) => (
                        <button
                            key={cat}
                            onClick={() =>
                                setHubFilter(cat as PostCategory | "All")
                            }
                            className={`px-5 py-2.5 rounded-full text-[12px] font-bold transition-all border ${hubFilter === cat ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {(viewMode === "feed" ||
                        viewMode === "hub" ||
                        selectedChannelId) && (
                        <div
                            className={`bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm mb-8 transition-all duration-300 ${isExpanded ? "ring-4 ring-blue-50 dark:ring-blue-900/30 shadow-xl" : "hover:shadow-md"}`}
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-5">
                                    <img
                                        src={user?.image}
                                        alt=""
                                        className="w-11 h-11 rounded-2xl shadow-sm object-cover"
                                    />
                                    <div className="flex-1 flex items-center gap-2">
                                        {!isExpanded ? (
                                            <button
                                                onClick={() =>
                                                    setIsExpanded(true)
                                                }
                                                className="w-full text-left py-3 px-5 rounded-2xl bg-[#f8fafc] dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-[14px] font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
                                            >
                                                {t("feed.whatsNews")}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setAudience(
                                                                audience ===
                                                                    "Public"
                                                                    ? "Group"
                                                                    : "Public"
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] dark:bg-gray-700 rounded-xl text-[11px] font-bold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-600 transition-all"
                                                    >
                                                        {audience ===
                                                        "Public" ? (
                                                            <Globe size={12} />
                                                        ) : (
                                                            <UsersIcon
                                                                size={12}
                                                            />
                                                        )}
                                                        {audience}
                                                    </button>
                                                </div>

                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setShowFeelingPicker(
                                                                !showFeelingPicker
                                                            )
                                                        }
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${feeling ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800" : "bg-[#f8fafc] dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-600"}`}
                                                    >
                                                        <Smile size={12} />
                                                        {feeling
                                                            ? `Feeling ${feeling}`
                                                            : "Feeling..."}
                                                    </button>
                                                    {showFeelingPicker && (
                                                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl z-50 p-2 animate-in fade-in zoom-in-95">
                                                            {FEELINGS.map(
                                                                (f) => (
                                                                    <button
                                                                        key={
                                                                            f.label
                                                                        }
                                                                        onClick={() => {
                                                                            setFeeling(
                                                                                `${f.emoji} ${f.label}`
                                                                            );
                                                                            setShowFeelingPicker(
                                                                                false
                                                                            );
                                                                        }}
                                                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                                                    >
                                                                        <span>
                                                                            {
                                                                                f.emoji
                                                                            }
                                                                        </span>{" "}
                                                                        {
                                                                            f.label
                                                                        }
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {viewMode === "hub" && (
                                                    <select
                                                        value={postCategory}
                                                        onChange={(e) =>
                                                            setPostCategory(
                                                                e.target
                                                                    .value as PostCategory
                                                            )
                                                        }
                                                        className="bg-indigo-50 border-none rounded-xl px-3 py-1.5 text-[11px] font-bold text-indigo-600 outline-none cursor-pointer"
                                                    >
                                                        <option value="Project Help">
                                                            Ask for Help
                                                        </option>
                                                        <option value="Homework">
                                                            Homework
                                                        </option>
                                                        <option value="Coding Tip">
                                                            Coding Tip
                                                        </option>
                                                        <option value="Resource">
                                                            Resource
                                                        </option>
                                                    </select>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {isExpanded && (
                                        <button
                                            onClick={() => resetForm()}
                                            className="p-2 text-gray-300 hover:text-gray-500 transition-colors"
                                        >
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
                                            onChange={(e) =>
                                                setPostText(e.target.value)
                                            }
                                            className="w-full bg-transparent border-none p-0 text-[16px] text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 focus:outline-none outline-none ring-0 shadow-none resize-none min-h-[140px] mb-4 font-medium"
                                            style={{
                                                border: "none",
                                                boxShadow: "none",
                                            }}
                                        />

                                        {showPollBuilder && (
                                            <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-3xl p-5 mb-6 border border-dashed border-blue-200 dark:border-blue-800">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                                        <BarChart3 size={16} />{" "}
                                                        Poll
                                                    </h4>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Question?"
                                                    value={pollQuestion}
                                                    onChange={(e) =>
                                                        setPollQuestion(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 mb-3 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800"
                                                />
                                                <div className="space-y-2">
                                                    {pollOptions.map(
                                                        (opt, i) => (
                                                            <input
                                                                key={i}
                                                                type="text"
                                                                placeholder={`Option ${i + 1}`}
                                                                value={opt}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const n = [
                                                                        ...pollOptions,
                                                                    ];
                                                                    n[i] =
                                                                        e.target.value;
                                                                    setPollOptions(
                                                                        n
                                                                    );
                                                                }}
                                                                className="w-full bg-white dark:bg-gray-700 border border-gray-50 dark:border-gray-600 rounded-xl px-4 py-2 text-xs text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800"
                                                            />
                                                        )
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            setPollOptions([
                                                                ...pollOptions,
                                                                "",
                                                            ])
                                                        }
                                                        className="text-[10px] font-bold text-blue-500"
                                                    >
                                                        + Add option
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {attachedFile && (
                                            <div className="relative mb-6 rounded-3xl overflow-hidden group max-w-sm border border-gray-100 shadow-lg">
                                                {attachedFile.type ===
                                                "video" ? (
                                                    <video
                                                        src={attachedFile.url}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={attachedFile.url}
                                                        className="w-full h-48 object-cover"
                                                        alt="Preview"
                                                    />
                                                )}
                                                <button
                                                    onClick={() =>
                                                        setAttachedFile(null)
                                                    }
                                                    className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full hover:bg-black transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {taggedUsers.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {taggedUsers.map((user) => (
                                                    <span
                                                        key={user.id}
                                                        className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-[11px] font-bold border border-gray-100 dark:border-gray-600"
                                                    >
                                                        @
                                                        {
                                                            user.name.split(
                                                                " "
                                                            )[0]
                                                        }
                                                        <button
                                                            onClick={() =>
                                                                setTaggedUsers(
                                                                    (prev) =>
                                                                        prev.filter(
                                                                            (
                                                                                u
                                                                            ) =>
                                                                                u.id !==
                                                                                user.id
                                                                        )
                                                                )
                                                            }
                                                            className="hover:text-red-500"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept="image/*,video/*,image/gif"
                                                />
                                                <button
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="p-3 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl transition-all"
                                                    title="Upload Media"
                                                >
                                                    <ImageIcon size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShowPollBuilder(
                                                            !showPollBuilder
                                                        )
                                                    }
                                                    className={`p-3 rounded-2xl transition-all ${showPollBuilder ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30"}`}
                                                    title="Poll"
                                                >
                                                    <BarChart3 size={20} />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setShowTagList(
                                                                !showTagList
                                                            )
                                                        }
                                                        className={`p-3 rounded-2xl transition-all ${showTagList ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30"}`}
                                                        title="Tag User"
                                                    >
                                                        <AtSign size={20} />
                                                    </button>
                                                    {showTagList && (
                                                        <div className="absolute bottom-full left-0 mb-3 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl z-50 p-2 overflow-y-auto max-h-48 no-scrollbar">
                                                            {posts.map(
                                                                (post) => (
                                                                    <button
                                                                        key={
                                                                            post.id
                                                                        }
                                                                        onClick={() => {
                                                                            if (
                                                                                !taggedUsers.find(
                                                                                    (
                                                                                        u
                                                                                    ) =>
                                                                                        u.id ===
                                                                                        post
                                                                                            .author
                                                                                            .id
                                                                                )
                                                                            )
                                                                                setTaggedUsers(
                                                                                    (
                                                                                        prev
                                                                                    ) => [
                                                                                        ...prev,
                                                                                        post.author,
                                                                                    ]
                                                                                );
                                                                            setShowTagList(
                                                                                false
                                                                            );
                                                                        }}
                                                                        className="w-full flex items-center gap-2 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all text-left"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                post
                                                                                    .author
                                                                                    .avatar
                                                                            }
                                                                            className="w-7 h-7 rounded-lg"
                                                                            alt=""
                                                                        />
                                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                                            {
                                                                                post
                                                                                    .author
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setShowEmojiPicker(
                                                                !showEmojiPicker
                                                            )
                                                        }
                                                        className={`p-3 rounded-2xl transition-all ${showEmojiPicker ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"}`}
                                                        title="Emojis"
                                                    >
                                                        <Smile size={20} />
                                                    </button>
                                                    {showEmojiPicker && (
                                                        <div className="absolute bottom-full left-0 mb-3 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl z-50 p-3 grid grid-cols-4 gap-2 animate-in zoom-in-95">
                                                            {EMOJIS.map((e) => (
                                                                <button
                                                                    key={e}
                                                                    onClick={() =>
                                                                        addEmoji(
                                                                            e
                                                                        )
                                                                    }
                                                                    className="text-xl hover:scale-125 transition-transform p-1"
                                                                >
                                                                    {e}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => resetForm()}
                                                    className="text-[13px] font-black text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 px-4 uppercase tracking-widest"
                                                >
                                                    {t("feed.discard")}
                                                </button>
                                                <button
                                                    onClick={
                                                        handleInternalCreatePost
                                                    }
                                                    disabled={
                                                        !postText.trim() &&
                                                        !pollQuestion &&
                                                        !attachedFile
                                                    }
                                                    className="px-8 py-3.5 rounded-[22px] text-[15px] font-black shadow-xl transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 bg-[#A0E2F1] text-[#00ADEF] shadow-blue-200/50 hover:scale-[1.02]"
                                                >
                                                    <Send size={18} />
                                                    {t("feed.postToFeed")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onLike={onLike}
                                    onSave={onSave}
                                    onPin={onPin}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    onVote={onVote}
                                    onReport={onReportPost}
                                    onComment={onComment}
                                />
                            ))
                        ) : (
                            <div className="p-24 text-center bg-white dark:bg-gray-800 rounded-[48px] border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <BookOpen
                                        className="text-gray-200"
                                        size={40}
                                    />
                                </div>
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
                                    {t("empty.noUpdates")}
                                </h3>
                                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                                    {t("empty.followChannels")}
                                </p>
                            </div>
                        )}
                    </div>

                    {viewMode === "channels" && !selectedChannelId && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-6 duration-700">
                            {channels.map((channel) => (
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

                {!selectedChannelId && (
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-gray-800 dark:text-white text-[14px] uppercase tracking-widest flex items-center gap-2">
                                    <Trophy
                                        size={18}
                                        className="text-[#FFB800]"
                                    />
                                    {t("widgets.hubMentors")}
                                </h3>
                            </div>
                            <div className="space-y-5">
                                {posts
                                    .filter(
                                        (p) => (p.author.gradeLevel || 0) >= 8
                                    )
                                    .map((post) => (
                                        <div
                                            key={post.id}
                                            className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-2xl transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={post.author.avatar}
                                                        className="w-11 h-11 rounded-2xl border border-gray-100 dark:border-gray-600"
                                                        alt=""
                                                    />
                                                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 border-2 border-white rounded-full p-1 shadow-sm">
                                                        <Star
                                                            size={8}
                                                            className="text-white fill-white"
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-[14px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#00ADEF] transition-colors">
                                                    {post.author.name}
                                                </span>
                                            </div>
                                            <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                                <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">
                                                    Lvl {post.author.gradeLevel}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="bg-indigo-600 rounded-[40px] p-10 shadow-2xl shadow-indigo-600/30 text-white relative overflow-hidden group">
                            <div className="absolute -top-6 -right-6 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000 scale-125">
                                <GraduationCap size={150} />
                            </div>
                            <h3 className="font-black text-2xl mb-4 relative z-10 leading-tight">
                                {t("widgets.joinMentorSquad")}
                            </h3>
                            <p className="text-[13px] text-white/80 mb-10 font-medium relative z-10 leading-relaxed">
                                {t("widgets.mentorDescription")}
                            </p>
                            <button className="w-full bg-white text-indigo-600 py-4 rounded-[22px] text-[14px] font-black hover:bg-gray-50 transition-all shadow-xl relative z-10 uppercase tracking-widest">
                                {t("widgets.applyToHelp")}
                            </button>
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
}

export default CommunityView;
