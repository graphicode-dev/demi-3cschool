/**
 * Support Agent Feature - Query Hooks
 *
 * TanStack Query hooks for fetching support agent data.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { supportAgentKeys } from "./supportAgent.keys";
import { supportAgentApi } from "./supportAgent.api";
import type { SupportAgentsListResponse } from "../types";

/**
 * Hook to fetch support agents by block ID (paginated)
 */
export function useSupportAgentsByBlock(
    blockId: number | string | undefined | null,
    page: number = 1,
    options?: Partial<UseQueryOptions<SupportAgentsListResponse, Error>>
) {
    return useQuery({
        queryKey: supportAgentKeys.byBlockPaginated(blockId ?? "", page),
        queryFn: ({ signal }) =>
            supportAgentApi.getByBlockId(blockId!, page, signal),
        enabled: !!blockId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
