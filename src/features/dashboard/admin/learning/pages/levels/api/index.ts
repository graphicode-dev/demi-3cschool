/**
 * Levels Feature - API Module
 *
 * Public exports for the levels API layer.
 * Import from '@/features/levels/api' or '@/features/levels'.
 *
 * @example
 * ```ts
 * import {
 *     useLevelsList,
 *     useLevelsByCourse,
 *     useLevel,
 *     useCreateLevel,
 *     useLevelsMetadata,
 *     levelKeys,
 * } from '@/features/levels';
 * ```
 */

// Types
export type {
    Level,
    LevelGroup,
    LevelByGrade,
    LevelCourseRef,
    LevelCourse,
    LevelsListParams,
    LevelsByCourseParams,
    LevelCreatePayload,
    LevelUpdatePayload,
    LevelsMetadata,
    LevelFilterDefinition,
    LevelOperators,
    LevelFieldType,
    LevelFieldTypes,
} from "../types/levels.types";

// Query Keys
export { levelKeys, type LevelQueryKey } from "./levels.keys";

// API Functions
export { levelsApi } from "./levels.api";

// Query Hooks
export {
    useLevelsMetadata,
    useLevelsList,
    useLevelsByCourse,
    useLevelsInfinite,
    useLevelsInfiniteByCourse,
    useLevel,
    useLevelsByGrade,
} from "./levels.queries";

// Mutation Hooks
export {
    useCreateLevel,
    useUpdateLevel,
    useDeleteLevel,
} from "./levels.mutations";
