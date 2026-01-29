/**
 * Token Service
 *
 * Centralized token management with refresh support.
 * Integrates with axios meta.auth for request-level auth control.
 */

import Cookies from "js-cookie";
import { API_CONFIG } from "@/shared/api/config/env";
import type { TokenPair, JwtPayload } from "./auth.types";

// ============================================================================
// Constants
// ============================================================================

const ACCESS_TOKEN_KEY = API_CONFIG.AUTH_COOKIE_NAME;
const REFRESH_TOKEN_KEY = `${API_CONFIG.AUTH_COOKIE_NAME}_refresh`;
const TOKEN_EXPIRY_BUFFER = 60 * 1000; // 1 minute buffer before expiry

// ============================================================================
// Token State
// ============================================================================

let refreshPromise: Promise<TokenPair | null> | null = null;

// ============================================================================
// Token Service
// ============================================================================

export const tokenService = {
    /**
     * Get access token from cookies
     */
    getAccessToken: (): string | undefined => {
        return Cookies.get(ACCESS_TOKEN_KEY);
    },

    /**
     * Get refresh token from cookies
     */
    getRefreshToken: (): string | undefined => {
        return Cookies.get(REFRESH_TOKEN_KEY);
    },

    /**
     * Set tokens in cookies
     */
    setTokens: (tokens: TokenPair): void => {
        const cookieOptions: Cookies.CookieAttributes = {
            secure: window.location.protocol === "https:",
            sameSite: "lax",
        };

        // Set access token
        Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, {
            ...cookieOptions,
            expires: tokens.expiresIn
                ? new Date(Date.now() + tokens.expiresIn * 1000)
                : 1, // 1 day default
        });

        // Set refresh token if provided
        if (tokens.refreshToken) {
            Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, {
                ...cookieOptions,
                expires: 30, // 30 days
            });
        }
    },

    /**
     * Clear all tokens
     */
    clearTokens: (): void => {
        Cookies.remove(ACCESS_TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
    },

    /**
     * Check if access token exists
     */
    hasToken: (): boolean => {
        return !!tokenService.getAccessToken();
    },

    /**
     * Decode JWT payload (without verification)
     */
    decodeToken: (token: string): JwtPayload | null => {
        try {
            const base64Url = token.split(".")[1];
            if (!base64Url) return null;

            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(
                        (c) =>
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    )
                    .join("")
            );

            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    },

    /**
     * Check if token is expired or about to expire
     */
    isTokenExpired: (bufferMs: number = TOKEN_EXPIRY_BUFFER): boolean => {
        const token = tokenService.getAccessToken();
        if (!token) return true;

        const payload = tokenService.decodeToken(token);
        if (!payload?.exp) return true;

        const expiryTime = payload.exp * 1000;
        return Date.now() >= expiryTime - bufferMs;
    },

    /**
     * Get token expiry time in milliseconds
     */
    getTokenExpiry: (): number | null => {
        const token = tokenService.getAccessToken();
        if (!token) return null;

        const payload = tokenService.decodeToken(token);
        if (!payload?.exp) return null;

        return payload.exp * 1000;
    },

    /**
     * Refresh the access token
     * Uses a singleton promise to prevent multiple simultaneous refresh requests
     */
    refreshToken: async (): Promise<TokenPair | null> => {
        // Return existing refresh promise if one is in progress
        if (refreshPromise) {
            return refreshPromise;
        }

        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
            return null;
        }

        refreshPromise = (async () => {
            try {
                // Import dynamically to avoid circular dependency
                const response = await fetch(
                    `${API_CONFIG.BASE_URL}/auth/refresh`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ refreshToken }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Token refresh failed");
                }

                const data = await response.json();
                const tokens: TokenPair = {
                    accessToken: data.access_token || data.accessToken,
                    refreshToken: data.refresh_token || data.refreshToken,
                    expiresIn: data.expires_in || data.expiresIn,
                };

                tokenService.setTokens(tokens);
                return tokens;
            } catch (error) {
                tokenService.clearTokens();
                return null;
            } finally {
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    },

    /**
     * Ensure valid token is available
     * Refreshes if expired, returns null if refresh fails
     */
    ensureValidToken: async (): Promise<string | null> => {
        if (!tokenService.hasToken()) {
            return null;
        }

        if (tokenService.isTokenExpired()) {
            const tokens = await tokenService.refreshToken();
            return tokens?.accessToken ?? null;
        }

        return tokenService.getAccessToken() ?? null;
    },
};

export default tokenService;
