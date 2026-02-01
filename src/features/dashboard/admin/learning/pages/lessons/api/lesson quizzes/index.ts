/**
 * Lesson Quizzes Feature - API Module
 *
 * Public exports for the lesson quizzes API layer.
 * Import from '@/features/lessons/lesson-quizzes/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonQuizzesList,
 *     useLessonQuiz,
 *     useCreateLessonQuiz,
 *     useLessonQuizzesMetadata,
 *     lessonQuizKeys,
 * } from '@/features/lessons/lesson-quizzes/api';
 * ```
 */

// Query Keys
export { lessonQuizKeys, type LessonQuizQueryKey } from "./lesson-quizzes.keys";

// API Functions
export { lessonQuizzesApi } from "./lesson-quizzes.api";

// Query Hooks
export {
    useLessonQuizzesMetadata,
    useLessonQuizzesList,
    useLessonQuizzesByLevel,
    useLessonQuizzesInfinite,
    useLessonQuiz,
} from "./lesson-quizzes.queries";

// Mutation Hooks
export {
    useCreateLessonQuiz,
    useUpdateLessonQuiz,
    useDeleteLessonQuiz,
} from "./lesson-quizzes.mutations";
