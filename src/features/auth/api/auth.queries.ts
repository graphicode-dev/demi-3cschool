/**
 * Auth TanStack Query Hooks
 *
 * Query hooks for fetching auth data with caching and refetching.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import type { ApiPermission, User } from "@/auth/auth.types";
import type { SingleResponse } from "@/shared/api";

/**
 * Query keys factory for auth
 */
export const authQueryKeys = {
    all: ["auth"] as const,
    profile: () => [...authQueryKeys.all, "profile"] as const,
    permissions: () => [...authQueryKeys.all, "permissions"] as const,
    magicLink: (token: string) =>
        [...authQueryKeys.all, "magic-link", token] as const,
};

/**
 * Hook to fetch user profile
 */
export function useProfile(
    options?: Omit<
        UseQueryOptions<SingleResponse<User>, Error>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: authQueryKeys.profile(),
        queryFn: () => authApi.profile(),
        ...options,
    });
}

/**
 * Hook to verify magic link token
 */
export function useVerifyMagicLink(
    token: string,
    options?: Omit<
        UseQueryOptions<SingleResponse<User>, Error>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: authQueryKeys.magicLink(token),
        queryFn: () => authApi.verifyMagicLink(token),
        enabled: !!token,
        ...options,
    });
}

/**
 * Hook to fetch user permissions
 * Should be called after successful authentication
 */
export function usePermissionsQuery(
    options?: Omit<
        UseQueryOptions<SingleResponse<ApiPermission[]>, Error>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery({
        queryKey: authQueryKeys.permissions(),
        queryFn: () => authApi.getPermissions(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        ...options,
    });
}
