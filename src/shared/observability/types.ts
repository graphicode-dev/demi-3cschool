/**
 * Observability Types
 *
 * Types for logging and error tracking.
 */

import type { ReactNode, ComponentType, ErrorInfo } from "react";

// ============================================================================
// Log Levels
// ============================================================================

/**
 * Log level
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Log context - additional data to include with log
 */
export interface LogContext {
    /** Error object if applicable */
    error?: Error;
    /** User ID if available */
    userId?: string;
    /** Component or module name */
    component?: string;
    /** Additional metadata */
    [key: string]: unknown;
}

/**
 * Log entry
 */
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: LogContext;
}

// ============================================================================
// Logger Interface
// ============================================================================

/**
 * Logger interface
 */
export interface Logger {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
}

// ============================================================================
// Error Boundary Types
// ============================================================================

/**
 * Error boundary fallback props
 */
export interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
    /** Fallback UI to show on error */
    fallback?: ReactNode;
    /** Fallback component to render on error */
    FallbackComponent?: ComponentType<ErrorFallbackProps>;
    /** Callback when error is caught */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /** Callback when error boundary resets */
    onReset?: () => void;
    /** Children to render */
    children: ReactNode;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
