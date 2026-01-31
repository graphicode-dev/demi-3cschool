/**
 * Lessons Feature - API Module
 *
 * Public exports for the lessons API layer.
 * Import from '@/features/lessons/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonsList,
 *     useLessonsByLevel,
 *     useLesson,
 *     useCreateLesson,
 *     useLessonsMetadata,
 *     lessonKeys,
 * } from '@/features/lessons/api';
 * ```
 */

// Query Keys
export { lessonKeys, type LessonQueryKey } from "./lessons.keys";

// API Functions
export { lessonsApi } from "./lessons.api";

// Query Hooks
export {
    useLessonsMetadata,
    useLessonsList,
    useLessonsByLevel,
    useLessonsInfinite,
    useLessonsInfiniteByLevel,
    useLesson,
} from "./lessons.queries";

// Mutation Hooks
export {
    useCreateLesson,
    useUpdateLesson,
    useDeleteLesson,
} from "./lessons.mutations";

export * from "./lesson assignments";
export * from "./lesson materials";
export * from "./lesson quiz options";
export * from "./lesson quiz questions";
export * from "./lesson quizzes";
export * from "./lesson videos";
