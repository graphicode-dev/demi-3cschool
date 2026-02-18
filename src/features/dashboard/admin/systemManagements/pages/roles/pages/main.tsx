import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Shield,
    ShieldCheck,
    PlusCircle,
    Sparkles,
    GripVertical,
    X,
    Edit2,
    Check,
    Users,
    Globe,
    Fingerprint,
    Activity,
    Loader2,
    Target,
    LayoutGrid,
} from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import {
    useRolesList,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
} from "../api";
import type { Role, CreateRolePayload, UpdateRolePayload } from "../types";

// ============================================================================
// Constants
// ============================================================================

const SCOPE_ICONS: Record<string, typeof Globe> = {
    GLOBAL: Globe,
    SQUAD: Users,
};

const ROLE_ICONS = [ShieldCheck, Target, LayoutGrid, Shield];

function getRoleIcon(index: number) {
    return ROLE_ICONS[index % ROLE_ICONS.length];
}

const SCOPE_COLORS: Record<
    string,
    { bg: string; text: string; badge: string }
> = {
    GLOBAL: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        badge: "border-orange-100",
    },
    SQUAD: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        badge: "border-blue-100",
    },
};

const CARD_COLORS = [
    "bg-slate-900",
    "bg-indigo-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-500",
    "bg-rose-600",
];

function getCardColor(index: number) {
    return CARD_COLORS[index % CARD_COLORS.length];
}

// ============================================================================
// Component
// ============================================================================

