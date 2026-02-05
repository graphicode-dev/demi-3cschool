import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/api";
import { studentsApi } from "./students.api";
import { studentsKeys } from "./students.keys";
import type { StudentCreatePayload, StudentUpdatePayload } from "../types";
import { User } from "@/auth/auth.types";

export function useCreateStudent() {
    const queryClient = useQueryClient();

    return useMutation<User, ApiError, StudentCreatePayload>({
        mutationFn: studentsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentsKeys.all });
        },
    });
}

export function useUpdateStudent() {
    const queryClient = useQueryClient();

    return useMutation<
        User,
        ApiError,
        { id: string | number; data: StudentUpdatePayload }
    >({
        mutationFn: ({ id, data }) => studentsApi.update(Number(id), data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: studentsKeys.all });
            queryClient.invalidateQueries({
                queryKey: studentsKeys.detail(String(variables.id)),
            });
        },
    });
}

export function useDeleteStudent() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string | number>({
        mutationFn: studentsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentsKeys.all });
        },
    });
}
