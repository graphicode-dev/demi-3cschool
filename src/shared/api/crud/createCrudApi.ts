/**
 * CRUD Factory - API Factory
 *
 * Creates type-safe CRUD API functions for an entity.
 * Supports configurable ID field, FormData, and response transformation.
 *
 * @example
 * ```ts
 * const coursesApi = createCrudApi<
 *     Course,
 *     CourseCreatePayload,
 *     CourseUpdatePayload,
 *     CoursesListParams
 * >({
 *     baseUrl: '/api/courses',
 *     idField: 'id',
 *     useFormData: true,
 * });
 *
 * // Use the API
 * const courses = await coursesApi.getList({ page: 1 });
 * const course = await coursesApi.getById(1);
 * const newCourse = await coursesApi.create(payload);
 * ```
 */

import { api } from "@/shared/api/client";
import { toFormData, type FormDataValue } from "@/utils";
import type {
    CrudApi,
    CrudApiConfig,
    EntityId,
    PaginatedResponse,
} from "./crud.types";

/**
 * Create CRUD API functions for an entity
 *
 * @param config - API configuration
 * @returns CRUD API object with getList, getById, create, update, delete
 */
export function createCrudApi<
    TEntity,
    TCreatePayload,
    TUpdatePayload,
    TListParams = Record<string, unknown>,
>(
    config: CrudApiConfig<TEntity, TCreatePayload, TUpdatePayload, TListParams>
): CrudApi<TEntity, TCreatePayload, TUpdatePayload, TListParams> {
    const {
        baseUrl,
        useFormData = false,
        transformRequest,
        transformResponse,
        transformListResponse,
    } = config;

    /**
     * Transform entity response
     */
    const transformEntity = (data: unknown): TEntity => {
        if (transformResponse) {
            return transformResponse(data);
        }
        // Handle wrapped response { data: TEntity }
        if (typeof data === "object" && data !== null && "data" in data) {
            return (data as { data: TEntity }).data;
        }
        return data as TEntity;
    };

    /**
     * Transform list response
     */
    const transformList = (data: unknown): PaginatedResponse<TEntity> => {
        if (transformListResponse) {
            const result = transformListResponse(data);
            if (Array.isArray(result)) {
                return {
                    items: result,
                    meta: {
                        currentPage: 1,
                        lastPage: 1,
                        perPage: result.length,
                        total: result.length,
                    },
                };
            }
            return result;
        }
        return data as PaginatedResponse<TEntity>;
    };

    /**
     * Prepare request body
     */
    const prepareBody = (
        payload: TCreatePayload | TUpdatePayload,
        method?: "PUT" | "PATCH"
    ): FormData | Record<string, unknown> => {
        const data = transformRequest ? transformRequest(payload) : payload;

        if (useFormData) {
            const formPayload = method ? { ...data, _method: method } : data;
            return toFormData(formPayload as Record<string, FormDataValue>);
        }

        return data as Record<string, unknown>;
    };

    return {
        /**
         * Get paginated list of entities
         */
        getList: async (
            params?: TListParams,
            signal?: AbortSignal
        ): Promise<PaginatedResponse<TEntity>> => {
            const response = await api.get<unknown>(baseUrl, {
                params: params as Record<string, unknown> | undefined,
                signal,
            });

            if (response.error) {
                throw response.error;
            }

            return transformList(response.data);
        },

        /**
         * Get single entity by ID
         */
        getById: async (
            id: EntityId,
            signal?: AbortSignal
        ): Promise<TEntity> => {
            const response = await api.get<unknown>(`${baseUrl}/${id}`, {
                signal,
            });

            if (response.error) {
                throw response.error;
            }

            return transformEntity(response.data);
        },

        /**
         * Create a new entity
         */
        create: async (payload: TCreatePayload): Promise<TEntity> => {
            const body = prepareBody(payload);

            const response = await api.post<unknown>(baseUrl, body, {
                meta: useFormData ? { multipart: true } : undefined,
            });

            if (response.error) {
                throw response.error;
            }

            return transformEntity(response.data);
        },

        /**
         * Update an existing entity
         */
        update: async (
            id: EntityId,
            payload: TUpdatePayload
        ): Promise<TEntity> => {
            // Use POST with _method for FormData (Laravel convention)
            if (useFormData) {
                const body = prepareBody(payload, "PUT");

                const response = await api.post<unknown>(
                    `${baseUrl}/${id}`,
                    body,
                    { meta: { multipart: true } }
                );

                if (response.error) {
                    throw response.error;
                }

                return transformEntity(response.data);
            }

            // Use PUT for JSON
            const body = transformRequest
                ? transformRequest(payload)
                : (payload as Record<string, unknown>);

            const response = await api.put<unknown>(`${baseUrl}/${id}`, body);

            if (response.error) {
                throw response.error;
            }

            return transformEntity(response.data);
        },

        /**
         * Delete an entity
         */
        delete: async (id: EntityId): Promise<void> => {
            const response = await api.delete(`${baseUrl}/${id}`);

            if (response.error) {
                throw response.error;
            }
        },
    };
}

export default createCrudApi;
