/**
 * Primary Teacher Card Component
 *
 * Displays information about the primary teacher
 */

import type { BaseComponentProps } from "@/design-system/types";
import { useTranslation } from "react-i18next";

interface PrimaryTeacher {
    id: number;
    name: string;
}

interface PrimaryTeacherCardProps extends BaseComponentProps {
    primaryTeacher: PrimaryTeacher | null | undefined;
    loading?: boolean;
    onChangeTeacher?: () => void;
}

export function PrimaryTeacherCard({
    primaryTeacher,
    loading = false,
    onChangeTeacher,
    className = "",
    testId,
}: PrimaryTeacherCardProps) {
    const { t } = useTranslation("groupsManagement");
    if (loading) {
        return (
            <div
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse ${className}`}
                data-testid={testId}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-6"></div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                    </div>
                </div>
            </div>
        );
    }

    const hasTeacher = primaryTeacher && primaryTeacher.id;

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
            data-testid={testId}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("instructor.primaryTeacher", "Primary Teacher")}
                </h2>
            </div>

            <div className="w-full flex items-center justify-between space-x-4">
                <div className="flex items-center justify-center gap-5">
                    {hasTeacher ? (
                        <>
                            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                {primaryTeacher.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {primaryTeacher.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    {t(
                                        "instructor.primaryInstructor",
                                        "Primary Instructor"
                                    )}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 font-semibold text-lg">
                                ?
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                    {t(
                                        "instructor.noAssignedTeacher",
                                        "No Assigned Teacher"
                                    )}
                                </h3>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
                                    {t(
                                        "instructor.assignTeacherPrompt",
                                        "Assign a primary teacher to this group"
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onChangeTeacher}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    {hasTeacher
                        ? t(
                              "instructor.changePrimaryTeacher",
                              "Change Primary Teacher"
                          )
                        : t("instructor.assignTeacher", "Assign Teacher")}
                </button>
            </div>
        </div>
    );
}

export default PrimaryTeacherCard;
