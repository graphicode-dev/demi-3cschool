/**
 * ErrorBoundary Component
 *
 * Generic error boundary for catching React rendering errors.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *     fallback={<div>Something went wrong</div>}
 *     onError={(error) => logger.error('Component crashed', { error })}
 * >
 *     <RiskyComponent />
 * </ErrorBoundary>
 * ```
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { logger } from "./logger";
import type {
    ErrorBoundaryProps,
    ErrorBoundaryState,
    ErrorFallbackProps,
} from "./types";
import { API_CONFIG } from "../api";

// ============================================================================
// Default Fallback Component
// ============================================================================

function DefaultErrorFallback({
    error,
    resetErrorBoundary,
}: ErrorFallbackProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <svg
                className="w-12 h-12 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {t("errors.componentError", "Something went wrong")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                {API_CONFIG.ENV_MODE == "DEV"
                    ? error.message
                    : t("errors.tryAgain", "Please try again.")}
            </p>
            <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm"
            >
                {t("actions.tryAgain", "Try Again")}
            </button>
        </div>
    );
}

// ============================================================================
// Error Boundary Class Component
// ============================================================================

class ErrorBoundaryClass extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log the error
        logger.error("React Error Boundary caught an error", {
            error,
            component: errorInfo.componentStack || "Unknown",
        });

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    resetErrorBoundary = (): void => {
        this.props.onReset?.();
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        const { hasError, error } = this.state;
        const { children, fallback, FallbackComponent } = this.props;

        if (hasError && error) {
            // Use custom fallback if provided
            if (fallback) {
                return fallback;
            }

            // Use custom FallbackComponent if provided
            if (FallbackComponent) {
                return (
                    <FallbackComponent
                        error={error}
                        resetErrorBoundary={this.resetErrorBoundary}
                    />
                );
            }

            // Use default fallback
            return (
                <DefaultErrorFallback
                    error={error}
                    resetErrorBoundary={this.resetErrorBoundary}
                />
            );
        }

        return children;
    }
}

// ============================================================================
// Export
// ============================================================================

export { ErrorBoundaryClass as ErrorBoundary };
export { DefaultErrorFallback };
export default ErrorBoundaryClass;
