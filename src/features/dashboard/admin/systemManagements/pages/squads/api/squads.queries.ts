import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { squadKeys } from "./squads.keys";
import { squadsApi } from "./squads.api";
import type { Squad, SquadMembersData, SquadStats } from "../types";
import type { ListQueryParams, PaginatedData } from "@/shared/api";

export function useSquadsList(params?: ListQueryParams) {
    return useQuery({
        queryKey: squadKeys.list(params),
        queryFn: ({ signal }) => squadsApi.getAll(params, signal),
    });
}

export function useSquadDetail(
    id: number | null,
    options?: Partial<UseQueryOptions<Squad, Error>>
) {
    return useQuery({
        queryKey: squadKeys.detail(id ?? 0),
        queryFn: ({ signal }) => squadsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

export function useSquadMembers(
    id: number | null,
    options?: Partial<UseQueryOptions<SquadMembersData, Error>>
) {
    return useQuery({
        queryKey: squadKeys.members(id ?? 0),
        queryFn: ({ signal }) => squadsApi.getMembers(id!, signal),
        enabled: !!id,
        ...options,
    });
}

export function useSquadStats(
    options?: Partial<UseQueryOptions<SquadStats, Error>>
) {
    return useQuery({
        queryKey: squadKeys.stats(),
        queryFn: ({ signal }) => squadsApi.getStats(signal),
        ...options,
    });
}
