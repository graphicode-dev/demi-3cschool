/**
 * Reassign Primary Teacher Page
 *
 * Page for reassigning the primary teacher of a group.
 * Shows current teacher info, warning message, and available teachers grid.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Mail, Users, AlertCircle, CheckCircle, X } from "lucide-react";
import { ErrorState, LoadingState } from "@/design-system";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";
import { useAvailableTeachersForGroupQuery } from "../api/assignTeacher/assignTeacher.queries";
import { useSetPrimaryTeacherMutation } from "../api/assignTeacher/assignTeacher.mutations";
import { useGroup } from "../api";
import type { AvailableTeacher } from "../types/assignTeacher.types";

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
    teacher: AvailableTeacher;
    colorIndex: number;
    onSelect: (teacherId: number) => void;
    isSelecting: boolean;
}

function TeacherCard({
    teacher,
    colorIndex,
    onSelect,
    isSelecting,
}: TeacherCardProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div
                className={`w-16 h-16 ${getAvatarColor(colorIndex)} rounded-full flex items-center justify-center mb-4`}
            >
                {teacher.avatar ? (
                    <img
                        src={teacher.avatar}
                        alt={teacher.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <span className="text-xl font-bold text-white">
                        {getInitials(teacher.name)}
                    </span>
                )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {teacher.name}
            </h3>

            {teacher.specialization && teacher.specialization.length > 0 && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-3">
                    {teacher.specialization[0]}
                </span>
            )}

            {teacher.email && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="truncate max-w-[180px]">
                        {teacher.email}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                <Users className="w-4 h-4" />
                <span>
                    5 {t("teacherManagement.activeGroups", "Active Groups")}
                </span>
            </div>

            <button
                type="button"
                onClick={() => onSelect(teacher.id)}
                disabled={isSelecting}
                className="w-full px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSelecting
                    ? t("common.loading", "Loading...")
                    : t(
                          "groups.reassignTeacher.assignAsNew",
                          "Assign as New Primary Teacher"
                      )}
            </button>
        </div>
    );
}

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

function SuccessDialog({ isOpen, onClose }: SuccessDialogProps) {
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
                        {t(
                            "groups.reassignTeacher.successTitle",
                            "Teacher Reassigned Successfully"
                        )}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {t(
                            "groups.reassignTeacher.successMessage",
                            "The primary teacher for this group has been updated."
                        )}
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

export default function ReassignTeacherPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { id: groupId } = useParams<{ id: string }>();
    const { execute } = useMutationHandler();

    const [searchQuery, setSearchQuery] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const { data: groupData } = useGroup(groupId);

    const {
        data: teachers = [],
        isLoading: teachersLoading,
        error: teachersError,
        refetch: refetchTeachers,
    } = useAvailableTeachersForGroupQuery(Number(groupId), {
        search: searchQuery || undefined,
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
                    "toast.success.teacherReassigned",
                    "Primary teacher reassigned successfully"
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

    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentTeacher = groupData?.primaryTeacher;
    const initials =
        currentTeacher?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??";

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
                    "groups.reassignTeacher.title",
                    "Reassign Primary Teacher"
                ),
                subtitle: t(
                    "groups.reassignTeacher.subtitle",
                    "Select a new teacher to replace the current primary teacher."
                ),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Current Primary Teacher */}
                {currentTeacher && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            {t(
                                "groups.reassignTeacher.currentTeacher",
                                "Current Primary Teacher"
                            )}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold text-white">
                                    {initials}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {currentTeacher.name}
                                </h3>
                                {groupData?.primaryTeacher?.name && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <Mail className="w-4 h-4" />
                                        <span>
                                            sarah.johnson@eduplatform.com
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Warning Message */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                                {t("groups.reassignTeacher.warning", "Warning")}
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                {t(
                                    "groups.reassignTeacher.warningMessage",
                                    "Reassigning the primary teacher will update all sessions that don't have a custom teacher assignment."
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Available Teachers Section */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t(
                                "groups.reassignTeacher.availableTeachers",
                                "Available Teachers"
                            )}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {t(
                                "groups.reassignTeacher.availableDescription",
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
                                "groups.reassignTeacher.searchPlaceholder",
                                "Search teachers by name, email..."
                            )}
                            placeholder={t(
                                "groups.reassignTeacher.searchPlaceholder",
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
                                        "groups.reassignTeacher.noResults",
                                        "No teachers found"
                                    )}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "groups.reassignTeacher.noResultsDescription",
                                        "Try adjusting your search criteria"
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Dialog */}
            <SuccessDialog
                isOpen={showSuccessDialog}
                onClose={handleSuccessClose}
            />
        </PageWrapper>
    );
}
