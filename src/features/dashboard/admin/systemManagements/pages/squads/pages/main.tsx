import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Building2,
    Users as UsersIcon,
    Plus,
    Search,
    ArrowLeft,
    Settings,
    History,
    LayoutDashboard,
    ShieldCheck,
    FileText,
    Phone,
    Mail,
    X,
    ArrowRight,
    Info,
    Rocket,
    Zap,
    Target,
    MessageCircle,
    Loader2,
    Shield,
    Activity,
    UserMinus,
    Laptop,
    MoreVertical,
} from "lucide-react";
import { PageWrapper } from "@/design-system";
import {
    useSquadsList,
    useSquadMembers,
    useSquadStats,
    useCreateSquad,
    useRemoveSquadMember,
} from "../api";
import { useUsersList } from "../../users/api";
import type { Squad, SquadType, CreateSquadPayload } from "../types";
import { useGroupsList } from "@/features/dashboard/admin/groupsManagement/api";

// ============================================================================
// Local Types
// ============================================================================

type SquadsTab = "hub" | "directory";
type SquadSubTab = "dashboard" | "team" | "groups" | "logs";

// ============================================================================
// Squad Details View
// ============================================================================

interface SquadDetailsViewProps {
    squad: Squad;
    onClose: () => void;
    squadSubTab: SquadSubTab;
    setSquadSubTab: (tab: SquadSubTab) => void;
    t: (key: string) => string;
}

