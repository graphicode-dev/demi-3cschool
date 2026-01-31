/**
 * Lesson Quiz Questions Feature - API Module
 *
 * Public exports for the lesson quiz questions API layer.
 * Import from '@/features/lessons/lesson-quiz-questions/api'.
 *
 * @example
 * ```ts
 * import {
 *     useLessonQuizQuestionsList,
 *     useLessonQuizQuestion,
 *     useCreateLessonQuizQuestion,
 *     useLessonQuizQuestionsMetadata,
 *     lessonQuizQuestionKeys,
 * } from '@/features/lessons/lesson-quiz-questions/api';
 * ```
 */

// Query Keys
export {
    lessonQuizQuestionKeys,
    type LessonQuizQuestionQueryKey,
} from "./lesson-quiz-questions.keys";

// API Functions
export { lessonQuizQuestionsApi } from "./lesson-quiz-questions.api";

// Query Hooks
export {
    useLessonQuizQuestionsMetadata,
    useLessonQuizQuestionsList,
    useLessonQuizQuestionsInfinite,
    useLessonQuizQuestion,
} from "./lesson-quiz-questions.queries";

// Mutation Hooks
export {
    useCreateLessonQuizQuestion,
    useUpdateLessonQuizQuestion,
    useDeleteLessonQuizQuestion,
} from "./lesson-quiz-questions.mutations";
