/**
 * Distribution Feature - API Module
 *
 * Public exports for the distribution API layer.
 */

// Types
export type {
    DistributionMethod,
    WorkloadLevel,
    DistributionStats,
    BlockTicketCount,
    BlockWorkloadOverview,
    AgentTicketCount,
    AgentWorkloadIndicator,
    DistributionMethodConfig,
    DistributionData,
} from "../types";

// Query Keys
export {
    distributionKeys,
    type DistributionQueryKey,
} from "./distribution.keys";

// API Functions
export { distributionApi } from "./distribution.api";

// Query Hooks
export { useDistributionData } from "./distribution.queries";
