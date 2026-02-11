/**
 * Assignments Tab Component
 */

import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { AssignmentRecord } from "../types/profile.types";

interface AssignmentsTabProps {
    assignments: AssignmentRecord[];
}

export default function AssignmentsTab({ assignments }: AssignmentsTabProps) {
    const { t } = useTranslation("profile");

    const getStatusBadge = (status: AssignmentRecord["status"]) => {
        const styles = {
            submitted:
                "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            missing:
                "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
            late: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        };
        return styles[status];
    };

    return (
        <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t("profile.assignments.title", "Assignments")}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "profile.assignments.assignmentTitle",
                                    "Assignment Title"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.assignments.course", "Course")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.assignments.lesson", "Lesson")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.assignments.dueDate", "Due Date")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "profile.assignments.submissionDate",
                                    "Submission Date"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.assignments.status", "Status")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => (
                            <tr
                                key={assignment.id}
                                className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {assignment.title}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {assignment.course}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {assignment.lesson}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {assignment.dueDate}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {assignment.submissionDate || "-"}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}
                                    >
                                        {t(
                                            `profile.assignments.${assignment.status}`,
                                            assignment.status
                                        )}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
