/**
 * Assign Primary Teacher Page
 *
 * Page for selecting and assigning a primary teacher to a group.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Search, User } from "lucide-react";
import { ErrorState, LoadingState } from "@/design-system";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";
import { useAvailableTeachersForGroupQuery } from "../api/assignTeacher/assignTeacher.queries";
import { useSetPrimaryTeacherMutation } from "../api/assignTeacher/assignTeacher.mutations";
import type { AvailableTeacher } from "../types/assignTeacher.types";

interface TeacherSelectCardProps {
    teacher: AvailableTeacher;
    onSelect: (teacherId: number) => void;
    isSelecting: boolean;
}

function TeacherSelectCard({
    teacher,
    onSelect,
    isSelecting,
}: TeacherSelectCardProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex items-center justify-center w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full">
                    {teacher.avatar ? (
                        <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <User className="w-6 h-6 text-brand-500" />
                    )}
                </div>

                {/* Teacher Info */}
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {teacher.name}
                    </span>
                    {teacher.email && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {teacher.email}
                        </span>
                    )}
                    {teacher.specialization &&
                        teacher.specialization.length > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                {teacher.specialization.map((spec) => (
                                    <span
                                        key={spec}
                                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        )}
                </div>
            </div>

            {/* Select Button */}
            <button
                type="button"
                onClick={() => onSelect(teacher.id)}
                disabled={isSelecting}
                className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSelecting
                    ? t("common.loading", "Loading...")
                    : t("groups.assignTeacher.select", "Select")}
            </button>
        </div>
    );
}

function AssignTeacherPage() {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const { id: groupId } = useParams<{ id: string }>();
    const { execute } = useMutationHandler();

    const [searchQuery, setSearchQuery] = useState("");

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
                    "toast.success.teacherAssigned",
                    "Primary teacher assigned successfully"
                ),
                onSuccess: () => navigate(-1),
            }
        );
    };

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
                    "Select a teacher to assign as the primary teacher for this group"
                ),
                backButton: true,
            }}
        >
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        aria-label={t(
                            "groups.assignTeacher.searchPlaceholder",
                            "Search teachers by name..."
                        )}
                        placeholder={t(
                            "groups.assignTeacher.searchPlaceholder",
                            "Search teachers by name..."
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isAssigning}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Teacher List */}
            <div className="space-y-3">
                {filteredTeachers.length > 0 ? (
                    filteredTeachers.map((teacher) => (
                        <TeacherSelectCard
                            key={teacher.id}
                            teacher={teacher}
                            onSelect={handleSelectTeacher}
                            isSelecting={isAssigning}
                        />
                    ))
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
        </PageWrapper>
    );
}

export default AssignTeacherPage;
