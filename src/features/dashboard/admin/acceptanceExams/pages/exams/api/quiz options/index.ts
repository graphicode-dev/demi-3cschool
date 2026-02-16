/**
 * Level Quiz Options Feature - API Module
 *
 * Public exports for the level quiz options API layer.
 * Import from '@/features/levels/quiz-options'.
 *
 * @example
 * ```ts
 * import {
 *     useAcceptanceExamOptionsList,
 *     useAcceptanceExamOption,
 *     useCreateAcceptanceExamOption,
 *     useAcceptanceExamOptionsMetadata,
 *     acceptanceExamOptionKeys,
 * } from '@/features/levels/quiz-options';
 * ```
 */

// Query Keys
export {
    acceptanceExamOptionKeys,
    type AcceptanceExamOptionQueryKey,
} from "./acceptance-exam-options.keys";

// API Functions
export { acceptanceExamOptionsApi } from "./acceptance-exam-options.api";

// Query Hooks
export {
    useAcceptanceExamOptionsMetadata,
    useAcceptanceExamOptionsList,
    useAcceptanceExamOptionsInfinite,
    useAcceptanceExamOption,
    useAcceptanceExamOptionsByQuestion,
} from "./acceptance-exam-options.queries";

// Mutation Hooks
export {
    useCreateAcceptanceExamOption,
    useUpdateAcceptanceExamOption,
    useDeleteAcceptanceExamOption,
} from "./acceptance-exam-options.mutations";
