import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    Laptop,
    Plus,
    Search,
    Filter,
    Building2,
    Calendar,
    ArrowRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Download,
    Users,
    X,
    UserCheck,
    ShieldCheck,
    Check,
    ArrowLeft,
    Settings,
    MessageCircle,
    Mail,
    Layers,
    Sparkles,
    ExternalLink,
    ChevronDown,
    UserRound,
    ArrowUpRight,
    AlertTriangle,
    LayoutList,
    LayoutGrid,
    Loader2,
} from "lucide-react";
import { PageWrapper } from "@/design-system";
import type {
    Group,
    GroupBlock,
    GroupInstructor,
    GroupStudent,
} from "../types";
import { mockGroups, mockBlocks, mockInstructors } from "../mockData";

// ============================================================================
// Constants
// ============================================================================

const LEVEL_STYLES: Record<
    string,
    {
        bg: string;
        cardBg: string;
        text: string;
        border: string;
        accent: string;
        gradient: string;
        tagBg: string;
        tagText: string;
    }
> = {
    beginner: {
        bg: "bg-rose-50 dark:bg-rose-500/10",
        cardBg: "bg-white dark:bg-gray-900",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-100 dark:border-rose-500/20",
        accent: "bg-rose-500",
        gradient: "from-rose-400 via-pink-500 to-rose-600",
        tagBg: "bg-rose-100/50 dark:bg-rose-500/10",
        tagText: "text-rose-700 dark:text-rose-400",
    },
    intermediate: {
        bg: "bg-blue-50 dark:bg-blue-500/10",
        cardBg: "bg-white dark:bg-gray-900",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-500/20",
        accent: "bg-blue-500",
        gradient: "from-brand-400 via-blue-500 to-indigo-600",
        tagBg: "bg-blue-100/50 dark:bg-blue-500/10",
        tagText: "text-blue-700 dark:text-blue-400",
    },
    advanced: {
        bg: "bg-purple-50 dark:bg-purple-500/10",
        cardBg: "bg-white dark:bg-gray-900",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-100 dark:border-purple-500/20",
        accent: "bg-purple-500",
        gradient: "from-purple-500 via-indigo-600 to-blue-700",
        tagBg: "bg-purple-100/50 dark:bg-purple-500/10",
        tagText: "text-purple-700 dark:text-purple-400",
    },
};

const DEFAULT_LEVEL_STYLE = {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    cardBg: "bg-white dark:bg-gray-900",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-500/20",
    accent: "bg-amber-500",
    gradient: "from-amber-400 via-orange-500 to-amber-600",
    tagBg: "bg-amber-100/50 dark:bg-amber-500/10",
    tagText: "text-amber-700 dark:text-amber-400",
};

function getLevelStyles(level: string) {
    return LEVEL_STYLES[level.toLowerCase()] ?? DEFAULT_LEVEL_STYLE;
}

// ============================================================================
// Group Details Modal
// ============================================================================

interface GroupDetailsViewProps {
    group: Group;
    instructors: GroupInstructor[];
    onClose: () => void;
    onReassignInstructor: (groupId: number, instructorId: number) => void;
    t: (key: string) => string;
}

