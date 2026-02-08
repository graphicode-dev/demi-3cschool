/**
 * Lesson Materials Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson material data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // List all lesson materials
 * const { data, isLoading } = useLessonMaterialsList();
 *
 * // Get single lesson material
 * const { data: material } = useLessonMaterial(materialId);
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { lessonMaterialKeys } from "./lesson-materials.keys";
import { lessonMaterialsApi } from "./lesson-materials.api";
import { LessonMaterial, LessonMaterialsListParams } from "../../types";
import { PaginatedData } from "@/shared/api";

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all lesson materials
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonMaterialsList();
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data?.map(material => (
 *             <li key={material.id}>{material.title}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonMaterialsList(
    options?: Partial<UseQueryOptions<LessonMaterial[], Error>>
) {
    return useQuery({
        queryKey: lessonMaterialKeys.lists(),
        queryFn: ({ signal }) => lessonMaterialsApi.getList(signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of lesson materials by lesson ID
 *
 * @param lessonId - Lesson ID to fetch materials for
 * @param params - Query parameters for pagination
 * @param options - Additional query options
 */
export function useLessonMaterialsByLesson(
    lessonId: string | undefined | null,
    params?: LessonMaterialsListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonMaterial>, Error>>
) {
    return useQuery({
        queryKey: [
            ...lessonMaterialKeys.all,
            "byLesson",
            lessonId,
            params,
        ] as const,
        queryFn: ({ signal }) =>
            lessonMaterialsApi.getListByLessonId(lessonId!, params, signal),
        enabled: !!lessonId,
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single lesson material by ID
 *
 * @param id - Lesson Material ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: material, isLoading, error } = useLessonMaterial(materialId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{material.title}</h1>
 *         <a href={material.file.url}>{material.file.fileName}</a>
 *     </div>
 * );
 * ```
 */
export function useLessonMaterial(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonMaterial, Error>>
) {
    return useQuery({
        queryKey: lessonMaterialKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonMaterialsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
