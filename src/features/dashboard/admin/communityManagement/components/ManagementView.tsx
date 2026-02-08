import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    ShieldCheck,
    Trash2,
    Plus,
    LayoutGrid,
    Megaphone,
    Users as UsersIcon,
    MessageSquare,
    AlertCircle,
    Image as ImageIcon,
    CheckCircle,
    Search,
    UserPlus,
    X,
    Send,
    ChevronRight,
    Video,
    Bell,
    Flag,
    ArrowLeft,
    Filter,
    LayoutList,
} from "lucide-react";
import { ConfirmDialog } from "@/design-system";
import type { Post, Channel, CommunityUser, PostReport } from "../types";
import { MOCK_USERS } from "../mocks";
import { PostCard } from "./PostCard";

interface ManagementViewProps {
    posts: Post[];
    channels: Channel[];
    reports: PostReport[];
    onDeletePost: (id: string) => void;
    onCreateChannel: (channel: Channel) => void;
    onUpdateChannelAdmins: (channelId: string, admins: CommunityUser[]) => void;
    onGlobalPost: (
        content: string,
        media?: { url: string; type: string },
        channelId?: string
    ) => void;
    onClearReport: (id: string, action?: "dismiss" | "resolve") => void;
    onLike: (id: string) => void;
    onSave: (id: string) => void;
    onPin: (id: string) => void;
    onEdit: (id: string, content: string) => void;
    onFollow: (id: string) => void;
    onCreatePost: (post: Post) => void;
    onComment?: (postId: string, content: string, parentId?: string) => void;
}

