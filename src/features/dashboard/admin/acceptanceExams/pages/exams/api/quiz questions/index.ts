/**
 * Acceptance Exam Questions Feature - API Module
 */

// Query Keys
export {
    acceptanceExamQuestionKeys,
    type AcceptanceExamQuestionQueryKey,
} from "./acceptance-exam-questions.keys";

// API Functions
export { acceptanceExamQuestionsApi } from "./acceptance-exam-questions.api";

// Query Hooks
export {
    useAcceptanceExamQuestionsMetadata,
    useAcceptanceExamQuestion,
    useAcceptanceExamQuestionsByExam,
} from "./acceptance-exam-questions.queries";

// Mutation Hooks
export {
    useCreateAcceptanceExamQuestion,
    useUpdateAcceptanceExamQuestion,
    useDeleteAcceptanceExamQuestion,
} from "./acceptance-exam-questions.mutations";
