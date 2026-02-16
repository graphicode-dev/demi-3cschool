/**
 * Level Quizzes Feature - API Module
 *
 * Public exports for the level quizzes API layer.
 * Import from '@/features/levels/quizzes'.
 *
 * @example
 * ```ts
 * import {
 *     useAcceptanceExamsList,
 *     useAcceptanceExam,
 *     useCreateAcceptanceExam,
 *     useAcceptanceExamsMetadata,
 *     acceptanceExamKeys,
 * } from '@/features/levels/quizzes';
 * ```
 */

// Types
export type {
    AcceptanceExam,
    AcceptanceExamLevelRef,
    AcceptanceExamsListParams,
    AcceptanceExamCreatePayload,
    AcceptanceExamUpdatePayload,
    AcceptanceExamsMetadata,
    AcceptanceExamFilters,
    AcceptanceExamFilterDefinition,
    AcceptanceExamOperators,
    AcceptanceExamFieldType,
    AcceptanceExamFieldTypes,
} from "../../../../types/acceptance-exams.types";

// Query Keys
export { acceptanceExamKeys, type AcceptanceExamQueryKey } from "./acceptance-exams.keys";

// API Functions
export { acceptanceExamApi } from "./acceptance-exams.api";

// Query Hooks
export {
    useAcceptanceExamsMetadata,
    useAcceptanceExamsByLevel,
    useAcceptanceExam,
} from "./acceptance-exams.queries";

// Mutation Hooks
export {
    useCreateAcceptanceExam,
    useUpdateAcceptanceExam,
    useDeleteAcceptanceExam,
} from "./acceptance-exams.mutations";
