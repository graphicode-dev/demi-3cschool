import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Users,
    Search,
    UserPlus,
    Edit2,
    Trash2,
    Mail,
    Shield,
    Globe,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { PageWrapper, useToast } from "@/design-system";
import { Tabs } from "@/design-system/components/tabs";
import { useUsersList } from "../api";
import { useStaffList, useDeleteStaff } from "../api/staff";
import { useTeachersList, useDeleteTeacher } from "../api/teachers";
import { useStudentsList, useDeleteStudent } from "../api/students";
import type { User } from "../types";
import UserDetailDrawer from "../components/UserDetailDrawer";
import UserOnboardingDrawer from "../components/UserOnboardingDrawer";

// ============================================================================
// Component
// ============================================================================

function UsersManagementsPage() {
    const { t } = useTranslation("systemManagements");
    const { addToast } = useToast();

    // --- Tab state ---
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // --- Drawers ---
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // --- API queries (only fetch when tab is active) ---
    const { data: allUsersData, isLoading: isLoadingAll } = useUsersList(
        {
            page: currentPage,
            ...(searchQuery ? { search: searchQuery } : {}),
        },
        { enabled: activeTab === "all" }
    );

    const { data: staffData, isLoading: isLoadingStaff } = useStaffList(
        searchQuery ? { search: searchQuery } : undefined,
        { enabled: activeTab === "staff" }
    );
    const { data: teachersData, isLoading: isLoadingTeachers } =
        useTeachersList(searchQuery ? { search: searchQuery } : undefined, {
            enabled: activeTab === "teachers",
        });
    const { data: studentsData, isLoading: isLoadingStudents } =
        useStudentsList(searchQuery ? { search: searchQuery } : undefined, {
            enabled: activeTab === "students",
        });

    // --- Delete mutations ---
    const deleteStaff = useDeleteStaff();
    const deleteTeacher = useDeleteTeacher();
    const deleteStudent = useDeleteStudent();

    // --- Derived data per tab ---
    const { users, isLoading, totalPages } = useMemo(() => {
        switch (activeTab) {
            case "staff":
                return {
                    users: staffData ?? [],
                    isLoading: isLoadingStaff,
                    totalPages: 1,
                };
            case "teachers":
                return {
                    users: teachersData ?? [],
                    isLoading: isLoadingTeachers,
                    totalPages: 1,
                };
            case "students":
                return {
                    users: studentsData ?? [],
                    isLoading: isLoadingStudents,
                    totalPages: 1,
                };
            default:
                return {
                    users: allUsersData?.items ?? [],
                    isLoading: isLoadingAll,
                    totalPages: allUsersData?.lastPage ?? 1,
                };
        }
    }, [
        activeTab,
        allUsersData,
        staffData,
        teachersData,
        studentsData,
        isLoadingAll,
        isLoadingStaff,
        isLoadingTeachers,
        isLoadingStudents,
    ]);

    // --- Handlers ---
    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
        setCurrentPage(1);
    }, []);

    const handleDelete = useCallback(
        async (user: User) => {
            if (!confirm(t("users.deleteConfirm"))) return;

            try {
                // Determine which delete to use based on active tab
                if (activeTab === "staff") {
                    await deleteStaff.mutateAsync(user.id);
                } else if (activeTab === "teachers") {
                    await deleteTeacher.mutateAsync(user.id);
                } else if (activeTab === "students") {
                    await deleteStudent.mutateAsync(user.id);
                }
                addToast({
                    type: "success",
                    message: t("users.deleted"),
                });
            } catch {
                addToast({
                    type: "error",
                    message: t("users.deleteError"),
                });
            }
        },
        [activeTab, deleteStaff, deleteTeacher, deleteStudent, addToast, t]
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("users.title"),
                subtitle: t("users.subtitle"),
                fullWidthActions: true,
                actions: (
                    <button
                        onClick={() => setShowOnboarding(true)}
                        className="flex items-center justify-center gap-3 px-6 py-3 bg-brand-500 dark:bg-white text-white dark:text-brand-500 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg uppercase tracking-wider"
                    >
                        <UserPlus size={18} />
                        {t("users.addUser")}
                    </button>
                ),
            }}
        >
            <div className="space-y-6">
                {/* Tabs + Search Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="pills"
                            size="sm"
                        >
                            <Tabs.List>
                                <Tabs.Item
                                    value="all"
                                    label={t("users.tabs.all")}
                                    icon={<Users size={14} />}
                                />
                                <Tabs.Item
                                    value="staff"
                                    label={t("users.tabs.staff")}
                                    icon={<Shield size={14} />}
                                />
                                <Tabs.Item
                                    value="teachers"
                                    label={t("users.tabs.teachers")}
                                    icon={<Globe size={14} />}
                                />
                                <Tabs.Item
                                    value="students"
                                    label={t("users.tabs.students")}
                                    icon={<Mail size={14} />}
                                />
                            </Tabs.List>
                        </Tabs>

                        <div className="relative max-w-sm w-full">
                            <input
                                type="text"
                                placeholder={t("users.search")}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 ps-10 pe-4 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                            />
                            <Search
                                size={16}
                                className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                        {t("users.columns.user")}
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                        {t("users.columns.role")}
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                        {t("users.columns.scope")}
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-start">
                                        {t("users.columns.status")}
                                    </th>
                                    <th className="px-6 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2
                                                    className="animate-spin text-gray-400"
                                                    size={24}
                                                />
                                                <p className="text-sm font-bold text-gray-400">
                                                    {t("users.loading")}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <Users
                                                    size={32}
                                                    className="text-gray-300 dark:text-gray-600"
                                                />
                                                <p className="text-sm font-bold text-gray-400">
                                                    {t("users.noResults")}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="group hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-all cursor-pointer"
                                            onClick={() =>
                                                setSelectedUser(user)
                                            }
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-xl shadow-sm border-2 border-white dark:border-gray-700 object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors text-sm tracking-tight">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {user.role.caption}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                    {user.scope}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                        user.emailVerified
                                                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                                                    }`}
                                                >
                                                    {user.emailVerified
                                                        ? t("users.verified")
                                                        : t("users.unverified")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-end">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedUser(
                                                                user
                                                            );
                                                        }}
                                                        className="p-2 bg-white dark:bg-gray-700 text-gray-400 hover:text-blue-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 active:scale-90 transition-all"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    {activeTab !== "all" && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(
                                                                    user
                                                                );
                                                            }}
                                                            className="p-2 bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 active:scale-90 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination (only for "all" tab which is paginated) */}
                    {activeTab === "all" && totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(1, p - 1))
                                }
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold text-gray-600 dark:text-gray-400"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                {currentPage} / {totalPages}
                            </p>
                            <button
                                onClick={() =>
                                    setCurrentPage((p) =>
                                        Math.min(totalPages, p + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-bold text-gray-600 dark:text-gray-400"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Drawers */}
            {selectedUser && (
                <UserDetailDrawer
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
            {showOnboarding && (
                <UserOnboardingDrawer
                    onClose={() => setShowOnboarding(false)}
                />
            )}
        </PageWrapper>
    );
}

export default UsersManagementsPage;
