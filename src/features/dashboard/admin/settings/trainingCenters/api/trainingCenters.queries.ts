import {
    useQuery,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { trainingCentersKeys } from "./trainingCenters.keys";
import { trainingCentersApi } from "./trainingCenters.api";
import type { TrainingCenter } from "../types";

export function useTrainingCentersList(
    options?: Partial<UseQueryOptions<TrainingCenter[], Error>>
) {
    return useQuery({
        queryKey: trainingCentersKeys.list(),
        queryFn: ({ signal }) => trainingCentersApi.list(signal),
        ...options,
    });
}

export function useTrainingCenter(
    id: string | number | null | undefined,
    options?: Partial<UseQueryOptions<TrainingCenter, Error>>
) {
    return useQuery({
        queryKey: trainingCentersKeys.detail(String(id ?? "")),
        queryFn: ({ signal }) => trainingCentersApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
