/**
 * Shared Hooks
 *
 * Re-exports shared hooks that can be used across all features.
 * Feature-specific hooks should stay in their feature module.
 */

// URL-synced list state
export { useListQueryState } from "./useListQueryState";
export { useTitle } from "./useTitle";
export { useToast } from "../../design-system/hooks/useToast";
export { useLanguage } from "./useLanguage";
export { usePagination } from "./usePagination";
export { useFormApiErrors } from "./useFormApiErrors";
export type {
    ApiValidationError,
    UseFormApiErrorsOptions,
} from "./useFormApiErrors";
export type {
    SortOrder,
    SortConfig,
    FilterValue,
    Filters,
    ListQueryState,
    UseListQueryStateOptions,
    UseListQueryStateReturn,
    PaginationMeta,
} from "./types";
