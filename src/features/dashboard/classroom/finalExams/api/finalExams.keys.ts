/**
 * Final Exams Query Keys
 * Centralized query key factory for TanStack Query
 */
export const finalExamsKeys = {
    all: ["final-exams"] as const,
    lists: () => [...finalExamsKeys.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
        [...finalExamsKeys.lists(), filters] as const,
    details: () => [...finalExamsKeys.all, "detail"] as const,
    detail: (id: string) => [...finalExamsKeys.details(), id] as const,
    attempts: () => [...finalExamsKeys.all, "attempts"] as const,
    attempt: (attemptId: string) =>
        [...finalExamsKeys.attempts(), attemptId] as const,
    result: (attemptId: string) =>
        [...finalExamsKeys.all, "result", attemptId] as const,
    myAttempts: (examId: string) =>
        [...finalExamsKeys.all, "my-attempts", examId] as const,
};
