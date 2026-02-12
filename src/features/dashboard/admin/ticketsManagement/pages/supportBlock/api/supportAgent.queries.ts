/**
 * Support Agent Feature - Query Hooks
 *
 * TanStack Query hooks for fetching support agent data.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { supportAgentKeys } from "./supportAgent.keys";
import { supportAgentApi } from "./supportAgent.api";
import type { SupportAgent } from "../types";
import { ListQueryParams, PaginatedData } from "@/shared/api";

/**
 * Hook to fetch support agents by block ID (paginated)
 */
export function useSupportAgentsByBlock(
    blockId: number | string | undefined | null,
    params: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedData<SupportAgent>, Error>>
) {
    return useQuery({
        queryKey: supportAgentKeys.byBlockPaginated(blockId ?? "", params),
        queryFn: ({ signal }) =>
            supportAgentApi.getByBlockId(blockId!, params, signal),
        enabled: !!blockId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