type ManagementTab =
    | "feed"
    | "moderate"
    | "channels"
    | "announcement"
    | "reports"
    | "post";

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
    onComment,
}: ManagementViewProps) {
    const { t } = useTranslation("communityManagement");
    const [activeSubTab, setActiveSubTab] = useState<ManagementTab>("moderate");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
        null
    );
    const [selectedChannelForAdmins, setSelectedChannelForAdmins] = useState<
        string | null
    >(null);

    const [postContent, setPostContent] = useState("");
    const [postTargetChannel, setPostTargetChannel] = useState<string>("");
    const [attachedMedia, setAttachedMedia] = useState<{
        url: string;
        type: string;
        file?: File;
    } | null>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);

    const [newChannel, setNewChannel] = useState({
        name: "",
        description: "",
        banner: "https://picsum.photos/seed/new/800/400",
        thumbnail: "https://picsum.photos/seed/thumb/200/200",
        ownerId: MOCK_USERS[0].id,
        accessType: "General" as "General" | "Restricted",
        gradeRange: "All" as Channel["gradeRange"],
    });

    const [announcement, setAnnouncement] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [showDismissDialog, setShowDismissDialog] = useState(false);
    const [reportToDismiss, setReportToDismiss] = useState<string | null>(null);
    const [showNotificationDropdown, setShowNotificationDropdown] =
        useState(false);

    const handleDeletePost = (postId: string) => {
        setPostToDelete(postId);
        setShowDeleteDialog(true);
    };

    const confirmDeletePost = () => {
        if (postToDelete) {
            onDeletePost(postToDelete);
        }
        setPostToDelete(null);
        setShowDeleteDialog(false);
    };

    const handleDismissReport = (reportId: string) => {
        setReportToDismiss(reportId);
        setShowDismissDialog(true);
    };

    const confirmDismissReport = () => {
        if (reportToDismiss) {
            onClearReport(reportToDismiss, "dismiss");
        }
        setReportToDismiss(null);
        setShowDismissDialog(false);
    };

    const handleResolveReport = (reportId: string) => {
        onClearReport(reportId, "resolve");
    };

    const filteredPosts = posts.filter(
        (p) =>
            p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMediaUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const type = file.type.startsWith("video")
            ? "video"
            : file.type === "image/gif"
              ? "gif"
              : "image";

        // TODO: Implement actual file upload to server to get URL
        // For now, create a local preview URL
        // The actual URL should come from a file upload endpoint
        const previewUrl = URL.createObjectURL(file);
        setAttachedMedia({ url: previewUrl, type, file });
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setNewChannel({ ...newChannel, thumbnail: URL.createObjectURL(file) });
    };

    const handleToggleAdmin = (channelId: string, user: CommunityUser) => {
        const channel = channels.find((c) => c.id === channelId);
        if (!channel) return;
        const isAdmin = channel.admins.some((a) => a.id === user.id);
        const newAdmins = isAdmin
            ? channel.admins.filter((a) => a.id !== user.id)
            : [...channel.admins, user];
        onUpdateChannelAdmins(channelId, newAdmins);
    };

    const selectedChannel = channels.find((c) => c.id === selectedChannelId);
    const channelPosts = posts.filter((p) => p.channelId === selectedChannelId);

    return (
        <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            {selectedChannelId ? (
                <div className="mb-10">
                    <button
                        onClick={() => setSelectedChannelId(null)}
                        className="flex items-center gap-2 text-gray-400 dark:text-gray-500 hover:text-[#00ADEF] font-bold text-sm mb-6 transition-colors group"
                    >
                        <ArrowLeft
                            size={18}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                        {t("channelDetail.backToManagement")}
                    </button>

                    <div className="bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-xl mb-8">
                        <div className="h-40 relative">
                            <img
                                src={selectedChannel?.banner}
                                className="w-full h-full object-cover"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold text-xs border border-white/30">
                                    {t("channelDetail.editBanner")}
                                </button>
                            </div>
                        </div>
                        <div className="p-8 flex items-start justify-between">
                            <div className="flex gap-6">
                                <img
                                    src={
                                        selectedChannel?.thumbnail ||
                                        selectedChannel?.owner.avatar
                                    }
                                    className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg -mt-16 relative z-10 bg-white dark:bg-gray-800"
                                    alt=""
                                />
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {selectedChannel?.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-[#E0F4FF] dark:bg-[#00ADEF]/20 text-[#00ADEF] text-[10px] font-black rounded uppercase">
                                            {selectedChannel?.gradeRange}
                                        </span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 text-[10px] font-black rounded uppercase">
                                            {selectedChannel?.accessType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <h4 className="font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-xs px-2">
                                {t("channelDetail.channelPosts")}
                            </h4>
                            {channelPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onLike={onLike}
                                    onSave={onSave}
                                    onPin={onPin}
                                    onDelete={onDeletePost}
                                    onEdit={onEdit}
                                    onComment={onComment}
                                    showReportCount
                                />
                            ))}
                            {channelPosts.length === 0 && (
                                <div className="p-10 text-center bg-white dark:bg-gray-800 border border-dashed border-gray-200 dark:border-gray-700 rounded-[32px]">
                                    <p className="text-gray-400 dark:text-gray-500 font-medium">
                                        {t("channelDetail.noPosts")}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-7 shadow-sm sticky top-24">
                                <h4 className="font-black text-gray-800 dark:text-gray-200 text-[13px] uppercase mb-6 tracking-widest">
                                    {t("channelDetail.adminControl")}
                                </h4>
                                <button className="w-full py-4 bg-[#00ADEF] text-white rounded-2xl font-black text-sm mb-3">
                                    {t("channelDetail.addOfficialPost")}
                                </button>
                                <button className="w-full py-4 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-2xl font-black text-sm">
                                    {t("channelDetail.channelSettings")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-[#E0F4FF] dark:bg-[#00ADEF]/20 text-[#00ADEF] rounded-2xl">
                                <ShieldCheck size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                                    {t("title")}
                                </h2>
                                <p className="text-gray-400 dark:text-gray-500 font-medium text-sm">
                                    {t("description")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setShowNotificationDropdown(
                                            !showNotificationDropdown
                                        )
                                    }
                                    className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-400 relative hover:border-[#00ADEF] transition-colors"
                                >
                                    <Bell size={20} />
                                    {reports.length > 0 && (
                                        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                    )}
                                </button>
                                {showNotificationDropdown && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                            <h4 className="font-black text-gray-800 dark:text-white text-sm">
                                                {t(
                                                    "notifications.title",
                                                    "Notifications"
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {reports.length}{" "}
                                                {t(
                                                    "notifications.pendingReports",
                                                    "pending reports"
                                                )}
                                            </p>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {reports.length === 0 ? (
                                                <div className="p-6 text-center">
                                                    <CheckCircle
                                                        size={32}
                                                        className="mx-auto mb-2 text-green-400 opacity-50"
                                                    />
                                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                                        {t(
                                                            "notifications.noReports",
                                                            "No pending reports"
                                                        )}
                                                    </p>
                                                </div>
                                            ) : (
                                                reports
                                                    .slice(0, 5)
                                                    .map((report) => (
                                                        <div
                                                            key={report.id}
                                                            className="p-4 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                                                            onClick={() => {
                                                                setActiveSubTab(
                                                                    "reports"
                                                                );
                                                                setShowNotificationDropdown(
                                                                    false
                                                                );
                                                            }}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg shrink-0">
                                                                    <Flag
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-gray-800 dark:text-white truncate">
                                                                        {
                                                                            report.reason
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                                                        {t(
                                                                            "notifications.reportedBy",
                                                                            "Reported by"
                                                                        )}{" "}
                                                                        {
                                                                            report
                                                                                .reporter
                                                                                .name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                        {reports.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    setActiveSubTab("reports");
                                                    setShowNotificationDropdown(
                                                        false
                                                    );
                                                }}
                                                className="w-full p-3 text-center text-xs font-bold text-[#00ADEF] hover:bg-[#E0F4FF] dark:hover:bg-[#00ADEF]/20 transition-colors"
                                            >
                                                {t(
                                                    "notifications.viewAll",
                                                    "View all reports"
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setActiveSubTab("post")}
                                className="flex items-center gap-2 px-6 py-3 bg-[#00ADEF] text-white rounded-[20px] font-black text-sm shadow-xl shadow-[#00ADEF]/20 hover:scale-[1.02] transition-all"
                            >
                                <Plus size={18} /> {t("officialPost.title")}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        {[
                            {
                                label: t("stats.totalPosts"),
                                value: posts.length,
                                icon: MessageSquare,
                                color: "text-blue-500",
                            },
                            {
                                label: t("stats.activeChannels"),
                                value: channels.length,
                                icon: LayoutGrid,
                                color: "text-purple-500",
                            },
                            {
                                label: t("stats.unresolvedReports"),
                                value: reports.length,
                                icon: AlertCircle,
                                color: "text-red-500",
                            },
                            {
                                label: t("stats.verifiedAdmins"),
                                value: channels.reduce(
                                    (acc, c) => acc + c.admins.length,
                                    0
                                ),
                                icon: UsersIcon,
                                color: "text-green-500",
                            },
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        {stat.label}
                                    </p>
                                    <stat.icon
                                        size={16}
                                        className={stat.color}
                                    />
                                </div>
                                <p className="text-2xl font-black text-gray-800 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex border-b border-gray-100 dark:border-gray-700 mb-8 overflow-x-auto no-scrollbar">
                        {[
                            {
                                id: "feed",
                                label: t("tabs.feedOverview"),
                                icon: LayoutList,
                            },
                            {
                                id: "moderate",
                                label: t("tabs.postModeration"),
                                icon: ShieldCheck,
                            },
                            {
                                id: "reports",
                                label: `${t("tabs.reports")} (${reports.length})`,
                                icon: AlertCircle,
                            },
                            {
                                id: "channels",
                                label: t("tabs.channelManagement"),
                                icon: LayoutGrid,
                            },
                            {
                                id: "announcement",
                                label: t("tabs.globalBroadcast"),
                                icon: Megaphone,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() =>
                                    setActiveSubTab(tab.id as ManagementTab)
                                }
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                                    activeSubTab === tab.id
                                        ? "border-[#00ADEF] text-[#00ADEF]"
                                        : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {activeSubTab === "feed" && (
                                <div className="space-y-6">
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            onLike={onLike}
                                            onSave={onSave}
                                            onPin={onPin}
                                            onDelete={onDeletePost}
                                            onEdit={onEdit}
                                            onComment={onComment}
                                            showReportCount
                                        />
                                    ))}
                                </div>
                            )}

                            {activeSubTab === "reports" && (
                                <div className="space-y-4">
                                    {reports.length === 0 ? (
                                        <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700">
                                            <CheckCircle
                                                size={48}
                                                className="mx-auto mb-4 text-green-400 opacity-20"
                                            />
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                                {t("reports.noReports")}
                                            </h3>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                                                {t("reports.communityBehaving")}
                                            </p>
                                        </div>
                                    ) : (
                                        reports.map((report) => {
                                            const post = posts.find(
                                                (p) => p.id === report.postId
                                            );
                                            return (
                                                <div
                                                    key={report.id}
                                                    className="bg-white dark:bg-gray-800 p-6 rounded-24px border border-red-100 dark:border-red-900/30 shadow-sm"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
                                                                <AlertCircle
                                                                    size={16}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-gray-800 dark:text-white">
                                                                    REPORT:{" "}
                                                                    {
                                                                        report.reason
                                                                    }
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">
                                                                    Reported by{" "}
                                                                    {
                                                                        report
                                                                            .reporter
                                                                            .name
                                                                    }{" "}
                                                                    •{" "}
                                                                    {
                                                                        report.timestamp
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleDismissReport(
                                                                        report.id
                                                                    )
                                                                }
                                                                className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-400 text-[10px] font-black rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                                            >
                                                                {t(
                                                                    "reports.dismiss"
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        report.postId
                                                                    )
                                                                }
                                                                className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-lg hover:bg-red-600"
                                                            >
                                                                {t(
                                                                    "reports.deletePost"
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {post && (
                                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl opacity-60">
                                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                                                                {t(
                                                                    "reports.contentPreview"
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic line-clamp-2">
                                                                "{post.content}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {activeSubTab === "moderate" && (
                                <div className="space-y-4">
                                    <div className="relative mb-6">
                                        <input
                                            type="text"
                                            placeholder="Search posts or users to moderate..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/10 outline-none"
                                        />
                                        <Search
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>

                                    {filteredPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="bg-white dark:bg-gray-800 p-6 rounded-24px border border-gray-100 dark:border-gray-700 shadow-sm flex items-start justify-between group"
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={post.author.avatar}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold text-gray-800 dark:text-white text-sm">
                                                            {post.author.name}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">
                                                            {post.createdAt}
                                                        </span>
                                                        {post.isOfficial && (
                                                            <ShieldCheck
                                                                size={12}
                                                                className="text-[#00ADEF]"
                                                            />
                                                        )}
                                                        {(post.reportCount ||
                                                            0) > 0 && (
                                                            <span className="text-[10px] px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-500 font-black rounded-full border border-red-100 dark:border-red-800">
                                                                {
                                                                    post.reportCount
                                                                }{" "}
                                                                Reports
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-[13px] leading-relaxed line-clamp-2 max-w-lg">
                                                        {post.content}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() =>
                                                        window.alert(
                                                            "Post Details UI placeholder"
                                                        )
                                                    }
                                                    className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                    <Filter size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onDeletePost(post.id)
                                                    }
                                                    className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeSubTab === "channels" && (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                                        <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">
                                            Create New Official Channel
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 block">
                                                    General Thumbnail
                                                </label>
                                                <div className="relative w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer group">
                                                    {newChannel.thumbnail ? (
                                                        <img
                                                            src={
                                                                newChannel.thumbnail
                                                            }
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <ImageIcon className="text-gray-300 dark:text-gray-600" />
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={
                                                            handleThumbnailUpload
                                                        }
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Plus
                                                            size={16}
                                                            className="text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Channel Name"
                                                value={newChannel.name}
                                                onChange={(e) =>
                                                    setNewChannel({
                                                        ...newChannel,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={newChannel.description}
                                                onChange={(e) =>
                                                    setNewChannel({
                                                        ...newChannel,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20 h-24"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 block tracking-widest">
                                                        Access Setting
                                                    </label>
                                                    <select
                                                        value={
                                                            newChannel.accessType
                                                        }
                                                        onChange={(e) =>
                                                            setNewChannel({
                                                                ...newChannel,
                                                                accessType: e
                                                                    .target
                                                                    .value as
                                                                    | "General"
                                                                    | "Restricted",
                                                            })
                                                        }
                                                        className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20"
                                                    >
                                                        <option value="General">
                                                            General
                                                        </option>
                                                        <option value="Restricted">
                                                            Restricted (Invite
                                                            Only)
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 block tracking-widest">
                                                        Grade Focus
                                                    </label>
                                                    <select
                                                        value={
                                                            newChannel.gradeRange
                                                        }
                                                        onChange={(e) =>
                                                            setNewChannel({
                                                                ...newChannel,
                                                                gradeRange: e
                                                                    .target
                                                                    .value as Channel["gradeRange"],
                                                            })
                                                        }
                                                        className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20"
                                                    >
                                                        <option value="All">
                                                            All Grades
                                                        </option>
                                                        <option value="Grade 1-3">
                                                            Grade 1-3
                                                        </option>
                                                        <option value="Grade 4-6">
                                                            Grade 4-6
                                                        </option>
                                                        <option value="Grade 7-9">
                                                            Grade 7-9
                                                        </option>
                                                        <option value="Grade 10-12">
                                                            Grade 10-12
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    // Create channel without mock admins - backend will set current user as owner
                                                    onCreateChannel({
                                                        id: "", // Will be assigned by backend
                                                        name: newChannel.name,
                                                        description:
                                                            newChannel.description,
                                                        banner: newChannel.banner,
                                                        thumbnail:
                                                            newChannel.thumbnail,
                                                        owner: {
                                                            id: "",
                                                            name: "",
                                                            avatar: "",
                                                            role: "manager",
                                                        },
                                                        admins: [], // Empty - no mock admins
                                                        followers: 0,
                                                        isFollowing: false,
                                                        accessType:
                                                            newChannel.accessType,
                                                        gradeRange:
                                                            newChannel.gradeRange,
                                                    });
                                                    setNewChannel({
                                                        name: "",
                                                        description: "",
                                                        banner: "https://picsum.photos/seed/new/800/400",
                                                        thumbnail:
                                                            "https://picsum.photos/seed/thumb/200/200",
                                                        ownerId:
                                                            MOCK_USERS[0].id,
                                                        accessType: "General",
                                                        gradeRange: "All",
                                                    });
                                                }}
                                                disabled={
                                                    !newChannel.name ||
                                                    !newChannel.description
                                                }
                                                className="w-full bg-[#00ADEF] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#0095CC] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Create Channel
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                                        <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">
                                            Manage All Channels
                                        </h3>
                                        <div className="space-y-3">
                                            {channels.map((channel) => (
                                                <div
                                                    key={channel.id}
                                                    className="border border-gray-50 dark:border-gray-700 rounded-2xl overflow-hidden"
                                                >
                                                    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={
                                                                    channel.thumbnail ||
                                                                    channel.banner
                                                                }
                                                                className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-gray-700"
                                                                alt=""
                                                            />
                                                            <div>
                                                                <span className="font-bold text-gray-700 dark:text-gray-200 block text-sm">
                                                                    {
                                                                        channel.name
                                                                    }
                                                                </span>
                                                                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase">
                                                                    {
                                                                        channel.gradeRange
                                                                    }{" "}
                                                                    •{" "}
                                                                    {
                                                                        channel.followers
                                                                    }{" "}
                                                                    Followers
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedChannelId(
                                                                        channel.id
                                                                    )
                                                                }
                                                                className="px-3 py-1.5 bg-[#E0F4FF] dark:bg-[#00ADEF]/20 text-[#00ADEF] rounded-lg text-[10px] font-black uppercase hover:bg-[#00ADEF] hover:text-white transition-all"
                                                            >
                                                                View Inside
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedChannelForAdmins(
                                                                        selectedChannelForAdmins ===
                                                                            channel.id
                                                                            ? null
                                                                            : channel.id
                                                                    )
                                                                }
                                                                className="p-1.5 bg-gray-50 dark:bg-gray-700 text-gray-400 rounded-lg"
                                                            >
                                                                <UsersIcon
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {selectedChannelForAdmins ===
                                                        channel.id && (
                                                        <div className="p-4 bg-[#fcfdfe] dark:bg-gray-700/50 border-t border-gray-50 dark:border-gray-700 animate-in slide-in-from-top-2">
                                                            <h5 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-3">
                                                                Manage Admins
                                                            </h5>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {MOCK_USERS.filter(
                                                                    (u) =>
                                                                        u.role !==
                                                                        "student"
                                                                ).map(
                                                                    (user) => {
                                                                        const isChanAdmin =
                                                                            channel.admins.some(
                                                                                (
                                                                                    a
                                                                                ) =>
                                                                                    a.id ===
                                                                                    user.id
                                                                            );
                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    user.id
                                                                                }
                                                                                onClick={() =>
                                                                                    handleToggleAdmin(
                                                                                        channel.id,
                                                                                        user
                                                                                    )
                                                                                }
                                                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isChanAdmin ? "bg-white dark:bg-gray-800 border-[#00ADEF] shadow-sm" : "border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 opacity-60"}`}
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <img
                                                                                        src={
                                                                                            user.avatar
                                                                                        }
                                                                                        className="w-6 h-6 rounded-full"
                                                                                        alt=""
                                                                                    />
                                                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                                                                        {
                                                                                            user.name
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                {isChanAdmin ? (
                                                                                    <CheckCircle
                                                                                        size={
                                                                                            14
                                                                                        }
                                                                                        className="text-[#00ADEF]"
                                                                                    />
                                                                                ) : (
                                                                                    <UserPlus
                                                                                        size={
                                                                                            14
                                                                                        }
                                                                                        className="text-gray-300 dark:text-gray-600"
                                                                                    />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSubTab === "announcement" && (
                                <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">
                                        Global Broadcast
                                    </h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                                        Send an announcement to all students
                                        across the main feed.
                                    </p>
                                    <textarea
                                        placeholder="Write your announcement..."
                                        value={announcement}
                                        onChange={(e) =>
                                            setAnnouncement(e.target.value)
                                        }
                                        className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-24px p-6 text-[15px] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20 outline-none h-40 mb-6"
                                    />
                                    <button
                                        onClick={() => {
                                            onGlobalPost(announcement);
                                            setAnnouncement("");
                                        }}
                                        className="w-full bg-gray-900 dark:bg-gray-700 text-white py-4 rounded-2xl font-black text-sm hover:bg-black dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Megaphone size={18} /> Broadcast to
                                        Everyone
                                    </button>
                                </div>
                            )}

                            {activeSubTab === "post" && (
                                <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-800 dark:text-white mb-6">
                                        Create Official Post
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase mb-2 block tracking-widest">
                                                Select Target
                                            </label>
                                            <select
                                                value={postTargetChannel}
                                                onChange={(e) =>
                                                    setPostTargetChannel(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-2xl p-4 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20"
                                            >
                                                <option value="">
                                                    Main Public Feed
                                                </option>
                                                {channels.map((c) => (
                                                    <option
                                                        key={c.id}
                                                        value={c.id}
                                                    >
                                                        {c.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <textarea
                                                placeholder="What's the official update?"
                                                value={postContent}
                                                onChange={(e) =>
                                                    setPostContent(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-24px p-6 text-[15px] text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#00ADEF]/20 outline-none h-40"
                                            />
                                        </div>

                                        {attachedMedia && (
                                            <div className="relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-sm">
                                                {attachedMedia.type ===
                                                "video" ? (
                                                    <video
                                                        src={attachedMedia.url}
                                                        className="w-full h-40 object-cover"
                                                        controls
                                                        preload="metadata"
                                                    />
                                                ) : (
                                                    <img
                                                        src={attachedMedia.url}
                                                        className="w-full h-40 object-cover"
                                                        alt=""
                                                    />
                                                )}
                                                <button
                                                    onClick={() => {
                                                        // Revoke the object URL to free memory
                                                        if (
                                                            attachedMedia.url.startsWith(
                                                                "blob:"
                                                            )
                                                        ) {
                                                            URL.revokeObjectURL(
                                                                attachedMedia.url
                                                            );
                                                        }
                                                        setAttachedMedia(null);
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                                            <div className="flex gap-2">
                                                <input
                                                    type="file"
                                                    ref={mediaInputRef}
                                                    onChange={handleMediaUpload}
                                                    className="hidden"
                                                    accept="image/*,video/*"
                                                />
                                                <button
                                                    onClick={() =>
                                                        mediaInputRef.current?.click()
                                                    }
                                                    className="p-4 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-[#00ADEF] rounded-2xl transition-all"
                                                >
                                                    <ImageIcon size={20} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        mediaInputRef.current?.click()
                                                    }
                                                    className="p-4 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-[#00ADEF] rounded-2xl transition-all"
                                                >
                                                    <Video size={20} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    onGlobalPost(
                                                        postContent,
                                                        attachedMedia ||
                                                            undefined,
                                                        postTargetChannel ||
                                                            undefined
                                                    );
                                                    setPostContent("");
                                                    setAttachedMedia(null);
                                                    setPostTargetChannel("");
                                                }}
                                                className="px-10 py-4 bg-[#00ADEF] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#00ADEF]/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                                            >
                                                <Send size={18} /> Post
                                                Officially
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-[#fcfdfe] dark:bg-gray-800/50 rounded-[32px] border border-[#00ADEF]/10 dark:border-[#00ADEF]/20 p-7">
                                <h4 className="font-black text-gray-800 dark:text-gray-200 text-[13px] uppercase tracking-widest mb-6">
                                    Moderator Quick Tips
                                </h4>
                                <div className="space-y-4">
                                    <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                        System notifications will highlight
                                        posts with 2+ reports automatically.
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-[#E0F4FF] dark:bg-[#00ADEF]/20 rounded-xl text-[#00ADEF]">
                                        <ShieldCheck size={16} />
                                        <span className="text-[11px] font-bold">
                                            Manager Mode Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-7 shadow-sm">
                                <h4 className="font-black text-gray-800 dark:text-gray-200 text-[13px] uppercase tracking-widest mb-6">
                                    Live Activity Reports
                                </h4>
                                <div className="space-y-4">
                                    {reports.length > 0 ? (
                                        <div className="space-y-3">
                                            {reports.slice(0, 3).map((r) => (
                                                <div
                                                    key={r.id}
                                                    className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                                            New Report:{" "}
                                                            {r.reason}
                                                        </p>
                                                        <p className="text-[9px] text-red-400 dark:text-red-500">
                                                            By {r.reporter.name}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            setActiveSubTab(
                                                                "reports"
                                                            )
                                                        }
                                                    >
                                                        <ChevronRight
                                                            size={12}
                                                            className="text-red-400 rtl:rotate-180"
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
                                            <div className="text-center">
                                                <CheckCircle
                                                    size={32}
                                                    className="text-green-400 mx-auto mb-3"
                                                />
                                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                                                    All clear! No pending
                                                    reports.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Delete Post Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                title={t("reports.deletePost")}
                message={t(
                    "deleteConfirmMessage",
                    "Are you sure you want to delete this post? This action cannot be undone."
                )}
                variant="danger"
                confirmText={t("reports.deletePost")}
                cancelText={t("cancel", "Cancel")}
                onConfirm={confirmDeletePost}
                onCancel={() => setShowDeleteDialog(false)}
            />

            {/* Dismiss Report Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDismissDialog}
                onClose={() => setShowDismissDialog(false)}
                title={t("reports.dismiss")}
                message={t(
                    "dismissConfirmMessage",
                    "Are you sure you want to dismiss this report?"
                )}
                variant="warning"
                confirmText={t("reports.dismiss")}
                cancelText={t("cancel", "Cancel")}
                onConfirm={confirmDismissReport}
                onCancel={() => setShowDismissDialog(false)}
            />
        </div>
    );
}

export default ManagementView;