function SquadDetailsView({
    squad,
    onClose,
    squadSubTab,
    setSquadSubTab,
    t,
}: SquadDetailsViewProps) {
    const { data: membersData, isLoading: membersLoading } = useSquadMembers(
        squad.id
    );
    const removeMemberMutation = useRemoveSquadMember();

    const { data: groupsData, isLoading: groupsLoading } = useGroupsList({
        squad_id: squad.id,
    });
    const squadGroups = groupsData?.items ?? [];

    const lead = membersData?.lead ?? null;
    const memberGroups = membersData?.groups ?? [];
    const allMembers = memberGroups.flatMap((g) => g.members);

    const handleRemoveMember = (userId: number) => {
        removeMemberMutation.mutate({ squadId: squad.id, userId });
    };

    const SUB_TABS = [
        {
            id: "dashboard" as const,
            labelKey: "squads.tabs.dashboard",
            icon: LayoutDashboard,
        },
        {
            id: "team" as const,
            labelKey: "squads.tabs.team",
            icon: ShieldCheck,
        },
        {
            id: "groups" as const,
            labelKey: "squads.tabs.groups",
            icon: Laptop,
        },
        {
            id: "logs" as const,
            labelKey: "squads.tabs.logs",
            icon: FileText,
        },
    ];

    return (
        <div className="space-y-8 pb-20">
            {/* Detail Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:shadow-xl hover:-translate-x-0.5 transition-all active:scale-90 group shadow-sm"
                    >
                        <ArrowLeft
                            size={28}
                            strokeWidth={2.5}
                            className="group-hover:text-brand-500"
                        />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                                {squad.caption}
                            </h2>
                            <span
                                className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    squad.isActive
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                                        : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20"
                                }`}
                            >
                                {squad.isActive
                                    ? t("squads.status.active")
                                    : t("squads.status.inactive")}
                            </span>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 font-bold flex items-center gap-2 text-base uppercase tracking-tight">
                            <Shield size={18} className="text-brand-500" />{" "}
                            {squad.typeLabel} • ID: {squad.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[32px] text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-xl transition-all">
                        <Settings size={24} />
                    </button>
                </div>
            </div>

            {/* Squad Navigation Tabs */}
            <div className="flex bg-white dark:bg-gray-800 p-2 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-lg w-fit overflow-x-auto">
                {SUB_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSquadSubTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[28px] text-[13px] font-black transition-all whitespace-nowrap ${
                            squadSubTab === tab.id
                                ? "bg-brand-500 text-white shadow-xl scale-105"
                                : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        <tab.icon size={20} strokeWidth={2.5} />{" "}
                        {t(tab.labelKey)}
                    </button>
                ))}
            </div>

            {/* Dashboard Tab */}
            {squadSubTab === "dashboard" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-800 p-10 sm:p-12 rounded-[48px] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tighter">
                                <LayoutDashboard
                                    size={32}
                                    className="text-brand-500"
                                />
                                {t("squads.detail.overview")}
                            </h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                                {squad.description ||
                                    t("squads.detail.noDescription")}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    {
                                        label: t("squads.detail.members"),
                                        value: squad.membersCount,
                                        icon: UsersIcon,
                                        color: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
                                    },
                                    {
                                        label: t("squads.detail.type"),
                                        value: squad.typeLabel,
                                        icon: Target,
                                        color: "bg-rose-50 dark:bg-rose-500/10 text-rose-500",
                                    },
                                    {
                                        label: t("squads.detail.status"),
                                        value: squad.isActive
                                            ? t("squads.status.active")
                                            : t("squads.status.inactive"),
                                        icon: Zap,
                                        color: "bg-amber-50 dark:bg-amber-500/10 text-amber-500",
                                    },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[36px] border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-2xl mb-4 flex items-center justify-center ${stat.color}`}
                                        >
                                            <stat.icon size={20} />
                                        </div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                                            {stat.value}
                                        </p>
                                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 dark:bg-gray-950 rounded-[48px] p-10 sm:p-12 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <Rocket size={40} className="text-brand-500 mb-6" />
                            <h4 className="text-2xl font-black mb-4">
                                {t("squads.detail.readiness")}
                            </h4>
                            <p className="text-gray-400 text-base font-medium leading-relaxed">
                                {t("squads.detail.readinessDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Tab */}
            {squadSubTab === "team" && (
                <div className="space-y-8">
                    {membersLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-brand-500" />
                        </div>
                    ) : (
                        <>
                            {/* Lead */}
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 ms-3">
                                    {t("squads.detail.squadLead")}
                                </h3>
                                {lead ? (
                                    <div className="bg-white dark:bg-gray-800 p-8 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-6 max-w-2xl group hover:shadow-xl transition-all">
                                        <img
                                            src={lead.image}
                                            className="w-20 h-20 rounded-landing-card object-cover border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-105 transition-all"
                                            alt=""
                                        />
                                        <div>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                                {lead.name}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                    {lead.role?.caption ??
                                                        "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <a
                                                    href={`mailto:${lead.email}`}
                                                    className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
                                                >
                                                    <Mail size={16} />
                                                </a>
                                                <button className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                                    <MessageCircle size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px] text-center max-w-2xl">
                                        <p className="text-gray-400 dark:text-gray-500 font-bold">
                                            {t("squads.detail.noLead")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Member Groups */}
                            {memberGroups.map((group, gi) => (
                                <div key={gi}>
                                    <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 ms-3">
                                        {group.roleGroup}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {group.members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="bg-white dark:bg-gray-800 p-6 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group"
                                            >
                                                <img
                                                    src={member.image}
                                                    className="w-14 h-14 rounded-[20px] object-cover border-2 border-white dark:border-gray-700 shadow-md group-hover:scale-110 transition-transform"
                                                    alt=""
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-black text-gray-900 dark:text-white truncate leading-none mb-1.5">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mb-2">
                                                        {member.role?.caption ??
                                                            "N/A"}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={`mailto:${member.email}`}
                                                            className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-brand-500 transition-colors"
                                                        >
                                                            <Mail size={13} />
                                                        </a>
                                                        <button className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-emerald-500 transition-colors">
                                                            <Phone size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveMember(
                                                            member.id
                                                        )
                                                    }
                                                    className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                                    title={t(
                                                        "squads.actions.removeMember"
                                                    )}
                                                >
                                                    <UserMinus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {allMembers.length === 0 && !lead && (
                                <div className="p-16 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <UsersIcon
                                        size={40}
                                        className="mx-auto text-gray-200 dark:text-gray-700 mb-4"
                                    />
                                    <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">
                                        {t("squads.detail.noMembers")}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Groups Tab */}
            {squadSubTab === "groups" && (
                <div className="space-y-8">
                    {groupsLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="size-8 animate-spin text-brand-500" />
                        </div>
                    ) : squadGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {squadGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="bg-white dark:bg-gray-800 rounded-[48px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group overflow-hidden cursor-pointer relative flex flex-col p-8 h-full"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-brand-500 rounded-landing-card group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                                            <Laptop
                                                size={36}
                                                strokeWidth={2.5}
                                            />
                                        </div>
                                        <button className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-300 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all">
                                            <MoreVertical size={24} />
                                        </button>
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-3 leading-none">
                                            {group.name}
                                        </h3>
                                        <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl w-fit">
                                            <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                                {group.level.title}{" "}
                                                {t("squads.detail.ops")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-6 border-t border-gray-50 dark:border-gray-700 mt-auto">
                                        {group.instructor && (
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        group.instructor
                                                            .image ?? ""
                                                    }
                                                    className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-gray-700 shadow-md"
                                                    alt=""
                                                />
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                        {t(
                                                            "squads.detail.lead"
                                                        )}
                                                    </p>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                                                        {group.instructor.name}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <UsersIcon
                                                    size={16}
                                                    className="text-gray-300 dark:text-gray-600"
                                                />
                                                <p className="text-base font-black text-gray-900 dark:text-white">
                                                    {group.students?.length ??
                                                        0}{" "}
                                                    {t("squads.detail.nodes")}
                                                </p>
                                            </div>
                                            <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 dark:hover:bg-brand-400 transition-all">
                                                {t("squads.detail.viewMission")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-16 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <Laptop
                                size={40}
                                className="mx-auto text-gray-200 dark:text-gray-700 mb-4"
                            />
                            <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">
                                {t("squads.detail.noGroups")}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Logs Tab */}
            {squadSubTab === "logs" && (
                <div className="bg-white dark:bg-gray-800 rounded-[48px] border border-gray-100 dark:border-gray-700 p-10 sm:p-12 shadow-sm">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 tracking-tighter">
                        <History size={32} className="text-brand-500" />
                        {t("squads.detail.operationalAudit")}
                    </h3>
                    <div className="p-16 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-[36px] border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <Info
                            size={40}
                            className="mx-auto text-gray-200 dark:text-gray-700 mb-4"
                        />
                        <p className="text-gray-400 dark:text-gray-500 font-bold">
                            {t("squads.detail.noLogs")}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Squad Card
// ============================================================================

interface SquadCardProps {
    squad: Squad;
    onSelect: (squad: Squad) => void;
    t: (key: string) => string;
}

function SquadCard({ squad, onSelect, t }: SquadCardProps) {
    return (
        <div
            onClick={() => onSelect(squad)}
            className="bg-white dark:bg-gray-900 rounded-[48px] border border-gray-100 dark:border-gray-700 p-10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group cursor-pointer relative overflow-hidden h-full flex flex-col"
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-10">
                    <div className="p-5 rounded-[32px] transition-all bg-blue-50 dark:bg-blue-500/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-white shadow-lg">
                        <Building2 size={40} strokeWidth={2.5} />
                    </div>
                    <div className="flex gap-2">
                        <div
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                squad.isActive
                                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                                    : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20"
                            }`}
                        >
                            {squad.isActive
                                ? t("squads.status.active")
                                : t("squads.status.inactive")}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex-1">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 group-hover:text-brand-500 transition-colors leading-none">
                        {squad.caption}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed line-clamp-2 mb-4">
                        {squad.description}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
                            {squad.typeLabel}
                        </span>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-brand-500 rounded-xl shadow-sm">
                            <UsersIcon size={16} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                                {squad.membersCount}
                            </p>
                            <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                {t("squads.card.members")}
                            </p>
                        </div>
                    </div>
                    <button className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl group-hover:bg-gray-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Create Squad Modal
// ============================================================================

interface CreateSquadModalProps {
    onClose: () => void;
    t: (key: string) => string;
}

function CreateSquadModal({ onClose, t }: CreateSquadModalProps) {
    const [name, setName] = useState("");
    const [caption, setCaption] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<SquadType>("CORE");

    const createMutation = useCreateSquad();

    const handleSubmit = () => {
        if (!name || !caption) return;
        const payload: CreateSquadPayload = {
            name,
            caption,
            type,
            description,
            isActive: true,
        };
        createMutation.mutate(payload, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-gray-900/60 dark:bg-black/70 backdrop-blur-md">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[40px] p-10 sm:p-12 shadow-2xl relative overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="absolute top-6 end-6 p-3 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
                        <Rocket size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {t("squads.modal.title")}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                            {t("squads.modal.subtitle")}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2 block ms-3">
                            {t("squads.modal.name")}
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("squads.modal.namePlaceholder")}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 rounded-landing-card px-6 py-4 text-base font-black outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2 block ms-3">
                            {t("squads.modal.caption")}
                        </label>
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={t("squads.modal.captionPlaceholder")}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 rounded-landing-card px-6 py-4 text-base font-black outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2 block ms-3">
                            {t("squads.modal.type")}
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {(["CORE", "EXECUTION"] as SquadType[]).map(
                                (opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setType(opt)}
                                        className={`p-4 rounded-2xl border-2 text-start transition-all ${
                                            type === opt
                                                ? "border-brand-500 bg-blue-50/50 dark:bg-blue-500/5"
                                                : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <p
                                            className={`text-sm font-bold ${type === opt ? "text-brand-500" : "text-gray-900 dark:text-white"}`}
                                        >
                                            {t(
                                                `squads.modal.${opt.toLowerCase()}`
                                            )}
                                        </p>
                                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">
                                            {t(
                                                `squads.modal.${opt.toLowerCase()}Desc`
                                            )}
                                        </p>
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2 block ms-3">
                            {t("squads.modal.description")}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t(
                                "squads.modal.descriptionPlaceholder"
                            )}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-700 rounded-landing-card p-6 text-sm font-black outline-none transition-all h-[120px] resize-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-landing-card font-black text-[11px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                        {t("squads.modal.cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={createMutation.isPending}
                        className="flex-2 py-5 bg-brand-500 text-white rounded-landing-card font-black text-base shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {createMutation.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Rocket size={16} />
                        )}
                        {createMutation.isPending
                            ? t("squads.modal.creating")
                            : t("squads.modal.create")}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

function SquadsManagement() {
    const { t } = useTranslation("systemManagements");

    const [activeTab, setActiveTab] = useState<SquadsTab>("hub");
    const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
    const [squadSubTab, setSquadSubTab] = useState<SquadSubTab>("dashboard");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [squadsSearch, setSquadsSearch] = useState("");

    const { data: squadsData, isLoading } = useSquadsList();
    const { data: statsData } = useSquadStats();
    const { data: usersData, isLoading: usersLoading } = useUsersList(
        { page: 1 },
        { enabled: activeTab === "directory" }
    );

    const squads = squadsData?.items ?? [];
    const stats = statsData ?? null;
    const users = usersData?.items ?? [];

    const filteredSquads = useMemo(() => {
        if (!squadsSearch) return squads;
        const q = squadsSearch.toLowerCase();
        return squads.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                s.caption.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q)
        );
    }, [squads, squadsSearch]);

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("squads.title"),
                subtitle: t("squads.subtitle"),
            }}
        >
            {selectedSquad ? (
                <SquadDetailsView
                    squad={selectedSquad}
                    onClose={() => setSelectedSquad(null)}
                    squadSubTab={squadSubTab}
                    setSquadSubTab={setSquadSubTab}
                    t={t}
                />
            ) : (
                <>
                    {/* Stats Bar */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                {
                                    label: t("squads.stats.total"),
                                    value: stats.totalSquads,
                                    icon: Building2,
                                    color: "text-brand-500 bg-blue-50 dark:bg-blue-500/10",
                                },
                                {
                                    label: t("squads.stats.active"),
                                    value: stats.activeSquads,
                                    icon: Activity,
                                    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                                },
                                {
                                    label: t("squads.stats.core"),
                                    value: stats.coreSquads,
                                    icon: Shield,
                                    color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
                                },
                                {
                                    label: t("squads.stats.execution"),
                                    value: stats.executionSquads,
                                    icon: Zap,
                                    color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
                                },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4"
                                >
                                    <div
                                        className={`p-3 rounded-2xl ${stat.color}`}
                                    >
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                                            {stat.value}
                                        </p>
                                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tabs + Search Bar */}
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-6">
                        <div className="flex gap-4 overflow-x-auto pb-1">
                            {[
                                {
                                    id: "hub" as const,
                                    labelKey: "squads.mainTabs.matrix",
                                    icon: LayoutDashboard,
                                },
                                {
                                    id: "directory" as const,
                                    labelKey: "squads.mainTabs.directory",
                                    icon: UsersIcon,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-8 py-5 rounded-[32px] text-[13px] font-black transition-all border-2 whitespace-nowrap group ${
                                        activeTab === tab.id
                                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-xl scale-105 z-10"
                                            : "bg-transparent text-gray-400 dark:text-gray-500 border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <tab.icon size={22} strokeWidth={2.5} />{" "}
                                    {t(tab.labelKey)}
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1 max-w-sm">
                            <input
                                type="text"
                                placeholder={t("squads.searchPlaceholder")}
                                value={squadsSearch}
                                onChange={(e) =>
                                    setSquadsSearch(e.target.value)
                                }
                                className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-gray-600 rounded-landing-card py-4 ps-12 pe-6 text-sm font-bold outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            />
                            <Search
                                size={18}
                                className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center justify-center gap-4 px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[32px] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl hover:bg-brand-500 dark:hover:bg-brand-400 group w-full md:w-auto uppercase tracking-widest"
                        >
                            <Plus
                                size={22}
                                strokeWidth={3}
                                className="group-hover:rotate-90 transition-transform duration-700"
                            />{" "}
                            {t("squads.actions.create")}
                        </button>
                    </div>

                    {/* Hub Tab — Squad Grid */}
                    {activeTab === "hub" && (
                        <>
                            {isLoading && (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="size-8 animate-spin text-brand-500" />
                                </div>
                            )}
                            {!isLoading && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {filteredSquads.map((squad) => (
                                        <SquadCard
                                            key={squad.id}
                                            squad={squad}
                                            onSelect={(s) => {
                                                setSelectedSquad(s);
                                                setSquadSubTab("dashboard");
                                            }}
                                            t={t}
                                        />
                                    ))}
                                    {filteredSquads.length === 0 && (
                                        <div className="col-span-full p-16 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                            <Building2
                                                size={40}
                                                className="mx-auto text-gray-200 dark:text-gray-700 mb-4"
                                            />
                                            <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">
                                                {t("squads.noResults")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Directory Tab — Personnel Table */}
                    {activeTab === "directory" && (
                        <div className="bg-white dark:bg-gray-800 rounded-[48px] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-10 border-b border-gray-50 dark:border-gray-700 bg-gray-50/20 dark:bg-gray-900/20">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                                    {t("squads.directory.title")}
                                </h3>
                                <p className="text-gray-400 dark:text-gray-500 font-bold">
                                    {t("squads.directory.subtitle")}
                                </p>
                            </div>
                            {usersLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="size-8 animate-spin text-brand-500" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-start">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                                    {t(
                                                        "squads.directory.identity"
                                                    )}
                                                </th>
                                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                                    {t("squads.directory.rank")}
                                                </th>
                                                <th className="px-10 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                                    {t("squads.directory.unit")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                            {users.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all cursor-pointer"
                                                >
                                                    <td className="px-10 py-6 flex items-center gap-6">
                                                        <img
                                                            src={user.image}
                                                            className="w-12 h-12 rounded-landing-icon object-cover border-2 border-white dark:border-gray-700 shadow-lg group-hover:scale-110 transition-all"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <p className="font-black text-gray-900 dark:text-white text-base tracking-tight leading-none mb-1 group-hover:text-brand-500 transition-colors">
                                                                {user.name}
                                                            </p>
                                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <span className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                            {user.role
                                                                ?.caption ??
                                                                "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <p className="font-black text-gray-700 dark:text-gray-300 uppercase text-sm tracking-widest">
                                                            {user.squad?.name ??
                                                                "—"}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <CreateSquadModal
                    onClose={() => setShowCreateModal(false)}
                    t={t}
                />
            )}
        </PageWrapper>
    );
}

export default SquadsManagement;
export const Component = SquadsManagement;
