export const eligibleStudentsKeys = {
    all: ["eligible-students"] as const,
    lists: () => [...eligibleStudentsKeys.all, "list"] as const,
    list: (params?: { page?: number; search?: string }) =>
        [...eligibleStudentsKeys.lists(), params] as const,
};
