/**
 * Enrollments Group Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all enrollment groups data
 * queryClient.invalidateQueries({ queryKey: enrollmentsGroupKeys.all });
 *
 * // Invalidate only online groups
 * queryClient.invalidateQueries({ queryKey: enrollmentsGroupKeys.onlineGroups() });
 *
 * // Invalidate specific program's online groups
 * queryClient.invalidateQueries({ queryKey: enrollmentsGroupKeys.online(programId) });
 * ```
 */

/**
 * Query key factory for enrollment groups
 *
 * Hierarchy:
 * - all: ['enrollmentsGroup']
 * - onlineGroups: ['enrollmentsGroup', 'online']
 * - online(programId): ['enrollmentsGroup', 'online', programId]
 * - offlineGroups: ['enrollmentsGroup', 'offline']
 * - offline(programId): ['enrollmentsGroup', 'offline', programId]
 */
export const enrollmentsGroupKeys = {
    /**
     * Root key for all enrollment group queries
     */
    all: ["enrollmentsGroup"] as const,

    /**
     * Key for all online group queries
     */
    onlineGroups: () => [...enrollmentsGroupKeys.all, "online"] as const,

    /**
     * Key for specific program's online groups
     */
    online: (programId: number | string) =>
        [...enrollmentsGroupKeys.onlineGroups(), programId] as const,

    /**
     * Key for all offline group queries
     */
    offlineGroups: () => [...enrollmentsGroupKeys.all, "offline"] as const,

    /**
     * Key for specific program's offline groups
     */
    offline: (programId: number | string) =>
        [...enrollmentsGroupKeys.offlineGroups(), programId] as const,
};

/**
 * Type for enrollment group query keys
 */
export type EnrollmentsGroupQueryKey =
    | typeof enrollmentsGroupKeys.all
    | ReturnType<typeof enrollmentsGroupKeys.onlineGroups>
    | ReturnType<typeof enrollmentsGroupKeys.online>
    | ReturnType<typeof enrollmentsGroupKeys.offlineGroups>
    | ReturnType<typeof enrollmentsGroupKeys.offline>;
