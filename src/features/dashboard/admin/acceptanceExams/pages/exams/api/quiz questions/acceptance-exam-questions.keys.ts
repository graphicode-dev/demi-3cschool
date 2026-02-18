/**
 * Acceptance Exam Questions Feature - Query Keys
 */

import type { AcceptanceExamQuestionsListParams } from "../../../../types/acceptance-exam-questions.types";

export const acceptanceExamQuestionKeys = {
    all: ["acceptance-exam-questions"] as const,

    metadata: () => [...acceptanceExamQuestionKeys.all, "metadata"] as const,

    lists: () => [...acceptanceExamQuestionKeys.all, "list"] as const,

    byExam: (examId: string, params?: AcceptanceExamQuestionsListParams) =>
        params
            ? ([
                  ...acceptanceExamQuestionKeys.all,
                  "by-exam",
                  examId,
                  params,
              ] as const)
            : ([...acceptanceExamQuestionKeys.all, "by-exam", examId] as const),

    list: (params?: AcceptanceExamQuestionsListParams) =>
        params
            ? ([...acceptanceExamQuestionKeys.lists(), params] as const)
            : acceptanceExamQuestionKeys.lists(),

    details: () => [...acceptanceExamQuestionKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...acceptanceExamQuestionKeys.details(), id] as const,
};

export type AcceptanceExamQuestionQueryKey =
    | typeof acceptanceExamQuestionKeys.all
    | ReturnType<typeof acceptanceExamQuestionKeys.metadata>
    | ReturnType<typeof acceptanceExamQuestionKeys.lists>
    | ReturnType<typeof acceptanceExamQuestionKeys.byExam>
    | ReturnType<typeof acceptanceExamQuestionKeys.list>
    | ReturnType<typeof acceptanceExamQuestionKeys.details>
    | ReturnType<typeof acceptanceExamQuestionKeys.detail>;
