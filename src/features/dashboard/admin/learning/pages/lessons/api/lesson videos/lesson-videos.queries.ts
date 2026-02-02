/**
 * Lesson Videos Feature - Query Hooks
 *
 * TanStack Query hooks for reading lesson video data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * // List all lesson videos
 * const { data, isLoading } = useLessonVideosList();
 *
 * // Get single lesson video
 * const { data: video } = useLessonVideo(videoId);
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { lessonVideoKeys } from "./lesson-videos.keys";
import { lessonVideosApi } from "./lesson-videos.api";
import { LessonVideo } from "../../types";

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all lesson videos
 *
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useLessonVideosList();
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <ul>
 *         {data?.map(video => (
 *             <li key={video.id}>{video.title}</li>
 *         ))}
 *     </ul>
 * );
 * ```
 */
export function useLessonVideosList(
    options?: Partial<UseQueryOptions<LessonVideo[], Error>>
) {
    return useQuery({
        queryKey: lessonVideoKeys.lists(),
        queryFn: ({ signal }) => lessonVideosApi.getList(signal),
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single lesson video by ID
 *
 * @param id - Lesson Video ID
 * @param options - Additional query options
 *
 * @example
 * ```tsx
 * const { data: video, isLoading, error } = useLessonVideo(videoId);
 *
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return (
 *     <div>
 *         <h1>{video.title}</h1>
 *         <p>{video.description}</p>
 *         <p>Duration: {video.duration} minutes</p>
 *     </div>
 * );
 * ```
 */
export function useLessonVideo(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonVideo, Error>>
) {
    return useQuery({
        queryKey: lessonVideoKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonVideosApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}

// ============================================================================
// Level-based Queries
// ============================================================================

/**
 * Hook to fetch lesson videos by level ID
 *
 * @param levelId - Level ID to fetch videos for
 * @param options - Additional query options
 */
export function useLessonVideosByLevel(
    levelId: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonVideo[], Error>>
) {
    return useQuery({
        queryKey: lessonVideoKeys.byLevel(levelId ?? ""),
        queryFn: ({ signal }) => lessonVideosApi.getByLevelId(levelId!, signal),
        enabled: !!levelId,
        ...options,
    });
}
