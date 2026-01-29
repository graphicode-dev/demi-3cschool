/**
 * API Environment Configuration
 * Single source of truth for API-related configuration values
 */

const getBaseUrl = (): string => {
    const url = import.meta.env.VITE_BASE_URL as string;
    // If URL doesn't start with a protocol or //, add // for protocol-relative URL
    if (
        url &&
        !url.startsWith("http://") &&
        !url.startsWith("https://") &&
        !url.startsWith("//")
    ) {
        return `//${url}`;
    }
    return url;
};

export const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    TIMEOUT: 30000,
    AUTH_COOKIE_NAME: import.meta.env.VITE_AUTH_COOKIE_NAME,
    PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME,
    ENV_MODE: import.meta.env.VITE_ENV_MODE,
    AUTH_COOKIE_EXPIRES_DAYS: import.meta.env.VITE_AUTH_COOKIE_EXPIRES_DAYS,
} as const;

export type ApiConfig = typeof API_CONFIG;
