/**
 * EmptyState Component
 *
 * Placeholder for empty data states.
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState title="No courses found" />
 *
 * // With action
 * <EmptyState
 *     title="No courses yet"
 *     message="Create your first course to get started"
 *     action={{ label: 'Create Course', onClick: () => navigate('/courses/create') }}
 * />
 * ```
 */

import { useTranslation } from "react-i18next";
import type { EmptyStateProps, BaseComponentProps } from "../types";

interface Props extends EmptyStateProps, BaseComponentProps {}

/**
 * Default empty icon
 */
function EmptyIcon({ className = "w-16 h-16" }: { className?: string }) {
    return (
        <svg
            className={`${className} text-gray-300 dark:text-gray-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
        </svg>
    );
}

/**
 * Empty state component
 */
export function EmptyState({
    title,
    message,
    icon,
    action,
    className = "",
    testId,
}: Props) {
    const { t } = useTranslation();

    const defaultTitle = t("common.noData", "No data found");

    return (
        <div
            className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
            data-testid={testId}
        >
            {icon || <EmptyIcon />}

            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {title || defaultTitle}
            </h3>

            {message && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    {message}
                </p>
            )}

            {action && (
                <button
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    className="mt-6 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {action.loading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            {action.label}
                        </span>
                    ) : (
                        <>
                            {action.icon && (
                                <span className="me-2">{action.icon}</span>
                            )}
                            {action.label}
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
