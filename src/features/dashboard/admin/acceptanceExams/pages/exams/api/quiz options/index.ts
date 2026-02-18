/**
 * Acceptance Exam Options Feature - API Module
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
    useAcceptanceExamOption,
    useAcceptanceExamOptionsByQuestion,
} from "./acceptance-exam-options.queries";

// Mutation Hooks
export {
    useCreateAcceptanceExamOption,
    useUpdateAcceptanceExamOption,
    useDeleteAcceptanceExamOption,
} from "./acceptance-exam-options.mutations";
