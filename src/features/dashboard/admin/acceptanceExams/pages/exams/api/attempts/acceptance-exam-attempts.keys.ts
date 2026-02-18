/**
 * Acceptance Exam Attempts Feature - Query Keys
 */

import type { AcceptanceExamAttemptsListParams } from "../../../../types/acceptance-exam-attempts.types";

export const acceptanceExamAttemptKeys = {
    all: ["acceptance-exam-attempts"] as const,

    myAttempts: () => [...acceptanceExamAttemptKeys.all, "my-attempts"] as const,

    examHistory: (examId: string, params?: AcceptanceExamAttemptsListParams) =>
        params
            ? ([...acceptanceExamAttemptKeys.all, "exam-history", examId, params] as const)
            : ([...acceptanceExamAttemptKeys.all, "exam-history", examId] as const),

    result: (attemptId: string) =>
        [...acceptanceExamAttemptKeys.all, "result", attemptId] as const,
};

export type AcceptanceExamAttemptQueryKey =
    | typeof acceptanceExamAttemptKeys.all
    | ReturnType<typeof acceptanceExamAttemptKeys.myAttempts>
    | ReturnType<typeof acceptanceExamAttemptKeys.examHistory>
    | ReturnType<typeof acceptanceExamAttemptKeys.result>;