function GroupDetailsView({
    group,
    instructors,
    onClose,
    onReassignInstructor,
    t,
}: GroupDetailsViewProps) {
    const instructor = group.instructor;
    const groupStudents = group.students ?? [];
    const assignedBlocks = group.blocks ?? [];
    const styles = getLevelStyles(group.level);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [instSearch, setInstSearch] = useState("");
    const [pendingInstructor, setPendingInstructor] =
        useState<GroupInstructor | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredInstructors = instructors.filter((inst) =>
        inst.name.toLowerCase().includes(instSearch.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openWhatsApp = (phone?: string) => {
        if (!phone) return;
        const cleanPhone = phone.replace(/\D/g, "");
        window.open(`https://wa.me/${cleanPhone}`, "_blank");
    };

    const openMail = (email?: string) => {
        if (!email) return;
        window.location.href = `mailto:${email}`;
    };

    const handleConfirmInstructor = () => {
        if (pendingInstructor) {
            onReassignInstructor(group.id, pendingInstructor.id);
            setPendingInstructor(null);
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm p-2 sm:p-6">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border border-gray-200 dark:border-gray-700">
                {/* Gradient Header */}
                <div
                    className={`relative shrink-0 overflow-hidden bg-linear-to-r ${styles.gradient} p-6 sm:p-10 text-white z-10`}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 text-white pointer-events-none rotate-12">
                        <Layers size={180} strokeWidth={1} />
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all border border-white/20"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                                    {group.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="px-3 py-1 bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20">
                                        {group.level}{" "}
                                        {t("groups.details.cluster")}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-white/90 text-[9px] font-bold uppercase tracking-widest">
                                        <Users size={12} />{" "}
                                        {groupStudents.length}{" "}
                                        {t("groups.details.nodes")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl backdrop-blur-md transition-all border border-white/30"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* Instructor Profile Card */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-5">
                                <h4 className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <div
                                        className={`p-1.5 rounded-lg ${styles.bg} ${styles.text}`}
                                    >
                                        <UserCheck size={14} />
                                    </div>
                                    {t("groups.details.instructor")}
                                </h4>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            openWhatsApp(instructor?.phone)
                                        }
                                        className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 dark:border-emerald-500/20"
                                    >
                                        <MessageCircle size={16} />
                                    </button>
                                    <button
                                        onClick={() =>
                                            openMail(instructor?.email)
                                        }
                                        className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 dark:border-blue-500/20"
                                    >
                                        <Mail size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <img
                                        src={instructor?.avatar}
                                        className="w-16 h-16 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg object-cover ring-1 ring-gray-100 dark:ring-gray-700"
                                        alt=""
                                    />
                                    <div
                                        className={`absolute -bottom-1 -right-1 ${styles.accent} text-white p-1 rounded-lg border-2 border-white dark:border-gray-800 shadow-sm`}
                                    >
                                        <ShieldCheck size={12} />
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1.5 truncate">
                                        {instructor?.name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold truncate mb-3">
                                        {instructor?.email}
                                    </p>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full w-fit border border-emerald-100 dark:border-emerald-500/20">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">
                                            {t("groups.details.activeOps")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Reassignment Dropdown */}
                            <div
                                className="pt-5 border-t border-gray-50 dark:border-gray-800 mt-auto relative"
                                ref={dropdownRef}
                            >
                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 block ms-1">
                                    {t("groups.details.reassignLead")}
                                </label>

                                {pendingInstructor ? (
                                    <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/30 rounded-3xl p-5 flex flex-col gap-4 shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img
                                                    src={
                                                        pendingInstructor.avatar
                                                    }
                                                    className="w-12 h-12 rounded-2xl border-2 border-white dark:border-gray-800 shadow-md object-cover"
                                                    alt=""
                                                />
                                                <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-lg border-2 border-white dark:border-gray-800 shadow-sm">
                                                    <AlertTriangle
                                                        size={10}
                                                        className="text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-amber-900 dark:text-amber-300 leading-tight">
                                                    {t(
                                                        "groups.details.confirmQuestion"
                                                    )}
                                                </p>
                                                <p className="text-[10px] font-bold text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                                                    {t(
                                                        "groups.details.transitionTo"
                                                    )}{" "}
                                                    {pendingInstructor.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setPendingInstructor(null);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="flex-1 py-3 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                            >
                                                {t("groups.actions.cancel")}
                                            </button>
                                            <button
                                                onClick={
                                                    handleConfirmInstructor
                                                }
                                                className="flex-2 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                            >
                                                {t(
                                                    "groups.actions.confirmAssign"
                                                )}{" "}
                                                <Check
                                                    size={14}
                                                    strokeWidth={4}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    !isDropdownOpen
                                                )
                                            }
                                            className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between transition-all hover:bg-white dark:hover:bg-gray-700 hover:border-brand-500 group ${isDropdownOpen ? "ring-2 ring-blue-100 dark:ring-blue-500/20 border-brand-500" : ""}`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UserRound
                                                    size={14}
                                                    className="text-brand-500 group-hover:scale-110 transition-transform"
                                                />
                                                <span className="truncate">
                                                    {instructor?.name}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                size={18}
                                                className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-brand-500" : ""}`}
                                            />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col">
                                                {/* Search Header */}
                                                <div className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                                    <div className="relative">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            placeholder={t(
                                                                "groups.details.searchInstructors"
                                                            )}
                                                            value={instSearch}
                                                            onChange={(e) =>
                                                                setInstSearch(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-100 dark:focus:border-blue-500/20 focus:bg-white dark:focus:bg-gray-700 rounded-2xl py-3 ps-12 pe-4 text-xs font-bold outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                                                        />
                                                        <Search
                                                            size={20}
                                                            className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Instructor List */}
                                                <div className="max-h-[280px] overflow-y-auto py-2 bg-white dark:bg-gray-900">
                                                    {filteredInstructors.length >
                                                    0 ? (
                                                        filteredInstructors.map(
                                                            (inst) => (
                                                                <button
                                                                    key={
                                                                        inst.id
                                                                    }
                                                                    onClick={() =>
                                                                        setPendingInstructor(
                                                                            inst
                                                                        )
                                                                    }
                                                                    className={`w-full flex items-center gap-4 px-5 py-3.5 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-500/5 text-start group/item ${inst.id === group.instructorId ? "bg-blue-50/30 dark:bg-blue-500/5" : ""}`}
                                                                >
                                                                    <div className="relative shrink-0">
                                                                        <img
                                                                            src={
                                                                                inst.avatar
                                                                            }
                                                                            className="w-10 h-10 rounded-2xl object-cover shadow-sm border-2 border-white dark:border-gray-800 group-hover/item:scale-105 transition-transform"
                                                                            alt=""
                                                                        />
                                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p
                                                                            className={`text-[13px] font-bold truncate leading-none mb-1 ${inst.id === group.instructorId ? "text-brand-500" : "text-gray-800 dark:text-gray-200"}`}
                                                                        >
                                                                            {
                                                                                inst.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                                                                            {t(
                                                                                "groups.details.specialist"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    {inst.id ===
                                                                    group.instructorId ? (
                                                                        <div className="w-7 h-7 bg-blue-50 dark:bg-blue-500/10 text-brand-500 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                                                                            <CheckCircle2
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-7 h-7 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-xl flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all border border-gray-100 dark:border-gray-700">
                                                                            <ArrowUpRight
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="p-12 text-center">
                                                            <Search
                                                                size={32}
                                                                className="mx-auto text-gray-100 dark:text-gray-700 mb-3"
                                                            />
                                                            <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                                                                {t(
                                                                    "groups.details.noMatchingSpecialists"
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-3 border-t border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 flex justify-center">
                                                    <p className="text-[8px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                                                        {t(
                                                            "groups.details.personnelDirectory"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Deployment/Blocks Card */}
                        <div className="bg-linear-to-br from-gray-900 to-blue-900 dark:from-gray-950 dark:to-blue-950 p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-white transform rotate-12">
                                <Settings size={120} />
                            </div>
                            <div className="relative z-10 flex flex-col h-full">
                                <h4 className="text-[9px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                    <Building2 size={14} />{" "}
                                    {t("groups.details.deploymentMatrix")}
                                </h4>
                                <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
                                    {assignedBlocks.length > 0 ? (
                                        assignedBlocks.map((b: GroupBlock) => (
                                            <div
                                                key={b.id}
                                                className="flex items-center justify-between text-white bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 bg-brand-500/20 text-brand-400 rounded-xl flex items-center justify-center shrink-0">
                                                        <Building2 size={14} />
                                                    </div>
                                                    <span className="font-bold tracking-tight text-[13px] truncate">
                                                        {b.name}
                                                    </span>
                                                </div>
                                                <span className="text-[8px] font-bold uppercase text-blue-300 tracking-widest px-2 py-1 bg-blue-400/10 rounded-lg border border-blue-400/20">
                                                    {b.location}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 font-bold text-[10px] italic p-6 text-center">
                                            {t("groups.details.noUnits")}
                                        </p>
                                    )}
                                </div>
                                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                        {t("groups.details.operationalWindow")}
                                    </span>
                                    <span className="text-xs font-bold text-white">
                                        {group.schedule}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Students Roster */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2.5 rounded-2xl ${styles.bg} ${styles.text} shadow-inner`}
                                >
                                    <Users size={18} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                                        {t("groups.details.students")}
                                    </h4>
                                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        {t("groups.details.authorizedEntities")}
                                    </p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-500 hover:text-brand-500 text-gray-900 dark:text-gray-300 font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm">
                                <Download size={14} />{" "}
                                {t("groups.actions.syncCsv")}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {groupStudents.map((s: GroupStudent) => (
                                <div
                                    key={s.id}
                                    className="bg-white dark:bg-gray-900 p-3 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center justify-between group/user hover:border-brand-500 transition-all cursor-default shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={s.avatar}
                                            className="w-10 h-10 rounded-2xl border-2 border-white dark:border-gray-800 shadow-sm object-cover group-hover/user:scale-110 transition-transform"
                                            alt=""
                                        />
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-[11px] tracking-tight leading-none mb-0.5 truncate group-hover/user:text-brand-500 transition-colors">
                                                {s.name}
                                            </p>
                                            <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest truncate">
                                                {s.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

function GroupsManagement() {
    const { t } = useTranslation("systemManagements");

    const [searchQuery, setSearchQuery] = useState("");
    const [isCollapsedView, setIsCollapsedView] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState<number | null>(null);
    const [tempSelectedBlocks, setTempSelectedBlocks] = useState<number[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

    // TODO: Replace mock data with real API call (useGroupsList)
    const groups: Group[] = mockGroups;
    const isLoading = false;
    const allBlocks: GroupBlock[] = mockBlocks;
    const allInstructors: GroupInstructor[] = mockInstructors;

    const filteredGroups = groups.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

    const handleOpenAssignModal = (group: Group) => {
        setTempSelectedBlocks(group.blocks.map((b) => b.id));
        setShowAssignModal(group.id);
    };

    const toggleTempBlockSelection = (blockId: number) => {
        setTempSelectedBlocks((prev) =>
            prev.includes(blockId)
                ? prev.filter((id) => id !== blockId)
                : [...prev, blockId]
        );
    };

    const handleConfirmAssign = (_groupId: number) => {
        // TODO: Call useAssignBlocks mutation
        setShowAssignModal(null);
    };

    const handleReassignInstructor = (
        _groupId: number,
        _instructorId: number
    ) => {
        // TODO: Call useReassignInstructor mutation
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.title"),
                subtitle: t("groups.subtitle"),
            }}
        >
            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <input
                        type="text"
                        placeholder={t("groups.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-gray-600 rounded-2xl py-4 ps-14 pe-6 text-[13px] font-bold outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <Search
                        size={22}
                        className="absolute start-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-500"
                    />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => setIsCollapsedView(!isCollapsedView)}
                        className={`flex-1 lg:flex-none px-8 py-4 border rounded-2xl font-bold text-[10px] transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm ${
                            isCollapsedView
                                ? "bg-brand-500 text-white border-brand-500 shadow-brand-200 dark:shadow-brand-900/20"
                                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        {isCollapsedView ? (
                            <LayoutGrid size={16} />
                        ) : (
                            <LayoutList size={16} />
                        )}
                        {isCollapsedView
                            ? t("groups.compact")
                            : t("groups.detailed")}
                    </button>

                    <button className="flex-1 lg:flex-none px-8 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl font-bold text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm">
                        <Filter size={16} /> {t("groups.filters")}
                    </button>
                    <button className="p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl hover:bg-brand-500 dark:hover:bg-brand-400 transition-all shadow-lg">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="size-8 animate-spin text-brand-500" />
                </div>
            )}

            {/* Groups Grid */}
            {!isLoading && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 items-stretch">
                    {filteredGroups.map((group, idx) => {
                        const instructor = group.primaryTeacher;
                        const assignedBlocks = group.blocks ?? [];
                        const styles = getLevelStyles(group.level);

                        return (
                            <div
                                key={group.id}
                                className={`${styles.cardBg} rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group overflow-hidden relative flex flex-col`}
                                style={{
                                    animationDelay: `${idx * 40}ms`,
                                }}
                            >
                                {/* Top Accent */}
                                <div
                                    className={`h-2 w-full bg-linear-to-r ${styles.gradient}`}
                                />

                                <div
                                    className={`flex flex-col h-full ${isCollapsedView ? "p-6" : "p-8"}`}
                                >
                                    <div
                                        className={`flex items-center justify-between ${isCollapsedView ? "mb-4" : "mb-8"}`}
                                    >
                                        <div
                                            className={`${isCollapsedView ? "p-2.5 rounded-xl" : "p-4 rounded-3xl"} ${styles.bg} ${styles.text} transition-all group-hover:scale-110 shadow-sm border ${styles.border}`}
                                        >
                                            <Laptop
                                                size={isCollapsedView ? 20 : 32}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setSelectedGroupId(group.id)
                                                }
                                                className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-brand-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20"
                                            >
                                                <ExternalLink
                                                    size={
                                                        isCollapsedView
                                                            ? 16
                                                            : 20
                                                    }
                                                />
                                            </button>
                                            {!isCollapsedView && (
                                                <button className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-2xl transition-all">
                                                    <MoreVertical size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={`${isCollapsedView ? "mb-2" : "mb-6"} flex-1`}
                                    >
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setSelectedGroupId(
                                                    Number(group.id)
                                                )
                                            }
                                        >
                                            <h3
                                                className={`${isCollapsedView ? "text-lg" : "text-2xl"} font-bold text-gray-900 dark:text-white tracking-tight mb-2.5 group-hover:text-brand-500 transition-colors leading-none truncate`}
                                            >
                                                {group.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`px-3 py-1.5 ${styles.bg} ${styles.text} rounded-xl w-fit border ${styles.border} flex items-center gap-2 shadow-sm`}
                                                >
                                                    <Sparkles size={12} />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                        {group.level}{" "}
                                                        {t(
                                                            "groups.card.matrix"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {!isCollapsedView && (
                                        <>
                                            <div className="space-y-4 mb-8 bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-50 dark:border-gray-800">
                                                <div
                                                    className="flex items-center gap-4 group/lead cursor-pointer"
                                                    onClick={() =>
                                                        setSelectedGroupId(
                                                            Number(group.id)
                                                        )
                                                    }
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                instructor?.avatar
                                                            }
                                                            className="w-12 h-12 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-md transition-transform group-hover/lead:scale-105"
                                                            alt=""
                                                        />
                                                        <div
                                                            className={`absolute -top-1 -right-1 ${styles.accent} w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 shadow-sm`}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                                                            {t(
                                                                "groups.card.leadSpecialist"
                                                            )}
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-none">
                                                            {instructor?.name}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`w-10 h-10 rounded-xl ${styles.bg} ${styles.text} flex items-center justify-center shadow-sm`}
                                                    >
                                                        <Calendar size={18} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                                                            {t(
                                                                "groups.card.operationalSlot"
                                                            )}
                                                        </p>
                                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">
                                                            {group.schedule}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex flex-col gap-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {assignedBlocks.length >
                                                    0 ? (
                                                        assignedBlocks.map(
                                                            (b: GroupBlock) => (
                                                                <div
                                                                    key={b.id}
                                                                    className={`flex items-center gap-2 px-3 py-1.5 ${styles.tagBg} ${styles.tagText} rounded-xl border border-white/50 dark:border-gray-700 shadow-sm transition-all hover:scale-105 group/tag`}
                                                                >
                                                                    <Building2
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="opacity-70 group-hover/tag:scale-110"
                                                                    />
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                                                        {b.name}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                            <AlertCircle
                                                                size={12}
                                                            />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                                {t(
                                                                    "groups.card.unmapped"
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div
                                                        onClick={() =>
                                                            setSelectedGroupId(
                                                                group.id
                                                            )
                                                        }
                                                        className="flex items-center gap-3 cursor-pointer group/stat"
                                                    >
                                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-brand-500 rounded-xl shadow-sm group-hover/stat:bg-brand-500 group-hover/stat:text-white transition-all">
                                                            <Users size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-0.5">
                                                                {
                                                                    group
                                                                        .students
                                                                        .length
                                                                }
                                                            </p>
                                                            <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                                {t(
                                                                    "groups.card.activeUnits"
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            handleOpenAssignModal(
                                                                group
                                                            )
                                                        }
                                                        className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-500 dark:hover:bg-brand-400 transition-all flex items-center gap-2 shadow-lg"
                                                    >
                                                        {t(
                                                            "groups.actions.assign"
                                                        )}{" "}
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Assignment Modal Overlay */}
                                {showAssignModal === group.id && (
                                    <div className="absolute inset-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl z-40 flex flex-col p-6 overflow-hidden rounded-[40px]">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-brand-500 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-500/20">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                                                        {t(
                                                            "groups.assign.alignment"
                                                        )}
                                                    </h4>
                                                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                        {t(
                                                            "groups.assign.unitMapping"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setShowAssignModal(null)
                                                }
                                                className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all shadow-sm border border-gray-100 dark:border-gray-700"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-2.5 overflow-y-auto flex-1 pb-4">
                                            {allBlocks.map((block) => {
                                                const isSelected =
                                                    tempSelectedBlocks.includes(
                                                        block.id
                                                    );
                                                return (
                                                    <button
                                                        key={block.id}
                                                        onClick={() =>
                                                            toggleTempBlockSelection(
                                                                block.id
                                                            )
                                                        }
                                                        className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all ${
                                                            isSelected
                                                                ? "bg-blue-50 dark:bg-blue-500/10 border-brand-500 shadow-md"
                                                                : "bg-white dark:bg-gray-900 border-gray-50 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-4 text-start min-w-0">
                                                            <div
                                                                className={`p-3 rounded-2xl transition-all shadow-sm ${isSelected ? "bg-brand-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600"}`}
                                                            >
                                                                <Building2
                                                                    size={18}
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p
                                                                    className={`text-[13px] font-bold tracking-tight truncate leading-none ${isSelected ? "text-brand-500" : "text-gray-900 dark:text-white"}`}
                                                                >
                                                                    {block.name}
                                                                </p>
                                                                <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1.5 truncate">
                                                                    {
                                                                        block.location
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? "bg-brand-500 border-brand-500 text-white shadow-sm" : "border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-transparent"}`}
                                                        >
                                                            <Check
                                                                size={14}
                                                                strokeWidth={4}
                                                            />
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                                            <button
                                                onClick={() =>
                                                    setShowAssignModal(null)
                                                }
                                                className="flex-1 py-4 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {t("groups.actions.cancel")}
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleConfirmAssign(
                                                        Number(group.id)
                                                    )
                                                }
                                                className="flex-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all hover:bg-brand-500 dark:hover:bg-brand-400 flex items-center justify-center gap-2"
                                            >
                                                {t(
                                                    "groups.actions.confirmDeployment"
                                                )}{" "}
                                                <CheckCircle2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Add Group Placeholder */}
                    <button
                        className={`bg-white dark:bg-gray-900 border-4 border-dashed border-blue-100 dark:border-blue-500/20 rounded-[40px] p-8 flex flex-col items-center justify-center text-blue-200 dark:text-blue-500/30 hover:text-brand-500 hover:border-brand-500 hover:bg-blue-50/20 dark:hover:bg-blue-500/5 transition-all group transform ${isCollapsedView ? "min-h-[160px]" : "min-h-[380px]"}`}
                    >
                        <div
                            className={`${isCollapsedView ? "w-12 h-12 mb-3" : "w-20 h-20 mb-6"} bg-blue-50 dark:bg-blue-500/10 rounded-3xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-all border border-blue-100 dark:border-blue-500/20 ring-8 ring-blue-50/50 dark:ring-blue-500/5`}
                        >
                            <Plus
                                size={isCollapsedView ? 24 : 40}
                                className="text-brand-500"
                                strokeWidth={3}
                            />
                        </div>
                        <span
                            className={`font-bold uppercase tracking-widest text-brand-500 ${isCollapsedView ? "text-[9px]" : "text-xs"}`}
                        >
                            {t("groups.actions.newGroup")}
                        </span>
                        {!isCollapsedView && (
                            <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 mt-4 max-w-[200px] text-center uppercase tracking-widest leading-relaxed">
                                {t("groups.actions.newGroupDescription")}
                            </p>
                        )}
                    </button>
                </div>
            )}

            {/* Group Details Modal */}
            {selectedGroup && (
                <GroupDetailsView
                    group={selectedGroup}
                    instructors={allInstructors}
                    onClose={() => setSelectedGroupId(null)}
                    onReassignInstructor={handleReassignInstructor}
                    t={t}
                />
            )}
        </PageWrapper>
    );
}

export default GroupsManagement;
