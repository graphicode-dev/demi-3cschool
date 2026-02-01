/**
 * Level Quizzes Feature - API Module
 *
 * Public exports for the level quizzes API layer.
 * Import from '@/features/levels/quizzes'.
 *
 * @example
 * ```ts
 * import {
 *     useLevelQuizzesList,
 *     useLevelQuiz,
 *     useCreateLevelQuiz,
 *     useLevelQuizzesMetadata,
 *     levelQuizKeys,
 * } from '@/features/levels/quizzes';
 * ```
 */

// Types
export type {
    LevelQuiz,
    LevelQuizLevelRef,
    LevelQuizzesListParams,
    LevelQuizCreatePayload,
    LevelQuizUpdatePayload,
    LevelQuizzesMetadata,
    LevelQuizFilters,
    LevelQuizFilterDefinition,
    LevelQuizOperators,
    LevelQuizFieldType,
    LevelQuizFieldTypes,
} from "../../types/level-quizzes.types";

// Query Keys
export { levelQuizKeys, type LevelQuizQueryKey } from "./level-quizzes.keys";

// API Functions
export { levelQuizzesApi } from "./level-quizzes.api";

// Query Hooks
export {
    useLevelQuizzesMetadata,
    useLevelQuizzesByLevel,
    useLevelQuiz,
} from "./level-quizzes.queries";

// Mutation Hooks
export {
    useCreateLevelQuiz,
    useUpdateLevelQuiz,
    useDeleteLevelQuiz,
} from "./level-quizzes.mutations";
