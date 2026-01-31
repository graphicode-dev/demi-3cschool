/**
 * AuthSyncProvider
 *
 * Monitors localStorage and cookies for auth state changes.
 * Automatically logs out the user when:
 * - localStorage is cleared (from another tab or DevTools)
 * - Auth cookies are removed
 */

import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "./auth.store";
import { permissionStore } from "./permission.store";
import { tokenService } from "./tokenService";
import { API_CONFIG } from "@/shared/api/config/env";
import { paths } from "@/router";

const AUTH_STORAGE_KEY = API_CONFIG.PROJECT_NAME + "-auth";
const COOKIE_CHECK_INTERVAL = 1000; // Check cookies every second

interface AuthSyncProviderProps {
    children: ReactNode;
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
    const navigate = useNavigate();
    const { isAuthenticated, setUser, setIsAuthenticated } = authStore();
    const lastTokenRef = useRef<string | undefined>(
        tokenService.getAccessToken()
    );

    /**
     * Handle logout when storage/cookies are cleared
     */
    const handleForceLogout = () => {
        const currentState = authStore.getState();
        if (currentState.isAuthenticated) {
            setUser(null);
            setIsAuthenticated(false);
            permissionStore.getState().clearPermissions();
            tokenService.clearTokens();

            const loginPath = paths.auth.login();
            if (window.location.pathname !== loginPath) {
                navigate(loginPath, { replace: true });
            }
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        /**
         * Listen for localStorage changes (from other tabs or DevTools)
         */
        const handleStorageChange = (event: StorageEvent) => {
            // Check if auth storage was removed or cleared
            if (event.key === AUTH_STORAGE_KEY && event.newValue === null) {
                handleForceLogout();
                return;
            }

            // Check if all storage was cleared (key is null when clear() is called)
            if (event.key === null) {
                handleForceLogout();
                return;
            }

            // Check if auth data was modified to logged out state
            if (event.key === AUTH_STORAGE_KEY && event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    if (parsed?.state?.isAuthenticated === false) {
                        handleForceLogout();
                    }
                } catch {
                    // Invalid JSON, ignore
                }
            }
        };

        /**
         * Periodically check if cookies are still present
         * This catches cases where cookies are cleared via DevTools
         */
        const checkCookies = () => {
            const currentToken = tokenService.getAccessToken();
            const hadToken = lastTokenRef.current;

            // If we had a token before but now it's gone, logout
            if (hadToken && !currentToken) {
                handleForceLogout();
            }

            lastTokenRef.current = currentToken;
        };

        // Add storage event listener
        window.addEventListener("storage", handleStorageChange);

        // Start cookie check interval
        const cookieCheckInterval = setInterval(
            checkCookies,
            COOKIE_CHECK_INTERVAL
        );

        // Also check on visibility change (when user returns to tab)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkCookies();

                // Also check localStorage directly
                const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
                if (!storedAuth) {
                    handleForceLogout();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
            clearInterval(cookieCheckInterval);
        };
    }, [isAuthenticated, navigate, setUser, setIsAuthenticated]);

    return <>{children}</>;
}

export default AuthSyncProvider;
