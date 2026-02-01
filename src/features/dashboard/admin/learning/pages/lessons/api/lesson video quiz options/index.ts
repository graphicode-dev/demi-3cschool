/**
 * Lesson Video Quiz Options Feature - API Module
 *
 * Public exports for the lesson video quiz options API layer.
 */

// Types
export type {
    LessonVideoQuizOption,
    LessonVideoQuizOptionQuestionRef,
    LessonVideoQuizOptionsListParams,
    LessonVideoQuizOptionCreatePayload,
    LessonVideoQuizOptionUpdatePayload,
    LessonVideoQuizOptionsMetadata,
    LessonVideoQuizOptionFilters,
    LessonVideoQuizOptionFilterDefinition,
    LessonVideoQuizOptionOperators,
    LessonVideoQuizOptionFieldType,
    LessonVideoQuizOptionFieldTypes,
} from "../../types/lesson-video-quiz-options.types";

// Query Keys
export {
    lessonVideoQuizOptionKeys,
    type LessonVideoQuizOptionQueryKey,
} from "./lesson-video-quiz-options.keys";

// API Functions
export { lessonVideoQuizOptionsApi } from "./lesson-video-quiz-options.api";

// Query Hooks
export {
    useLessonVideoQuizOptionsMetadata,
    useLessonVideoQuizOptionsList,
    useLessonVideoQuizOption,
} from "./lesson-video-quiz-options.queries";

// Mutation Hooks
export {
    useCreateLessonVideoQuizOption,
    useUpdateLessonVideoQuizOption,
    useDeleteLessonVideoQuizOption,
} from "./lesson-video-quiz-options.mutations";
