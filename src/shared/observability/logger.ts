/**
 * Logger
 *
 * Lightweight logger interface for structured logging.
 * In production, this can be replaced with a real logging service.
 *
 * @example
 * ```tsx
 * import { logger } from '@/shared/observability';
 *
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Failed to fetch data', { error, component: 'CoursesList' });
 * ```
 */

import { API_CONFIG } from "../api";
import type { Logger, LogLevel, LogContext, LogEntry } from "./types";

// ============================================================================
// Configuration
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

/**
 * Get minimum log level from environment
 */
function getMinLogLevel(): LogLevel {
    if (API_CONFIG.ENV_MODE == "PROD") {
        return "warn"; // Only warn and error in production
    }
    return "debug"; // All levels in development
}

// ============================================================================
// Logger Implementation
// ============================================================================

/**
 * Create a log entry
 */
function createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext
): LogEntry {
    return {
        level,
        message,
        timestamp: new Date().toISOString(),
        context,
    };
}

/**
 * Format log entry for console
 */
function formatForConsole(entry: LogEntry): string {
    const parts = [
        `[${entry.timestamp}]`,
        `[${entry.level.toUpperCase()}]`,
        entry.message,
    ];

    if (entry.context?.component) {
        parts.splice(2, 0, `[${entry.context.component}]`);
    }

    return parts.join(" ");
}

/**
 * Should log at this level
 */
function shouldLog(level: LogLevel): boolean {
    const minLevel = getMinLogLevel();
    return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

/**
 * Log to console (development)
 */
function logToConsole(entry: LogEntry): void {
    const formatted = formatForConsole(entry);
    const { error, ...restContext } = entry.context || {};

    switch (entry.level) {
        case "debug":
            console.debug(formatted, restContext);
            break;
        case "info":
            console.info(formatted, restContext);
            break;
        case "warn":
            console.warn(formatted, restContext);
            break;
        case "error":
            console.error(formatted, error || restContext);
            break;
    }
}

/**
 * Send to external logging service (production)
 * Replace this with your actual logging service integration
 */
function sendToLoggingService(entry: LogEntry): void {
    // TODO: Integrate with external logging service
    // Examples: Sentry, LogRocket, DataDog, etc.
    //
    // if (entry.level === 'error' && entry.context?.error) {
    //     Sentry.captureException(entry.context.error, {
    //         extra: entry.context,
    //     });
    // }
}

/**
 * Create logger instance
 */
function createLogger(): Logger {
    const log = (level: LogLevel, message: string, context?: LogContext) => {
        if (!shouldLog(level)) return;

        const entry = createLogEntry(level, message, context);

        // Always log to console in development
        if (API_CONFIG.ENV_MODE == "DEV") {
            logToConsole(entry);
        }

        // Send to external service in production
        if (
            API_CONFIG.ENV_MODE == "PROD" &&
            (level === "warn" || level === "error")
        ) {
            sendToLoggingService(entry);
        }
    };

    return {
        debug: (message, context) => log("debug", message, context),
        info: (message, context) => log("info", message, context),
        warn: (message, context) => log("warn", message, context),
        error: (message, context) => log("error", message, context),
    };
}

/**
 * Logger instance
 */
export const logger = createLogger();

export default logger;
