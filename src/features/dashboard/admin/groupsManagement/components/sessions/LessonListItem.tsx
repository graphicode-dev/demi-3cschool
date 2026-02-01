/**
 * LessonListItem Component
 *
 * Displays a lesson in the Available Lessons panel with its order number,
 * title, and assigned/not assigned status badge.
 */

import { useTranslation } from "react-i18next";

interface LessonListItemProps {
    order: number;
    title: string;
    isAssigned: boolean;
    onClick?: () => void;
}

export function LessonListItem({
    order,
    title,
    isAssigned,
    onClick,
}: LessonListItemProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <button
            type="button"
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer text-left"
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300">
                    L{order}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {title}
                </span>
            </div>
            <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    isAssigned
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
            >
                {isAssigned
                    ? t("sessions.assigned", "Assigned")
                    : t("sessions.notAssigned", "Not Assigned")}
            </span>
        </button>
    );
}

export default LessonListItem;
