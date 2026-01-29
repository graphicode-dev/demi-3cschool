/**
 * Observability Module
 *
 * Exports for logging, error boundaries, and performance utilities.
 */

// Logger
export { logger } from "./logger";

// Error Boundary
export { ErrorBoundary, DefaultErrorFallback } from "./ErrorBoundary";

// Hooks
export { useDebounce, useDebouncedCallback } from "./useDebounce";

// Types
export type {
    Logger,
    LogLevel,
    LogContext,
    LogEntry,
    ErrorBoundaryProps,
    ErrorBoundaryState,
    ErrorFallbackProps,
} from "./types";
