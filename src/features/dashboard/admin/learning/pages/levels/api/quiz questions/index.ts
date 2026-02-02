/**
 * Level Quiz Questions Feature - API Module
 *
 * Public exports for the level quiz questions API layer.
 * Import from '@/features/levels/quiz-questions'.
 *
 * @example
 * ```ts
 * import {
 *     useLevelQuizQuestionsList,
 *     useLevelQuizQuestion,
 *     useCreateLevelQuizQuestion,
 *     useLevelQuizQuestionsMetadata,
 *     levelQuizQuestionKeys,
 * } from '@/features/levels/quiz-questions';
 * ```
 */

// Query Keys
export {
    levelQuizQuestionKeys,
    type LevelQuizQuestionQueryKey,
} from "./level-quiz-questions.keys";

// API Functions
export { levelQuizQuestionsApi } from "./level-quiz-questions.api";

// Query Hooks
export {
    useLevelQuizQuestionsMetadata,
    useLevelQuizQuestionsList,
    useLevelQuizQuestionsInfinite,
    useLevelQuizQuestion,
    useLevelQuizQuestionsByQuiz,
} from "./level-quiz-questions.queries";

// Mutation Hooks
export {
    useCreateLevelQuizQuestion,
    useUpdateLevelQuizQuestion,
    useDeleteLevelQuizQuestion,
} from "./level-quiz-questions.mutations";
