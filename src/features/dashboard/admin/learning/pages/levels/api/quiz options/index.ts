/**
 * Level Quiz Options Feature - API Module
 *
 * Public exports for the level quiz options API layer.
 * Import from '@/features/levels/quiz-options'.
 *
 * @example
 * ```ts
 * import {
 *     useLevelQuizOptionsList,
 *     useLevelQuizOption,
 *     useCreateLevelQuizOption,
 *     useLevelQuizOptionsMetadata,
 *     levelQuizOptionKeys,
 * } from '@/features/levels/quiz-options';
 * ```
 */

// Query Keys
export {
    levelQuizOptionKeys,
    type LevelQuizOptionQueryKey,
} from "./level-quiz-options.keys";

// API Functions
export { levelQuizOptionsApi } from "./level-quiz-options.api";

// Query Hooks
export {
    useLevelQuizOptionsMetadata,
    useLevelQuizOptionsList,
    useLevelQuizOptionsInfinite,
    useLevelQuizOption,
    useLevelQuizOptionsByQuestion,
} from "./level-quiz-options.queries";

// Mutation Hooks
export {
    useCreateLevelQuizOption,
    useUpdateLevelQuizOption,
    useDeleteLevelQuizOption,
} from "./level-quiz-options.mutations";
