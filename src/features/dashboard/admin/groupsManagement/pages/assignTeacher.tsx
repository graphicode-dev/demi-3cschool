/**
 * Assign Primary Teacher Page
 *
 * Page for selecting and assigning a primary teacher to a group.
 * Redesigned with teacher cards grid layout.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Mail, Users, Calendar, CheckCircle, X } from "lucide-react";
import { ErrorState, LoadingState, ConfirmDialog } from "@/design-system";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";
import { useSetPrimaryTeacherMutation } from "../api/assignTeacher/assignTeacher.mutations";
import { useGroup } from "../api";
import { useTeachersList } from "@/features/dashboard/admin/settings/teachers/api";
import type { Teacher } from "@/features/dashboard/admin/settings/teachers/types";
import { useDebounce } from "@/shared/observability";

const AVATAR_COLORS = [
    "bg-purple-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-indigo-500",
];

function getAvatarColor(index: number): string {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);
}

interface TeacherCardProps {
    teacher: Teacher;
    colorIndex: number;
    onSelect: (teacherId: number) => void;
    isSelecting: boolean;
    buttonText: string;
}

function TeacherCard({
    teacher,
    colorIndex,
    onSelect,
    isSelecting,
    buttonText,
}: TeacherCardProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div
                className={`w-14 h-14 ${getAvatarColor(colorIndex)} rounded-full flex items-center justify-center mb-3`}
            >
                {teacher.image ? (
                    <img
                        src={teacher.image}
                        alt={teacher.name}
                        className="w-14 h-14 rounded-full object-cover"
                    />
                ) : (
                    <span className="text-base font-bold text-white">
                        {getInitials(teacher.name)}
                    </span>
                )}
            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {teacher.name}
            </h3>

            {(teacher.role?.caption || teacher.role?.name) && (
                <div className="mt-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        {teacher.role?.caption ?? teacher.role?.name}
                    </span>
                </div>
            )}

            <div className="w-full space-y-2 mb-4">
                {teacher.email && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{teacher.email}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>
                        5 {t("teacherManagement.activeGroups", "Active Groups")}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onSelect(teacher.id)}
                disabled={isSelecting}
                className="w-full h-10 bg-sky-500 text-white text-sm font-semibold rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSelecting ? t("common.loading", "Loading...") : buttonText}
            </button>
        </div>
    );
}

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

function SuccessDialog({
    isOpen,
    onClose,
    title,
    message,
}: SuccessDialogProps) {
    const { t } = useTranslation("groupsManagement");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
                    >
                        {t("common.done", "Done")}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AssignTeacherPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { id: groupId } = useParams<{ id: string }>();
    const { execute } = useMutationHandler();

    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const { data: groupData } = useGroup(groupId);

    const {
        data: teachersResponse,
        isLoading: teachersLoading,
        error: teachersError,
        refetch: refetchTeachers,
    } = useTeachersList({
        page: 1,
        search: debouncedSearchQuery || undefined,
    });

    const { mutateAsync: setPrimaryTeacher, isPending: isAssigning } =
        useSetPrimaryTeacherMutation();

    const handleSelectTeacher = (teacherId: number) => {
        execute(
            () =>
                setPrimaryTeacher({
                    groupId: Number(groupId),
                    payload: {
                        primaryTeacherId: teacherId,
                    },
                }),
            {
                successMessage: t(
                    "toast.success.teacherAssigned",
                    "Primary teacher assigned successfully"
                ),
                onSuccess: () => {
                    setShowSuccessDialog(true);
                },
            }
        );
    };

    const handleSuccessClose = () => {
        setShowSuccessDialog(false);
        navigate(-1);
    };

    const teachers = teachersResponse?.items ?? [];

    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (teachersError) {
        return (
            <ErrorState
                message={
                    teachersError.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetchTeachers}
            />
        );
    }

    if (teachersLoading) {
        return <LoadingState />;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "groups.assignTeacher.title",
                    "Assign Primary Teacher"
                ),
                subtitle: t(
                    "groups.assignTeacher.subtitle",
                    "Select a teacher to be assigned as the primary instructor for this session"
                ),
                backButton: true,
            }}
        >
            {/* Session Information */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t(
                        "groups.assignTeacher.sessionInfo",
                        "Session Information"
                    )}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t(
                                "groups.assignTeacher.sessionName",
                                "Session Name"
                            )}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Session 1: Introduction to Mathematics
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t("groups.assignTeacher.dateTime", "Date & Time")}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            February 10, 2026 at 10:00 AM
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t("groups.assignTeacher.groupName", "Group Name")}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {groupData?.name || "Grade 4 - Mathematics Group A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t(
                                "groups.assignTeacher.currentTeacher",
                                "Current Teacher"
                            )}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {groupData?.primaryTeacher?.name ||
                                "Dr. Sarah Johnson"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Available Teachers Section */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {t(
                            "groups.assignTeacher.availableTeachers",
                            "Available Teachers"
                        )}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {t(
                            "groups.assignTeacher.availableDescription",
                            "These are the teachers available during this group time."
                        )}
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        aria-label={t(
                            "groups.assignTeacher.searchPlaceholder",
                            "Search teachers by name, email..."
                        )}
                        placeholder={t(
                            "groups.assignTeacher.searchPlaceholder",
                            "Search teachers by name, email..."
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isAssigning}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50"
                    />
                </div>

                {/* Teacher Cards Grid */}
                {filteredTeachers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredTeachers.map((teacher, index) => (
                            <TeacherCard
                                key={teacher.id}
                                teacher={teacher}
                                colorIndex={index}
                                onSelect={handleSelectTeacher}
                                isSelecting={isAssigning}
                                buttonText={t(
                                    "groups.assignTeacher.assignAsPrimary",
                                    "Assign as Primary Teacher"
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                {t(
                                    "groups.assignTeacher.noResults",
                                    "No teachers found"
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "groups.assignTeacher.noResultsDescription",
                                    "Try adjusting your search criteria"
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Dialog */}
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={handleSuccessClose}
                title={t(
                    "groups.assignTeacher.successTitle",
                    "Primary Teacher Assigned Successfully"
                )}
                message={t(
                    "groups.assignTeacher.successMessage",
                    "The selected teacher has been assigned as the primary teacher for this session."
                )}
            />
        </PageWrapper>
    );
}

export default AssignTeacherPage;
