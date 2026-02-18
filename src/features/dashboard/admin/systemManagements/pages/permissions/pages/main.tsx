import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Shield,
    Lock,
    Unlock,
    Search,
    ShieldAlert,
    Save,
    RefreshCw,
    Layers,
    ChevronDown,
    Check,
    Filter,
    Sparkles,
    Info,
    ChevronLeft,
    ChevronRight,
    Users,
    Loader2,
} from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { useRolesList } from "../../roles/api";
import { useUsersList } from "../../users/api";
import {
    useAllPermissions,
    useRolePermissions,
    useUserPermissions,
    useAssignUserPermissions,
} from "../api";
import type { PermissionGroup } from "../types";

// ============================================================================
// Constants
// ============================================================================

const GROUP_COLORS = [
    {
        text: "text-blue-600",
        bg: "bg-blue-600",
        darkText: "text-blue-400",
        darkBg: "bg-blue-500",
    },
    {
        text: "text-indigo-600",
        bg: "bg-indigo-600",
        darkText: "text-indigo-400",
        darkBg: "bg-indigo-500",
    },
    {
        text: "text-emerald-600",
        bg: "bg-emerald-600",
        darkText: "text-emerald-400",
        darkBg: "bg-emerald-500",
    },
    {
        text: "text-purple-600",
        bg: "bg-purple-600",
        darkText: "text-purple-400",
        darkBg: "bg-purple-500",
    },
    {
        text: "text-amber-600",
        bg: "bg-amber-600",
        darkText: "text-amber-400",
        darkBg: "bg-amber-500",
    },
    {
        text: "text-rose-600",
        bg: "bg-rose-600",
        darkText: "text-rose-400",
        darkBg: "bg-rose-500",
    },
    {
        text: "text-cyan-600",
        bg: "bg-cyan-600",
        darkText: "text-cyan-400",
        darkBg: "bg-cyan-500",
    },
    {
        text: "text-teal-600",
        bg: "bg-teal-600",
        darkText: "text-teal-400",
        darkBg: "bg-teal-500",
    },
];

function getGroupColor(index: number) {
    return GROUP_COLORS[index % GROUP_COLORS.length];
}

// ============================================================================
// Component
// ============================================================================

