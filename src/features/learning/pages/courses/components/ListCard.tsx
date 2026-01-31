/**
 * ListCard Component
 *
 * A card component for displaying list items with title, description, and actions.
 *
 * @example
 * ```tsx
 * <ListCard
 *     title="Scratch & Block-Based Programming"
 *     description="Introduction to coding through visual programming"
 *     onEdit={() => navigate(`/edit/${id}`)}
 *     onDelete={() => handleDelete(id)}
 *     onView={() => navigate(`/view/${id}`)}
 * />
 * ```
 */

import { BaseComponentProps } from "@/design-system";
import type { ReactNode } from "react";

interface ListCardProps extends BaseComponentProps {
    /** Card title */
    title: string;
    /** Card description */
    description?: string;
    /** Status badge (e.g., "Active", "Inactive") */
    status?: {
        label: string;
        variant: "success" | "warning" | "error" | "default";
    };
    /** Additional info line (e.g., date range) */
    meta?: string;
    /** Edit action handler */
    onEdit?: () => void;
    /** Delete action handler */
    onDelete?: () => void;
    /** View/Navigate action handler */
    onView?: () => void;
    /** Custom actions to render */
    actions?: ReactNode;
    /** Whether the card is disabled */
    disabled?: boolean;
}

/**
 * Edit icon component
 */
function EditIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

/**
 * Delete icon component
 */
function DeleteIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

/**
 * Chevron right icon component
 */
function ChevronRightIcon() {
    return (
        <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
            />
        </svg>
    );
}

/**
 * Calendar icon component
 */
function CalendarIcon() {
    return (
        <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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

const STATUS_COLORS = {
    success:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
};

/**
 * List card component for displaying items in a list
 */
export function ListCard({
    title,
    description,
    status,
    meta,
    onEdit,
    onDelete,
    onView,
    actions,
    disabled = false,
    className = "",
    testId,
}: ListCardProps) {
    return (
        <div
            className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                disabled ? "opacity-50 pointer-events-none" : ""
            } ${className}`}
            data-testid={testId}
            onClick={onView}
        >
            <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        {status && (
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status.variant]}`}
                            >
                                {status.label}
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {description}
                        </p>
                    )}
                    {meta && (
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                                <CalendarIcon />
                                {meta}
                            </span>
                        </div>
                    )}
                </div>

                {actions ? (
                    actions
                ) : (
                    <div className="flex items-center gap-2">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="h-8 w-8 flex items-center justify-center text-gray-500 hover:text-brand-500 transition-colors"
                                aria-label="Edit"
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
                                aria-label="Delete"
                            >
                                <DeleteIcon />
                            </button>
                        )}
                    </div>
                )}

                {onView && <ChevronRightIcon />}
            </div>
        </div>
    );
}

export default ListCard;
