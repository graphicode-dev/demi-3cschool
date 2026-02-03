export const trainingCentersKeys = {
    all: ["training-centers"] as const,
    lists: () => [...trainingCentersKeys.all, "list"] as const,
    list: () => [...trainingCentersKeys.lists()] as const,
    details: () => [...trainingCentersKeys.all, "detail"] as const,
    detail: (id: string | number) => [...trainingCentersKeys.details(), id] as const,
};

export type TrainingCentersQueryKey =
    | typeof trainingCentersKeys.all
    | ReturnType<typeof trainingCentersKeys.lists>
    | ReturnType<typeof trainingCentersKeys.list>
    | ReturnType<typeof trainingCentersKeys.details>
    | ReturnType<typeof trainingCentersKeys.detail>;
