/**
 * Lesson Video Quizzes Feature - API Module
 *
 * Public exports for the lesson video quizzes API layer.
 */

// Types
export type {
    LessonVideoQuiz,
    LessonVideoQuizVideoRef,
    LessonVideoQuizzesListParams,
    LessonVideoQuizCreatePayload,
    LessonVideoQuizUpdatePayload,
    LessonVideoQuizzesMetadata,
    LessonVideoQuizFilters,
    LessonVideoQuizFilterDefinition,
    LessonVideoQuizOperators,
    LessonVideoQuizFieldType,
    LessonVideoQuizFieldTypes,
} from "../../types/lesson-video-quizzes.types";

// Query Keys
export {
    lessonVideoQuizKeys,
    type LessonVideoQuizQueryKey,
} from "./lesson-video-quizzes.keys";

// API Functions
export { lessonVideoQuizzesApi } from "./lesson-video-quizzes.api";

// Query Hooks
export {
    useLessonVideoQuizzesMetadata,
    useLessonVideoQuizzesList,
    useLessonVideoQuiz,
} from "./lesson-video-quizzes.queries";

// Mutation Hooks
export {
    useCreateLessonVideoQuiz,
    useUpdateLessonVideoQuiz,
    useDeleteLessonVideoQuiz,
} from "./lesson-video-quizzes.mutations";
