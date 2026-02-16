/**
 * Level Quiz Questions Feature - API Module
 *
 * Public exports for the level quiz questions API layer.
 * Import from '@/features/levels/quiz-questions'.
 *
 * @example
 * ```ts
 * import {
 *     useAcceptanceExamQuestionsList,
 *     useAcceptanceExamQuestion,
 *     useCreateAcceptanceExamQuestion,
 *     useAcceptanceExamQuestionsMetadata,
 *     acceptanceExamQuestionKeys,
 * } from '@/features/levels/quiz-questions';
 * ```
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
    useAcceptanceExamQuestionsList,
    useAcceptanceExamQuestionsInfinite,
    useAcceptanceExamQuestion,
    useAcceptanceExamQuestionsByQuiz,
} from "./acceptance-exam-questions.queries";

// Mutation Hooks
export {
    useCreateAcceptanceExamQuestion,
    useUpdateAcceptanceExamQuestion,
    useDeleteAcceptanceExamQuestion,
} from "./acceptance-exam-questions.mutations";
