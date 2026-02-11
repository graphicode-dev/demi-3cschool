/**
 * LevelListItem Component
 *
 * A list item for displaying a level with its order number, title, description,
 * capacity, dates, and action buttons. Styled like Competition Timeline.
 */

import { useTranslation } from "react-i18next";

interface LevelListItemProps {
    orderNumber: number;
    title: string;
    description?: string;
    capacity?: number;
    createdAt?: string;
    updatedAt?: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onQuiz?: () => void;
    onClick?: () => void;
    isLast?: boolean;
    className?: string;
}

function EditIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
        </svg>
    );
}

function DeleteIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );
}

function QuizIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
        </svg>
    );
}

export function LevelListItem({
    orderNumber,
    title,
    description,
    capacity,
    createdAt,
    updatedAt,
    onEdit,
    onDelete,
    onQuiz,
    onClick,
    isLast = false,
    className = "",
}: LevelListItemProps) {
    const { t } = useTranslation();

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className={`relative flex ${className}`}>
            <div className="relative flex flex-col items-center me-4">
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold text-xs z-10">
                    {orderNumber}
                </div>
                {!isLast && (
                    <div className="flex-1 w-0.5 bg-gray-200 dark:bg-gray-700 mt-2" />
                )}
            </div>

            <div
                className={`flex-1 pb-6 ${onClick ? "cursor-pointer" : ""}`}
                onClick={onClick}
            >
                <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {description}
                            </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                            {capacity !== undefined && (
                                <span className="flex items-center gap-1">
                                    <UsersIcon />
                                    {t(
                                        "learning:levels.capacity",
                                        "Capacity: {{count}}",
                                        { count: capacity }
                                    )}
                                </span>
                            )}
                            {createdAt && (
                                <span className="flex items-center gap-1">
                                    <CalendarIcon />
                                    {formatDate(createdAt)}
                                </span>
                            )}
                            {updatedAt && (
                                <span className="flex items-center gap-1">
                                    <CalendarIcon />
                                    {t(
                                        "learning:levels.updated",
                                        "Updated: {{date}}",
                                        { date: formatDate(updatedAt) }
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onQuiz && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuiz();
                                }}
                                className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-brand-500 transition-colors"
                                aria-label={t(
                                    "learning:levels.quizzes",
                                    "Quizzes"
                                )}
                                title={t(
                                    "learning:levels.goToQuizzes",
                                    "Go to Quizzes"
                                )}
                            >
                                <QuizIcon />
                            </button>
                        )}

                        {onEdit && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-brand-500 transition-colors"
                                aria-label={t("common.edit", "Edit")}
                            >
                                <EditIcon />
                            </button>
                        )}

                        {onDelete && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                                aria-label={t("common.delete", "Delete")}
                            >
                                <DeleteIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LevelListItem;
