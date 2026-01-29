/**
 * ErrorState Component
 *
 * Standardized error UI with retry support.
 *
 * @example
 * ```tsx
 * // Basic error
 * <ErrorState message="Failed to load courses" />
 *
 * // With retry
 * <ErrorState
 *     title="Something went wrong"
 *     message="Failed to load courses"
 *     onRetry={() => refetch()}
 * />
 *
 * // Inline variant
 * <ErrorState message="Error" variant="inline" />
 * ```
 */

import { useTranslation } from "react-i18next";
import type { ErrorStateProps, BaseComponentProps } from "../types";

interface Props extends ErrorStateProps, BaseComponentProps {}

/**
 * Error icon component
 */
function ErrorIcon({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg
            className={`${className} text-red-500`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    );
}

/**
 * Error state component
 */
export function ErrorState({
    title,
    message,
    onRetry,
    showIcon = true,
    variant = "card",
    className = "",
    testId,
}: Props) {
    const { t } = useTranslation();

    const defaultTitle = t("errors.unexpected", "Something went wrong");

    if (variant === "inline") {
        return (
            <div
                className={`flex items-center gap-2 text-red-600 dark:text-red-400 ${className}`}
                data-testid={testId}
            >
                {showIcon && <ErrorIcon className="w-5 h-5" />}
                <span className="text-sm">{message}</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-sm underline hover:no-underline"
                    >
                        {t("actions.retry", "Retry")}
                    </button>
                )}
            </div>
        );
    }

    if (variant === "fullPage") {
        return (
            <div
                className={`flex min-h-screen items-center justify-center p-8 ${className}`}
                data-testid={testId}
            >
                <div className="text-center max-w-md">
                    {showIcon && (
                        <ErrorIcon className="w-16 h-16 mx-auto mb-4" />
                    )}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {title || defaultTitle}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {message}
                    </p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                        >
                            {t("actions.tryAgain", "Try Again")}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Card variant (default)
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 ${className}`}
            data-testid={testId}
        >
            {showIcon && <ErrorIcon className="w-12 h-12 mb-4" />}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {title || defaultTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                {message}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm"
                >
                    {t("actions.tryAgain", "Try Again")}
                </button>
            )}
        </div>
    );
}

export default ErrorState;
