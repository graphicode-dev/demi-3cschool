/**
 * Lesson Video Quiz Questions Feature - API Module
 *
 * Public exports for the lesson video quiz questions API layer.
 */

// Types
export type {
    LessonVideoQuizQuestion,
    LessonVideoQuizQuestionQuizRef,
    LessonVideoQuizQuestionType,
    LessonVideoQuizQuestionsListParams,
    LessonVideoQuizQuestionCreatePayload,
    LessonVideoQuizQuestionUpdatePayload,
    LessonVideoQuizQuestionsMetadata,
    LessonVideoQuizQuestionFilters,
    LessonVideoQuizQuestionFilterDefinition,
    LessonVideoQuizQuestionOperators,
    LessonVideoQuizQuestionFieldType,
    LessonVideoQuizQuestionFieldTypes,
} from "../../types/lesson-video-quiz-questions.types";

// Query Keys
export {
    lessonVideoQuizQuestionKeys,
    type LessonVideoQuizQuestionQueryKey,
} from "./lesson-video-quiz-questions.keys";

// API Functions
export { lessonVideoQuizQuestionsApi } from "./lesson-video-quiz-questions.api";

// Query Hooks
export {
    useLessonVideoQuizQuestionsMetadata,
    useLessonVideoQuizQuestionsList,
    useLessonVideoQuizQuestionsByQuiz,
    useLessonVideoQuizQuestion,
} from "./lesson-video-quiz-questions.queries";

// Mutation Hooks
export {
    useCreateLessonVideoQuizQuestion,
    useUpdateLessonVideoQuizQuestion,
    useDeleteLessonVideoQuizQuestion,
} from "./lesson-video-quiz-questions.mutations";
