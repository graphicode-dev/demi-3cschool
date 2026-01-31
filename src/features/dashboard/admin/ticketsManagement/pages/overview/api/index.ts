/**
 * Overview Feature - API Module
 *
 * Public exports for the overview API layer.
 *
 * @example
 * ```ts
 * import {
 *     useOverviewStats,
 *     useOverviewData,
 *     overviewKeys,
 * } from '@/features/ticketsManagement/pages/overview';
 * ```
 */

// Types
export type {
    OverviewStats,
    TicketStatusDistribution,
    WorkloadByBlock,
    SystemHealth,
    WeeklyTrendItem,
    OverviewData,
} from "../types";

// Query Keys
export { overviewKeys, type OverviewQueryKey } from "./overview.keys";

// API Functions
export { overviewApi } from "./overview.api";

// Query Hooks
export {
    useOverviewStats,
    useStatusDistribution,
    useWorkloadByBlock,
    useSystemHealth,
    useWeeklyTrend,
    useOverviewData,
} from "./overview.queries";
