/**
 * Shared API Layer
 *
 * Re-exports the core API infrastructure for use by feature modules.
 * Features should import from here, not directly from @/api.
 */

// Enhanced HTTP client with auth modes and AbortSignal support
export {
    api,
    enhancedHttpClient,
    serializeParams,
    createParamsSerializer,
    toFormErrors,
    applyServerErrors,
    getFieldErrors,
    getFieldError,
    type AuthMode,
    type RequestMeta,
    type EnhancedRequestConfig,
    type ParamValue,
    type SerializerOptions,
    type PaginationParams,
    type SortParams,
    type FilterParams,
    type ListQueryParams as EnhancedListQueryParams,
} from "@/shared/api/client";

export type {
    ApiResponse,
    ApiError,
    ValidationErrors,
    FormFieldError,
    FormErrors,
    PaginatedResponse,
    PaginationMeta,
    SingleResponse,
    ListResponse,
    ListOrPaginatedResponse,
    RequestOptions,
    HttpMethod,
    ListQueryParams,
    PaginatedData,
    QueryParams,
} from "@/shared/api/types";

export { API_CONFIG, type ApiConfig } from "@/shared/api/config";

export { useMutationHandler } from "@/shared/api/hooks";
