export const assignmentSubmissionsKeys = {
    all: ["assignmentSubmissions"] as const,

    // Assignment groups (optionally by lesson)
    groups: (lessonId?: number | string) =>
        lessonId
            ? ([...assignmentSubmissionsKeys.all, "groups", lessonId] as const)
            : ([...assignmentSubmissionsKeys.all, "groups"] as const),

    // Single submission
    submission: (assignmentId: number | string) =>
        [...assignmentSubmissionsKeys.all, "submission", assignmentId] as const,
};
