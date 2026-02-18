/**
 * Acceptance Exam Attempts Feature - API Module
 */

// Query Keys
export {
    acceptanceExamAttemptKeys,
    type AcceptanceExamAttemptQueryKey,
} from "./acceptance-exam-attempts.keys";

// API Functions
export { acceptanceExamAttemptsApi } from "./acceptance-exam-attempts.api";

// Query Hooks
export {
    useMyAcceptanceExamAttempts,
    useAcceptanceExamAttemptHistory,
    useAcceptanceExamAttemptResult,
} from "./acceptance-exam-attempts.queries";

// Mutation Hooks
export {
    useStartAcceptanceExamAttempt,
    useAnswerAcceptanceExamQuestion,
    useCompleteAcceptanceExamAttempt,
} from "./acceptance-exam-attempts.mutations";
