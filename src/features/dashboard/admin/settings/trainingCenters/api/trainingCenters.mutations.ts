import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/api";
import { trainingCentersApi } from "./trainingCenters.api";
import { trainingCentersKeys } from "./trainingCenters.keys";
import type {
    TrainingCenter,
    TrainingCenterCreatePayload,
    TrainingCenterUpdatePayload,
} from "../types";

export function useCreateTrainingCenter() {
    const queryClient = useQueryClient();

    return useMutation<TrainingCenter, ApiError, TrainingCenterCreatePayload>({
        mutationFn: trainingCentersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trainingCentersKeys.all });
        },
    });
}

export function useUpdateTrainingCenter() {
    const queryClient = useQueryClient();

    return useMutation<
        TrainingCenter,
        ApiError,
        { id: string | number; data: TrainingCenterUpdatePayload }
    >({
        mutationFn: ({ id, data }) => trainingCentersApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: trainingCentersKeys.all });
            queryClient.invalidateQueries({
                queryKey: trainingCentersKeys.detail(String(variables.id)),
            });
        },
    });
}

export function useDeleteTrainingCenter() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string | number>({
        mutationFn: trainingCentersApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trainingCentersKeys.all });
        },
    });
}
