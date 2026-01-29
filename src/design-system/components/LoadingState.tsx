/**
 * LoadingState Component
 *
 * Standardized loading UI for different contexts.
 *
 * @example
 * ```tsx
 * // Default loading
 * <LoadingState />
 *
 * // With message
 * <LoadingState message="Loading courses..." />
 *
 * // Small inline
 * <LoadingState size="sm" fullScreen={false} />
 *
 * // Overlay
 * <LoadingState overlay />
 * ```
 */

import type { LoadingStateProps, BaseComponentProps } from "../types";

interface Props extends LoadingStateProps, BaseComponentProps {}

const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-[3px]",
    lg: "h-16 w-16 border-4",
};

/**
 * Loading state component
 */
export function LoadingState({
    message,
    size = "md",
    fullScreen = false,
    overlay = false,
    className = "",
    testId,
}: Props) {
    const content = (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div
                    className={`animate-spin rounded-full ${sizeClasses[size]} border-brand-200 dark:border-gray-700`}
                />
                <div
                    className={`absolute inset-0 animate-spin rounded-full ${sizeClasses[size]} border-transparent border-t-brand-500`}
                />
            </div>

            {message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );

    if (overlay) {
        return (
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${className}`}
                data-testid={testId}
            >
                {content}
            </div>
        );
    }

    return (
        <div
            className={`flex items-center justify-center ${
                fullScreen ? "h-screen" : "h-full min-h-[200px]"
            } ${className}`}
            data-testid={testId}
        >
            {content}
        </div>
    );
}

export default LoadingState;
