/**
 * Performance Feature - API Module
 *
 * Public exports for the performance API layer.
 */

// Types
export type {
    PeriodFilter,
    RatingLevel,
    PerformanceStats,
    WeeklyTrendDataPoint,
    AgentResolutionRate,
    AgentPerformanceRow,
    PeriodSummary,
    TopPerformer,
    PerformanceData,
} from "../types";

// Query Keys
export { performanceKeys, type PerformanceQueryKey } from "./performance.keys";

// API Functions
export { performanceApi } from "./performance.api";

// Query Hooks
export { usePerformanceData } from "./performance.queries";
