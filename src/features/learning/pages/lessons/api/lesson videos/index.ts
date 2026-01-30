/**
 * Lesson Videos Feature - API Module
 *
 * Public exports for the lesson videos API layer.
 * Import from '@/features/lessons/lesson-videos/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonVideosList,
 *     useLessonVideo,
 *     useCreateLessonVideo,
 *     lessonVideoKeys,
 * } from '@/features/lessons/lesson-videos/api';
 * ```
 */

// Query Keys
export {
    lessonVideoKeys,
    type LessonVideoQueryKey,
} from "./lesson-videos.keys";

// API Functions
export { lessonVideosApi } from "./lesson-videos.api";

// Query Hooks
export { useLessonVideosList, useLessonVideo } from "./lesson-videos.queries";

// Mutation Hooks
export {
    useCreateLessonVideo,
    useUpdateLessonVideo,
    useDeleteLessonVideo,
} from "./lesson-videos.mutations";
