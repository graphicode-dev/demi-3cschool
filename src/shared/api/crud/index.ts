/**
 * CRUD Factory - Public Exports
 *
 * Factory functions for generating type-safe CRUD API and hooks.
 *
 * @example
 * ```ts
 * import {
 *     createCrudApi,
 *     createCrudHooks,
 *     createQueryKeys,
 * } from '@/shared/api/crud';
 *
 * // Create API
 * const coursesApi = createCrudApi<Course, CreatePayload, UpdatePayload>({
 *     baseUrl: '/api/courses',
 * });
 *
 * // Create keys
 * const courseKeys = createQueryKeys('courses');
 *
 * // Create hooks
 * const courseHooks = createCrudHooks({
 *     entity: 'courses',
 *     api: coursesApi,
 *     keys: courseKeys,
 * });
 * ```
 */

// Types
export type {
    PaginationMeta,
    PaginatedResponse,
    SingleResponse,
    ListResponse,
    EntityId,
    CrudApiConfig,
    CrudApi,
    InvalidationStrategy,
    CrudHooksConfig,
    QueryKeyFactory,
    UpdateVariables,
} from "./crud.types";

// Factories
export { createQueryKeys } from "./createQueryKeys";
export { createCrudApi } from "./createCrudApi";
export { createCrudHooks, type CrudHooks } from "./createCrudHooks";
