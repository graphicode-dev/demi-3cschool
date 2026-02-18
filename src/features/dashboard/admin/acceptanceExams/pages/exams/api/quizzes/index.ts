/**
 * Acceptance Exams Feature - API Module
 *
 * Public exports for the acceptance exams API layer.
 */

// Types
export type {
    AcceptanceExam,
    AcceptanceExamGradeRef,
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
export {
    acceptanceExamKeys,
    type AcceptanceExamQueryKey,
} from "./acceptance-exams.keys";

// API Functions
export { acceptanceExamApi } from "./acceptance-exams.api";

// Query Hooks
export {
    useAcceptanceExamsMetadata,
    useAcceptanceExamsList,
    useAcceptanceExam,
} from "./acceptance-exams.queries";

// Mutation Hooks
export {
    useCreateAcceptanceExam,
    useUpdateAcceptanceExam,
    useDeleteAcceptanceExam,
} from "./acceptance-exams.mutations";
