/**
 * Groups Management Feature - Query Hooks
 *
 * TanStack Query hooks for reading group data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // Get groups metadata
 * const { data: metadata } = useGroupsMetadata();
 *
 * // List all regular groups
 * const { data, isLoading } = useGroupsList({ groupType: 'regular' });
 *
 * // List with pagination
 * const { data } = useGroupsList({ groupType: 'regular', page: 1 });
 *
 * // Get single group
 * const { data: group } = useGroup(groupId);
 *
 * // Get recommendations
 * const { data } = useGroupRecommendations(payload);
 * ```
 */

import {
    useQuery,
    useInfiniteQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { groupKeys } from "./groups.keys";
import { groupsApi } from "./groups.api";
import type {
    Group,
    GroupsListParams,
    GroupsByLevelParams,
    GroupsMetadata,
    GroupRecommendPayload,
    GroupRecommendationsData,
    GroupType,
} from "../types/groups.types";
import type { GroupSession } from "../types/sessions.types";
import { ListQueryParams, PaginatedData } from "@/shared/api";

// ============================================================================
// Metadata Query
// ============================================================================

/**
 * Hook to fetch groups metadata (filters, operators, searchable columns)
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useGroupsMetadata();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *     <FilterBuilder
 *         filters={metadata.filters}
 *         operators={metadata.operators}
 *     />
 * );
 * ```
 */
export function useGroupsMetadata(
    options?: Partial<UseQueryOptions<GroupsMetadata, Error>>
) {
    return useQuery({
        queryKey: groupKeys.metadata(),
        queryFn: ({ signal }) => groupsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of groups by type (paginated if page provided)
 *
 * @param params - Query parameters including groupType and optional page
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * // Non-paginated list
 * const { data } = useGroupsList({ groupType: 'regular' });
 *
 * // Paginated list
 * const { data } = useGroupsList({ groupType: 'regular', page: 1 });
 * ```
 */
export function useGroupsList(
    params?: ListQueryParams,
    options?: Partial<PaginatedData<Group>>
) {
    return useQuery({
        queryKey: groupKeys.list(params!),
        queryFn: ({ signal }) => groupsApi.getList(params!, signal),
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single group by ID
 *
 * @param id - Group ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: group, isLoading, error } = useGroup(groupId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{group.name}</h1>
 *         <p>Course: {group.course.title}</p>
 *     </div>
 * );
 * ```
 */
export function useGroup(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Group, Error>>
) {
    return useQuery({
        queryKey: groupKeys.detail(id ?? ""),
        queryFn: ({ signal }) => groupsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

// =========================================================================
// Group Sessions
// =========================================================================

export function useGroupSessionsQuery(
    groupId: number | undefined | null,
    options?: Partial<UseQueryOptions<GroupSession[], Error>>
) {
    const groupIdNum = typeof groupId === "number" ? groupId : Number(groupId);
    const defaultEnabled = Number.isFinite(groupIdNum) && groupIdNum > 0;
    const enabled = options?.enabled ?? defaultEnabled;

    return useQuery({
        queryKey: groupKeys.sessionsByGroup(groupIdNum || 0),
        queryFn: ({ signal }) => groupsApi.getSessions(groupIdNum, signal),
        enabled,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

// ============================================================================
// Recommendation Queries
// ============================================================================

/**
 * Hook to fetch group recommendations based on criteria
 *
 * @param payload - Recommendation criteria
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGroupRecommendations({
 *     course_id: '1',
 *     level_id: '1',
 *     capacity: 5,
 *     limit: 10,
 * });
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *     <div>
 *         <p>Found {data.totalFound} recommendations</p>
 *         {data.recommendations.map(rec => (
 *             <RecommendationCard
 *                 key={rec.group.id}
 *                 group={rec.group}
 *                 score={rec.similarityScore}
 *             />
 *         ))}
 *     </div>
 * );
 * ```
 */
export function useGroupRecommendations(
    payload: GroupRecommendPayload | null,
    options?: Partial<UseQueryOptions<GroupRecommendationsData, Error>>
) {
    return useQuery({
        queryKey: groupKeys.recommend(payload!),
        queryFn: ({ signal }) => groupsApi.getRecommendations(payload!, signal),
        enabled: !!payload,
        ...options,
    });
}

// ============================================================================
// By Level Queries
// ============================================================================

/**
 * Hook to fetch groups by level ID
 *
 * @param params - Query parameters including levelId
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGroupsByLevel({ levelId: '123' });
 * ```
 */
export function useGroupsByLevel(
    params: GroupsByLevelParams,
    options?: Partial<UseQueryOptions<PaginatedData<Group>, Error>>
) {
    return useQuery({
        queryKey: groupKeys.byLevel(params),
        queryFn: ({ signal }) => groupsApi.getByLevel(params, signal),
        enabled: !!params.levelId,
        ...options,
    });
}
