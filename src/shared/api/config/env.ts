/**
 * API Environment Configuration
 * Single source of truth for API-related configuration values
 */

export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    TIMEOUT: 30000,
    AUTH_COOKIE_NAME: import.meta.env.VITE_AUTH_COOKIE_NAME,
    PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME,
    ENV_MODE: import.meta.env.VITE_ENV_MODE,
    AUTH_COOKIE_EXPIRES_DAYS: import.meta.env.VITE_AUTH_COOKIE_EXPIRES_DAYS,
} as const;

export type ApiConfig = typeof API_CONFIG;