function Permissions() {
    const { t } = useTranslation("systemManagements");
    const { addToast } = useToast();

    // --- Selection state ---
    const [selectedType, setSelectedType] = useState<"role" | "user">("role");
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [permissionFilter, setPermissionFilter] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Local checked permission IDs (for toggling before save) ---
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
    const [hasLocalChanges, setHasLocalChanges] = useState(false);

    const [expandedCategories, setExpandedCategories] = useState<
        Record<string, boolean>
    >({});

    // --- Debounce search for API ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(permissionFilter.trim());
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [permissionFilter]);

    // --- API queries ---
    const { data: roles, isLoading: isLoadingRoles } = useRolesList();
    const { data: allPermissions, isLoading: isLoadingAllPerms } =
        useAllPermissions({
            page: currentPage,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
        });

    const { data: rolePermissionsData, isLoading: isLoadingRolePerms } =
        useRolePermissions(selectedRoleId ?? 0, undefined, {
            enabled: selectedType === "role" && selectedRoleId !== null,
        });

    const { data: userPermissionsData, isLoading: isLoadingUserPerms } =
        useUserPermissions(selectedUserId ?? 0, undefined, {
            enabled: selectedType === "user" && selectedUserId !== null,
        });

    // --- Mutations ---
    const assignMutation = useAssignUserPermissions();

    // --- Whether an entity is selected ---
    const hasEntitySelected =
        (selectedType === "role" && selectedRoleId !== null) ||
        (selectedType === "user" && selectedUserId !== null);

    // --- Derive the active permission IDs from the API data ---
    const serverPermissionIds = useMemo<Set<number>>(() => {
        if (selectedType === "role" && rolePermissionsData) {
            const ids = new Set<number>();
            const groups = rolePermissionsData.permissions;
            if (Array.isArray(groups)) {
                groups.forEach((group) => {
                    group.permissions.forEach((p) => ids.add(p.id));
                });
            }
            return ids;
        }
        if (selectedType === "user" && userPermissionsData) {
            const ids = new Set<number>();
            // Role permissions (inherited)
            if (Array.isArray(userPermissionsData.rolePermissions)) {
                userPermissionsData.rolePermissions.forEach((group) => {
                    group.permissions.forEach((p) => ids.add(p.id));
                });
            }
            // Direct user permissions
            if (Array.isArray(userPermissionsData.userPermissions)) {
                userPermissionsData.userPermissions.forEach((p) =>
                    ids.add(p.id)
                );
            }
            return ids;
        }
        return new Set();
    }, [selectedType, rolePermissionsData, userPermissionsData]);

    // Sync checkedIds from server when entity changes or data loads
    useEffect(() => {
        setCheckedIds(new Set(serverPermissionIds));
        setHasLocalChanges(false);
    }, [serverPermissionIds]);

    // --- All permissions flat list (for total count & grant all) ---
    const allPermissionIds = useMemo<number[]>(() => {
        if (!allPermissions?.items) return [];
        return allPermissions.items.flatMap((g) =>
            g.permissions.map((p) => p.id)
        );
    }, [allPermissions]);

    // --- Groups from allPermissions (server-side pagination) ---
    const paginatedGroups = useMemo<PermissionGroup[]>(() => {
        if (!allPermissions?.items) return [];
        return allPermissions.items;
    }, [allPermissions]);

    // --- Pagination metadata from API ---
    const totalPages = allPermissions?.lastPage ?? 1;
    const totalGroups = allPermissions?.total ?? 0;

    // Auto-expand paginated groups
    useEffect(() => {
        const expanded: Record<string, boolean> = {};
        paginatedGroups.forEach((g) => {
            expanded[g.name] = expandedCategories[g.name] ?? true;
        });
        setExpandedCategories((prev) => ({ ...prev, ...expanded }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, permissionFilter]);

    const isAllSelected =
        checkedIds.size > 0 && checkedIds.size === allPermissionIds.length;

    // --- Entity display name ---
    const entityName = useMemo(() => {
        if (selectedType === "role") {
            if (rolePermissionsData) return rolePermissionsData.caption ?? "";
            return (
                roles?.items?.find((r) => r.id === selectedRoleId)?.caption ??
                ""
            );
        }
        if (userPermissionsData) return userPermissionsData.userName;
        return "";
    }, [
        selectedType,
        rolePermissionsData,
        userPermissionsData,
        roles,
        selectedRoleId,
    ]);

    // --- Handlers ---
    const togglePermission = useCallback((permissionId: number) => {
        setCheckedIds((prev) => {
            const next = new Set(prev);
            if (next.has(permissionId)) {
                next.delete(permissionId);
            } else {
                next.add(permissionId);
            }
            return next;
        });
        setHasLocalChanges(true);
    }, []);

    const selectAll = useCallback(() => {
        setCheckedIds(new Set(allPermissionIds));
        setHasLocalChanges(true);
    }, [allPermissionIds]);

    const clearAll = useCallback(() => {
        setCheckedIds(new Set());
        setHasLocalChanges(true);
    }, []);

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleSave = useCallback(() => {
        if (!hasEntitySelected) return;

        if (selectedType === "role" && selectedRoleId !== null) {
            const permissionIds = [...checkedIds];

            const isSame =
                permissionIds.length === serverPermissionIds.size &&
                permissionIds.every((id) => serverPermissionIds.has(id));

            if (isSame) {
                addToast({ type: "info", message: t("permissions.noChanges") });
                return;
            }

            assignMutation
                .mutateAsync({
                    userId: selectedRoleId,
                    permission_ids: permissionIds,
                })
                .then(() => {
                    setHasLocalChanges(false);
                    addToast({
                        type: "success",
                        message: t("permissions.saved"),
                    });
                })
                .catch(() => {
                    addToast({
                        type: "error",
                        message: t("permissions.saveError"),
                    });
                });
            return;
        }

        if (selectedType === "user" && selectedUserId !== null) {
            const permissionIds = [...checkedIds];

            // Check if there are actual changes
            const isSame =
                permissionIds.length === serverPermissionIds.size &&
                permissionIds.every((id) => serverPermissionIds.has(id));

            if (isSame) {
                addToast({ type: "info", message: t("permissions.noChanges") });
                return;
            }

            // Send the full set of checked permission IDs
            assignMutation
                .mutateAsync({
                    userId: selectedUserId,
                    permission_ids: permissionIds,
                })
                .then(() => {
                    setHasLocalChanges(false);
                    addToast({
                        type: "success",
                        message: t("permissions.saved"),
                    });
                })
                .catch(() => {
                    addToast({
                        type: "error",
                        message: t("permissions.saveError"),
                    });
                });
        }
    }, [
        hasEntitySelected,
        selectedType,
        selectedRoleId,
        selectedUserId,
        checkedIds,
        serverPermissionIds,
        assignMutation,
        addToast,
        t,
    ]);

    const isSaving = assignMutation.isPending;
    const isLoadingPerms =
        (selectedType === "role" && isLoadingRolePerms) ||
        (selectedType === "user" && isLoadingUserPerms);

    // --- User sidebar state ---
    const [userSearch, setUserSearch] = useState("");
    const [debouncedUserSearch, setDebouncedUserSearch] = useState("");
    const [userPage, setUserPage] = useState(1);

    // Debounce user search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUserSearch(userSearch.trim());
            setUserPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [userSearch]);

    const { data: usersData, isLoading: isLoadingUsers } = useUsersList({
        page: userPage,
        ...(debouncedUserSearch ? { search: debouncedUserSearch } : {}),
    });

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("permissions.title"),
                subtitle: t("permissions.subtitle"),
                fullWidthActions: true,
                actions: (
                    <div className="w-full flex flex-col-reverse lg:relative lg:flex-row items-center justify-end gap-3 lg:min-h-[48px]">
                        {/* Max Auth Warning Banner */}
                        {isAllSelected && (
                            <div className="w-full flex justify-center lg:absolute lg:inset-0 lg:items-center lg:justify-center lg:pointer-events-none">
                                <div className="bg-amber-500 dark:bg-amber-600 text-white rounded-xl px-6 py-3 flex items-center gap-4 shadow-lg lg:pointer-events-auto">
                                    <ShieldAlert
                                        size={18}
                                        className="animate-pulse"
                                    />
                                    <p className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                                        {t("permissions.maxAuthWarning")}
                                    </p>
                                    <button
                                        onClick={clearAll}
                                        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                                    >
                                        {t("permissions.resetGuard")}
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Action buttons */}
                        <div className="relative z-10 flex flex-wrap items-center justify-end gap-3">
                            <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                <button
                                    onClick={selectAll}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    <Unlock size={14} strokeWidth={2.5} />
                                    {t("permissions.grantAll")}
                                </button>
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    <Lock size={14} strokeWidth={2.5} />
                                    {t("permissions.revokeAll")}
                                </button>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasLocalChanges}
                                className="flex items-center gap-2 px-6 py-3 bg-brand-500 dark:bg-white text-white dark:text-brand-500 hover:bg-brand-600 dark:hover:bg-brand-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <RefreshCw
                                        className="animate-spin"
                                        size={14}
                                    />
                                ) : (
                                    <Save size={14} />
                                )}
                                {isSaving
                                    ? t("permissions.saving")
                                    : t("permissions.save")}
                            </button>
                        </div>
                    </div>
                ),
            }}
            containerClassname="!p-0 !border-0 !bg-transparent"
        >
            <div className="grid grid-cols-12 gap-6 items-start">
                {/* Entity Sidebar */}
                <div className="col-span-12 lg:col-span-3 space-y-4 lg:sticky lg:top-24">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                        {/* Role / User Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => {
                                    setSelectedType("role");
                                    setCurrentPage(1);
                                    setPermissionFilter("");
                                }}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    selectedType === "role"
                                        ? "bg-white dark:bg-gray-600 text-brand-500 dark:text-white shadow-sm"
                                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                            >
                                {t("permissions.roles")}
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedType("user");
                                    setCurrentPage(1);
                                    setPermissionFilter("");
                                }}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    selectedType === "user"
                                        ? "bg-white dark:bg-gray-600 text-brand-500 dark:text-white shadow-sm"
                                        : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                }`}
                            >
                                {t("permissions.users")}
                            </button>
                        </div>

                        {selectedType === "role" ? (
                            <div className="space-y-2">
                                {isLoadingRoles ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2
                                            className="animate-spin text-gray-400"
                                            size={24}
                                        />
                                    </div>
                                ) : (
                                    roles?.items?.map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => {
                                                setSelectedRoleId(role.id);
                                                setCurrentPage(1);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-2 ${
                                                selectedRoleId === role.id
                                                    ? "bg-brand-500 dark:bg-white text-white dark:text-brand-500 border-brand-500 dark:border-white shadow-lg"
                                                    : "text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <div
                                                className={`p-2 rounded-lg transition-all ${
                                                    selectedRoleId === role.id
                                                        ? "bg-white/10 dark:bg-brand-500/10"
                                                        : "bg-brand-500 dark:bg-brand-400 text-white dark:text-white"
                                                }`}
                                            >
                                                <Shield
                                                    size={16}
                                                    strokeWidth={2.5}
                                                />
                                            </div>
                                            <div className="text-start overflow-hidden">
                                                <p className="font-bold text-xs uppercase tracking-tight truncate leading-none">
                                                    {role.caption}
                                                </p>
                                                <p
                                                    className={`text-[10px] font-medium mt-1 ${
                                                        selectedRoleId ===
                                                        role.id
                                                            ? "text-white/60 dark:text-brand-500/60"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`}
                                                >
                                                    {role.scopeLabel}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Search input */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t(
                                            "permissions.searchUsers"
                                        )}
                                        value={userSearch}
                                        onChange={(e) =>
                                            setUserSearch(e.target.value)
                                        }
                                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 ps-10 pe-4 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-brand-500 dark:text-white"
                                    />
                                    <Search
                                        size={16}
                                        className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                </div>

                                {/* Users list */}
                                {isLoadingUsers ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2
                                            className="animate-spin text-gray-400"
                                            size={20}
                                        />
                                    </div>
                                ) : !usersData?.items?.length ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <Users
                                            size={24}
                                            className="mb-2 opacity-30"
                                        />
                                        <p className="text-[10px] font-bold uppercase tracking-wider">
                                            {t("permissions.noResults")}
                                        </p>
                                    </div>
                                ) : (
                                    usersData.items.map((user) => (
                                        <button
                                            key={user.id}
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setCurrentPage(1);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-start transition-all ${
                                                selectedUserId === user.id
                                                    ? "bg-brand-500 dark:bg-white text-white dark:text-brand-500 shadow-lg shadow-brand-500/20 dark:shadow-white/10"
                                                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                                            }`}
                                        >
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full object-cover shrink-0"
                                            />
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-xs uppercase tracking-tight truncate leading-none">
                                                    {user.name}
                                                </p>
                                                <p
                                                    className={`text-[10px] font-medium mt-1 truncate ${
                                                        selectedUserId ===
                                                        user.id
                                                            ? "text-white/60 dark:text-brand-500/60"
                                                            : "text-gray-400 dark:text-gray-500"
                                                    }`}
                                                >
                                                    {user.role.caption}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                )}

                                {/* Pagination */}
                                {usersData && (usersData.lastPage ?? 1) > 1 && (
                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            onClick={() =>
                                                setUserPage((p) =>
                                                    Math.max(1, p - 1)
                                                )
                                            }
                                            disabled={userPage === 1}
                                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft
                                                size={14}
                                                className="text-gray-600 dark:text-gray-400"
                                            />
                                        </button>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                            {userPage} / {usersData.lastPage}
                                        </p>
                                        <button
                                            onClick={() =>
                                                setUserPage((p) =>
                                                    Math.min(
                                                        usersData.lastPage ?? 1,
                                                        p + 1
                                                    )
                                                )
                                            }
                                            disabled={
                                                userPage ===
                                                (usersData.lastPage ?? 1)
                                            }
                                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight
                                                size={14}
                                                className="text-gray-600 dark:text-gray-400"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Permissions Grid */}
                <div className="col-span-12 lg:col-span-9 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Sub-Header */}
                        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-500 dark:bg-white text-white dark:text-brand-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Layers size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-brand-500 dark:text-white leading-none mb-1.5">
                                        {entityName ||
                                            t("permissions.selectEntity")}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            {t("permissions.active")}
                                        </span>
                                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                            {t("permissions.syncStatus", {
                                                active: checkedIds.size,
                                                total: allPermissionIds.length,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pagination */}
                            {hasEntitySelected &&
                                !isLoadingAllPerms &&
                                totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                            {t("permissions.pageInfo", {
                                                current: currentPage,
                                                total: totalPages,
                                                groups: totalGroups,
                                            })}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.max(1, p - 1)
                                                    )
                                                }
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft
                                                    size={16}
                                                    className="text-gray-600 dark:text-gray-400"
                                                />
                                            </button>
                                            {(() => {
                                                const pages: number[] = [];
                                                const maxVisible = 5;
                                                let start = Math.max(
                                                    1,
                                                    currentPage -
                                                        Math.floor(
                                                            maxVisible / 2
                                                        )
                                                );
                                                let end =
                                                    start + maxVisible - 1;
                                                if (end > totalPages) {
                                                    end = totalPages;
                                                    start = Math.max(
                                                        1,
                                                        end - maxVisible + 1
                                                    );
                                                }
                                                for (
                                                    let i = start;
                                                    i <= end;
                                                    i++
                                                )
                                                    pages.push(i);
                                                return pages.map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() =>
                                                            setCurrentPage(page)
                                                        }
                                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                                                            currentPage === page
                                                                ? "bg-brand-500 dark:bg-white text-white dark:text-brand-500 shadow-lg"
                                                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ));
                                            })()}
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.min(
                                                            totalPages,
                                                            p + 1
                                                        )
                                                    )
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight
                                                    size={16}
                                                    className="text-gray-600 dark:text-gray-400"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}

                            <div className="relative max-w-sm w-full">
                                <input
                                    type="text"
                                    placeholder={t(
                                        "permissions.searchPermissions"
                                    )}
                                    value={permissionFilter}
                                    onChange={(e) =>
                                        setPermissionFilter(e.target.value)
                                    }
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 ps-10 pe-4 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-brand-500 dark:text-white"
                                />
                                <Filter
                                    size={16}
                                    className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Initial empty state — no entity selected */}
                        {!hasEntitySelected && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
                                <Shield size={56} className="mb-5 opacity-20" />
                                <p className="text-sm font-bold uppercase tracking-wider mb-1">
                                    {t("permissions.selectEntity")}
                                </p>
                                <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                    {selectedType === "role"
                                        ? t("permissions.selectRoleHint")
                                        : t("permissions.selectUserHint")}
                                </p>
                            </div>
                        )}

                        {/* Loading state */}
                        {hasEntitySelected &&
                            (isLoadingPerms || isLoadingAllPerms) && (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2
                                        className="animate-spin text-gray-400"
                                        size={32}
                                    />
                                </div>
                            )}

                        {/* No results after search */}
                        {hasEntitySelected &&
                            !isLoadingPerms &&
                            !isLoadingAllPerms &&
                            paginatedGroups.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                                    <Filter
                                        size={48}
                                        className="mb-4 opacity-30"
                                    />
                                    <p className="text-sm font-bold uppercase tracking-wider">
                                        {t("permissions.noResults")}
                                    </p>
                                </div>
                            )}

                        {/* Permission Group Modules */}
                        {hasEntitySelected &&
                            !isLoadingPerms &&
                            !isLoadingAllPerms &&
                            paginatedGroups.length > 0 && (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {paginatedGroups.map(
                                        (group, groupIndex) => {
                                            const perPage =
                                                allPermissions?.perPage ?? 25;
                                            const globalIndex =
                                                (currentPage - 1) * perPage +
                                                groupIndex;
                                            const catColors =
                                                getGroupColor(globalIndex);
                                            const perms = group.permissions;
                                            const activeCount = perms.filter(
                                                (p) => checkedIds.has(p.id)
                                            ).length;
                                            const isExpanded =
                                                expandedCategories[
                                                    group.name
                                                ] ?? true;

                                            return (
                                                <div key={group.name}>
                                                    <button
                                                        onClick={() =>
                                                            toggleCategory(
                                                                group.name
                                                            )
                                                        }
                                                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-1.5 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                                                                <div
                                                                    className={`w-full ${catColors.bg} dark:${catColors.darkBg} transition-all duration-700 ease-out`}
                                                                    style={{
                                                                        height: `${perms.length > 0 ? (activeCount / perms.length) * 100 : 0}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                                                                    {group.name}
                                                                </h4>
                                                                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
                                                                    {t(
                                                                        "permissions.securityCluster"
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border flex items-center gap-1.5 ${
                                                                    activeCount >
                                                                    0
                                                                        ? `bg-white dark:bg-gray-700 ${catColors.text} dark:${catColors.darkText} border-gray-200 dark:border-gray-600 shadow-sm`
                                                                        : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-transparent"
                                                                }`}
                                                            >
                                                                <Shield
                                                                    size={10}
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                />
                                                                {activeCount} /{" "}
                                                                {perms.length}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                                                isExpanded
                                                                    ? "bg-brand-500 dark:bg-white text-white dark:text-brand-500 rotate-180 shadow-lg"
                                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                                            }`}
                                                        >
                                                            <ChevronDown
                                                                size={18}
                                                            />
                                                        </div>
                                                    </button>

                                                    {isExpanded && (
                                                        <div className="px-6 pb-6 pt-1">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {perms.map(
                                                                    (p) => {
                                                                        const isActive =
                                                                            checkedIds.has(
                                                                                p.id
                                                                            );
                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    p.id
                                                                                }
                                                                                onClick={() =>
                                                                                    togglePermission(
                                                                                        p.id
                                                                                    )
                                                                                }
                                                                                className={`group relative flex items-start gap-4 p-5 rounded-xl border-2 text-start transition-all hover:scale-[1.01] active:scale-[0.99] ${
                                                                                    isActive
                                                                                        ? "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-md"
                                                                                        : "bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                                                                                }`}
                                                                            >
                                                                                <div
                                                                                    className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all border-2 shrink-0 ${
                                                                                        isActive
                                                                                            ? `${catColors.bg} dark:${catColors.darkBg} text-white border-transparent shadow-md`
                                                                                            : "bg-white dark:bg-gray-700 text-gray-200 dark:text-gray-600 border-gray-200 dark:border-gray-600"
                                                                                    }`}
                                                                                >
                                                                                    {isActive && (
                                                                                        <Check
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                            strokeWidth={
                                                                                                3
                                                                                            }
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p
                                                                                        className={`font-bold text-xs uppercase tracking-wider mb-1 transition-colors truncate ${
                                                                                            isActive
                                                                                                ? "text-brand-500 dark:text-white"
                                                                                                : "text-gray-500 dark:text-gray-400"
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            p.caption
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-[11px] leading-relaxed font-medium text-gray-400 dark:text-gray-500">
                                                                                        {
                                                                                            p.name
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                {isActive && (
                                                                                    <div className="absolute top-4 end-4">
                                                                                        <Sparkles
                                                                                            size={
                                                                                                14
                                                                                            }
                                                                                            className={`${catColors.text} dark:${catColors.darkText}`}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Audit Note */}
                    <div className="flex items-center justify-center gap-2 py-6 opacity-50">
                        <Info size={14} className="text-gray-400" />
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                            {t("permissions.auditNote")}
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default Permissions;