function RolesManagementPage() {
    const { t } = useTranslation("systemManagements");
    const { addToast } = useToast();

    // --- Data ---
    const { data: rolesData, isLoading } = useRolesList();
    const roles = useMemo(() => rolesData?.items ?? [], [rolesData]);

    // --- Local drag order ---
    const [orderedRoles, setOrderedRoles] = useState<Role[] | null>(null);
    const displayRoles = orderedRoles ?? roles;

    // Sync when server data changes and no local reorder is active
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // --- Modal state ---
    const [showModal, setShowModal] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);

    // --- Form state ---
    const [formName, setFormName] = useState("");
    const [formCaption, setFormCaption] = useState("");
    const [formScope, setFormScope] = useState<"SQUAD" | "GLOBAL">("SQUAD");
    const [formSquadType, setFormSquadType] = useState<"CORE" | "EXECUTION">(
        "CORE"
    );

    // --- Mutations ---
    const createRole = useCreateRole();
    const updateRole = useUpdateRole();
    const deleteRole = useDeleteRole();
    const isMutating = createRole.isPending || updateRole.isPending;

    // --- Scope analytics ---
    const globalCount = displayRoles.filter((r) => r.scope === "GLOBAL").length;
    const squadCount = displayRoles.filter((r) => r.scope === "SQUAD").length;
    const total = displayRoles.length || 1;

    // ========================================================================
    // Drag & Drop
    // ========================================================================

    const handleDragStart = useCallback(
        (index: number) => {
            if (!orderedRoles) setOrderedRoles([...roles]);
            setDraggedIndex(index);
        },
        [roles, orderedRoles]
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent, index: number) => {
            e.preventDefault();
            if (draggedIndex === null || draggedIndex === index) return;

            setOrderedRoles((prev) => {
                const list = prev ? [...prev] : [...roles];
                const item = list[draggedIndex];
                list.splice(draggedIndex, 1);
                list.splice(index, 0, item);
                return list;
            });
            setDraggedIndex(index);
        },
        [draggedIndex, roles]
    );

    const handleDragEnd = useCallback(() => {
        setDraggedIndex(null);
    }, []);

    // ========================================================================
    // Modal Handlers
    // ========================================================================

    const openCreate = useCallback(() => {
        setEditingRole(null);
        setFormName("");
        setFormCaption("");
        setFormScope("SQUAD");
        setFormSquadType("CORE");
        setShowModal(true);
    }, []);

    const openEdit = useCallback((role: Role) => {
        setEditingRole(role);
        setFormName(role.name);
        setFormCaption(role.caption);
        setFormScope(role.scope as "SQUAD" | "GLOBAL");
        setFormSquadType((role.squadType as "CORE" | "EXECUTION") ?? "CORE");
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingRole(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!formName.trim() || !formCaption.trim()) return;

        try {
            if (editingRole) {
                const payload: UpdateRolePayload = {
                    name: formName,
                    caption: formCaption,
                    scope: formScope,
                    squad_type: formSquadType,
                };
                await updateRole.mutateAsync({
                    id: editingRole.id,
                    payload,
                });
                addToast({ type: "success", message: t("roles.updated") });
            } else {
                const payload: CreateRolePayload = {
                    name: formName,
                    caption: formCaption,
                    scope: formScope,
                    squad_type: formSquadType,
                };
                await createRole.mutateAsync(payload);
                addToast({ type: "success", message: t("roles.created") });
            }
            setOrderedRoles(null);
            closeModal();
        } catch {
            addToast({
                type: "error",
                message: editingRole
                    ? t("roles.updateError")
                    : t("roles.createError"),
            });
        }
    }, [
        formName,
        formCaption,
        formScope,
        formSquadType,
        editingRole,
        createRole,
        updateRole,
        addToast,
        t,
        closeModal,
    ]);

    const handleDelete = useCallback(
        async (role: Role) => {
            if (!confirm(t("roles.deleteConfirm"))) return;
            try {
                await deleteRole.mutateAsync(role.id);
                setOrderedRoles(null);
                addToast({ type: "success", message: t("roles.deleted") });
            } catch {
                addToast({ type: "error", message: t("roles.deleteError") });
            }
        },
        [deleteRole, addToast, t]
    );

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("roles.title"),
                subtitle: t("roles.subtitle"),
                fullWidthActions: true,
                actions: (
                    <button
                        onClick={openCreate}
                        className="whitespace-nowrap flex items-center gap-3 px-10 py-4 bg-brand-500 dark:bg-white text-white dark:text-brand-500 hover:bg-orange-500 dark:hover:bg-gray-100 rounded-full font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl hover:scale-105 active:scale-95 group"
                    >
                        <PlusCircle
                            size={18}
                            strokeWidth={3}
                            className="group-hover:rotate-90 transition-transform"
                        />
                        {t("roles.createRole")}
                    </button>
                ),
            }}
        >
            <div className="grid grid-cols-12 gap-12">
                {/* ============================================================ */}
                {/* Role List */}
                {/* ============================================================ */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-4 px-6">
                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em]">
                            {t("roles.dragHint")}
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                {t("roles.liveMatrix")}
                            </p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Loader2
                                className="animate-spin text-gray-400"
                                size={28}
                            />
                            <p className="text-sm font-bold text-gray-400">
                                {t("roles.loading")}
                            </p>
                        </div>
                    ) : displayRoles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <Shield
                                size={40}
                                className="text-gray-300 dark:text-gray-600"
                            />
                            <p className="text-sm font-bold text-gray-400">
                                {t("roles.noResults")}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayRoles.map((role, idx) => {
                                const Icon = getRoleIcon(idx);
                                const cardColor = getCardColor(idx);
                                const scopeColor =
                                    SCOPE_COLORS[role.scope] ??
                                    SCOPE_COLORS.SQUAD;
                                const ScopeIcon =
                                    SCOPE_ICONS[role.scope] ?? Users;

                                return (
                                    <div
                                        key={role.id}
                                        draggable
                                        onDragStart={() => handleDragStart(idx)}
                                        onDragOver={(e) =>
                                            handleDragOver(e, idx)
                                        }
                                        onDragEnd={handleDragEnd}
                                        className="bg-white dark:bg-gray-800 rounded-[44px] border-2 border-gray-100 dark:border-gray-700 transition-all duration-500 group cursor-grab active:cursor-grabbing relative overflow-hidden"
                                    >
                                        <div
                                            className={`absolute -end-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${cardColor}`}
                                        />

                                        <div className="p-10 flex items-start gap-8 relative z-10">
                                            <div className="flex flex-col items-center gap-4">
                                                <div
                                                    className={`w-20 h-20 ${cardColor} text-white rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110`}
                                                >
                                                    <Icon
                                                        size={36}
                                                        strokeWidth={2.5}
                                                    />
                                                </div>
                                                <div className="p-2 text-gray-200 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors">
                                                    <GripVertical size={24} />
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">
                                                            {role.caption}
                                                        </h3>
                                                        <div
                                                            className={`px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm transition-all ${scopeColor.bg} ${scopeColor.text} ${scopeColor.badge}`}
                                                        >
                                                            <ScopeIcon
                                                                size={12}
                                                                strokeWidth={3}
                                                            />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                                {
                                                                    role.scopeLabel
                                                                }{" "}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEdit(role)
                                                            }
                                                            className="p-3 bg-gray-50 dark:bg-gray-700 text-gray-300 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-2xl transition-all active:scale-90"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    role
                                                                )
                                                            }
                                                            className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-2xl transition-all active:scale-90"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-6">
                                                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                        {role.name} —{" "}
                                                        {t(
                                                            "roles.authorizationTier"
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 items-center">
                                                    {role.squadTypeLabel && (
                                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600 transition-all group-hover:bg-white dark:group-hover:bg-gray-600 hover:scale-105">
                                                            <Check
                                                                size={12}
                                                                strokeWidth={4}
                                                                className="text-emerald-500"
                                                            />
                                                            <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                                                                {
                                                                    role.squadTypeLabel
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600 transition-all group-hover:bg-white dark:group-hover:bg-gray-600 hover:scale-105">
                                                        <Check
                                                            size={12}
                                                            strokeWidth={4}
                                                            className="text-emerald-500"
                                                        />
                                                        <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                                                            {role.isActive
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ============================================================ */}
                {/* Sidebar Analytics */}
                {/* ============================================================ */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-gray-900 dark:bg-gray-950 rounded-[56px] p-12 text-white shadow-2xl relative overflow-hidden group transition-all duration-700 hover:shadow-blue-900/20">
                        <div className="absolute -end-10 -bottom-10 p-20 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Fingerprint size={300} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-4 bg-white/10 rounded-3xl text-brand-500 transition-all group-hover:bg-white/20">
                                    <Activity size={28} />
                                </div>
                                <h4 className="text-2xl font-black tracking-tighter">
                                    {t("roles.scopeDistribution")}
                                </h4>
                            </div>

                            <div className="space-y-8">
                                {/* Global bar */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                                            {t("roles.globalScope")}
                                        </span>
                                        <span className="text-[11px] font-black text-brand-400">
                                            {Math.round(
                                                (globalCount / total) * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-orange-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                                            style={{
                                                width: `${(globalCount / total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Squad bar */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                                            {t("roles.squadScope")}
                                        </span>
                                        <span className="text-[11px] font-black text-brand-400">
                                            {Math.round(
                                                (squadCount / total) * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                            style={{
                                                width: `${(squadCount / total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================ */}
            {/* Add / Edit Role Modal */}
            {/* ================================================================ */}
            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[56px] p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 start-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                        <button
                            onClick={closeModal}
                            className="absolute top-10 end-10 p-4 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-3xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700 active:rotate-90"
                        >
                            <X size={24} />
                        </button>

                        {/* Modal Header */}
                        <div className="flex items-center gap-6 mb-12">
                            <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-3xl flex items-center justify-center shadow-2xl ring-8 ring-gray-50 dark:ring-gray-800">
                                {editingRole ? (
                                    <Edit2 size={32} />
                                ) : (
                                    <PlusCircle size={32} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    {editingRole
                                        ? t("roles.modal.editTitle")
                                        : t("roles.modal.createTitle")}
                                </h2>
                                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                                    {t("roles.modal.subtitle")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Name */}
                            <div className="group">
                                <label className="text-[11px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-3 block ms-4 transition-colors group-focus-within:text-brand-500">
                                    {t("roles.modal.name")}
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) =>
                                        setFormName(
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/\s+/g, "_")
                                                .replace(/[^a-z0-9_]/g, "")
                                        )
                                    }
                                    placeholder={t(
                                        "roles.modal.namePlaceholder"
                                    )}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-750 rounded-[32px] px-8 py-5 text-lg font-black outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                />
                            </div>

                            {/* Caption */}
                            <div className="group">
                                <label className="text-[11px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-3 block ms-4 transition-colors group-focus-within:text-brand-500">
                                    {t("roles.modal.caption")}
                                </label>
                                <input
                                    type="text"
                                    value={formCaption}
                                    onChange={(e) =>
                                        setFormCaption(e.target.value)
                                    }
                                    placeholder={t(
                                        "roles.modal.captionPlaceholder"
                                    )}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 focus:border-brand-500 focus:bg-white dark:focus:bg-gray-750 rounded-[32px] px-8 py-5 text-lg font-black outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                />
                            </div>

                            {/* Scope Type */}
                            <div>
                                <label className="text-[11px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-3 block ms-4">
                                    {t("roles.modal.scopeLabel")}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormScope("SQUAD")}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-[32px] border-2 transition-all active:scale-95 ${
                                            formScope === "SQUAD"
                                                ? "bg-blue-50 dark:bg-blue-900/20 border-brand-500 shadow-lg"
                                                : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <div
                                            className={`p-4 rounded-2xl transition-all ${
                                                formScope === "SQUAD"
                                                    ? "bg-brand-500 text-white shadow-md"
                                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                            }`}
                                        >
                                            <Users size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p
                                                className={`text-[13px] font-black uppercase tracking-tight ${
                                                    formScope === "SQUAD"
                                                        ? "text-brand-500"
                                                        : "text-gray-900 dark:text-gray-200"
                                                }`}
                                            >
                                                {t("roles.modal.squad")}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-500">
                                                {t("roles.modal.squadDesc")}
                                            </p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setFormScope("GLOBAL")}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-[32px] border-2 transition-all active:scale-95 ${
                                            formScope === "GLOBAL"
                                                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500 shadow-lg"
                                                : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <div
                                            className={`p-4 rounded-2xl transition-all ${
                                                formScope === "GLOBAL"
                                                    ? "bg-orange-500 text-white shadow-md"
                                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                            }`}
                                        >
                                            <Globe size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p
                                                className={`text-[13px] font-black uppercase tracking-tight ${
                                                    formScope === "GLOBAL"
                                                        ? "text-orange-600"
                                                        : "text-gray-900 dark:text-gray-200"
                                                }`}
                                            >
                                                {t("roles.modal.global")}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-500">
                                                {t("roles.modal.globalDesc")}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Squad Type */}
                            <div>
                                <label className="text-[11px] font-black text-gray-900 dark:text-gray-300 uppercase tracking-widest mb-3 block ms-4">
                                    {t("roles.modal.squadType")}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormSquadType("CORE")}
                                        className={`flex items-center justify-center gap-3 p-5 rounded-[32px] border-2 transition-all active:scale-95 font-black text-sm uppercase tracking-widest ${
                                            formSquadType === "CORE"
                                                ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-600 shadow-lg"
                                                : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 hover:border-gray-200 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        {formSquadType === "CORE" && (
                                            <Check size={16} strokeWidth={4} />
                                        )}
                                        {t("roles.modal.core")}
                                    </button>
                                    <button
                                        onClick={() =>
                                            setFormSquadType("EXECUTION")
                                        }
                                        className={`flex items-center justify-center gap-3 p-5 rounded-[32px] border-2 transition-all active:scale-95 font-black text-sm uppercase tracking-widest ${
                                            formSquadType === "EXECUTION"
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600 shadow-lg"
                                                : "bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 hover:border-gray-200 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        {formSquadType === "EXECUTION" && (
                                            <Check size={16} strokeWidth={4} />
                                        )}
                                        {t("roles.modal.execution")}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-12 flex gap-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-6 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-[32px] font-black text-[12px] uppercase tracking-widest transition-all active:scale-95"
                            >
                                {t("roles.modal.cancel")}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    isMutating ||
                                    !formName.trim() ||
                                    !formCaption.trim()
                                }
                                className="flex-[2] py-6 bg-brand-500 dark:bg-white text-white dark:text-brand-500 rounded-[32px] font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isMutating ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                        {editingRole
                                            ? t("roles.modal.updating")
                                            : t("roles.modal.creating")}
                                    </>
                                ) : (
                                    <>
                                        {editingRole
                                            ? t("roles.modal.update")
                                            : t("roles.modal.create")}
                                        <Sparkles
                                            size={20}
                                            className="group-hover:rotate-12 transition-transform"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}

export default RolesManagementPage;
