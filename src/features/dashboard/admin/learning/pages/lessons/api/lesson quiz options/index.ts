/**
 * Lesson Quiz Options Feature - API Module
 *
 * Public exports for the lesson quiz options API layer.
 * Import from '@/features/lessons/lesson-quiz-options/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonQuizOptionsList,
 *     useLessonQuizOption,
 *     useCreateLessonQuizOption,
 *     useLessonQuizOptionsMetadata,
 *     lessonQuizOptionKeys,
 * } from '@/features/lessons/lesson-quiz-options/api';
 * ```
 */

// Query Keys
export {
    lessonQuizOptionKeys,
    type LessonQuizOptionQueryKey,
} from "./lesson-quiz-options.keys";

// API Functions
export { lessonQuizOptionsApi } from "./lesson-quiz-options.api";

// Query Hooks
export {
    useLessonQuizOptionsMetadata,
    useLessonQuizOptionsList,
    useLessonQuizOptionsByQuestion,
    useLessonQuizOptionsInfinite,
    useLessonQuizOption,
} from "./lesson-quiz-options.queries";

// Mutation Hooks
export {
    useCreateLessonQuizOption,
    useUpdateLessonQuizOption,
    useDeleteLessonQuizOption,
} from "./lesson-quiz-options.mutations";
