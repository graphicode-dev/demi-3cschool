import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type {
    TrainingCenter,
    TrainingCenterCreatePayload,
    TrainingCenterUpdatePayload,
} from "../types";

const BASE_URL = "/training-centers";

export const trainingCentersApi = {
    list: async (signal?: AbortSignal): Promise<TrainingCenter[]> => {
        const response = await api.get<ApiResponse<TrainingCenter[]>>(BASE_URL, {
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<TrainingCenter> => {
        const response = await api.get<ApiResponse<TrainingCenter>>(
            `${BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    create: async (payload: TrainingCenterCreatePayload): Promise<TrainingCenter> => {
        const response = await api.post<ApiResponse<TrainingCenter>>(
            BASE_URL,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    update: async (
        id: string | number,
        payload: TrainingCenterUpdatePayload
    ): Promise<TrainingCenter> => {
        const response = await api.put<ApiResponse<TrainingCenter>>(
            `${BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};
