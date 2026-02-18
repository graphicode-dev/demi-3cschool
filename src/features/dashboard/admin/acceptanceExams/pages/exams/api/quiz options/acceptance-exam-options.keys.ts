/**
 * Acceptance Exam Options Feature - Query Keys
 */

import type { AcceptanceExamOptionsListParams } from "../../../../types/acceptance-exam-options.types";

export const acceptanceExamOptionKeys = {
    all: ["acceptance-exam-options"] as const,

    metadata: () => [...acceptanceExamOptionKeys.all, "metadata"] as const,

    lists: () => [...acceptanceExamOptionKeys.all, "list"] as const,

    byQuestion: (
        questionId: string,
        params?: AcceptanceExamOptionsListParams
    ) =>
        params
            ? ([
                  ...acceptanceExamOptionKeys.all,
                  "by-question",
                  questionId,
                  params,
              ] as const)
            : ([
                  ...acceptanceExamOptionKeys.all,
                  "by-question",
                  questionId,
              ] as const),

    list: (params?: AcceptanceExamOptionsListParams) =>
        params
            ? ([...acceptanceExamOptionKeys.lists(), params] as const)
            : acceptanceExamOptionKeys.lists(),

    details: () => [...acceptanceExamOptionKeys.all, "detail"] as const,

    detail: (id: string) =>
        [...acceptanceExamOptionKeys.details(), id] as const,
};

export type AcceptanceExamOptionQueryKey =
    | typeof acceptanceExamOptionKeys.all
    | ReturnType<typeof acceptanceExamOptionKeys.metadata>
    | ReturnType<typeof acceptanceExamOptionKeys.lists>
    | ReturnType<typeof acceptanceExamOptionKeys.byQuestion>
    | ReturnType<typeof acceptanceExamOptionKeys.list>
    | ReturnType<typeof acceptanceExamOptionKeys.details>
    | ReturnType<typeof acceptanceExamOptionKeys.detail>;
