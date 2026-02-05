import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/api";
import { teachersApi } from "./teachers.api";
import { teachersKeys } from "./teachers.keys";
import type { TeacherCreatePayload, TeacherUpdatePayload } from "../types";
import { User } from "@/auth/auth.types";

export function useCreateTeacher() {
    const queryClient = useQueryClient();

    return useMutation<User, ApiError, TeacherCreatePayload>({
        mutationFn: teachersApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teachersKeys.all });
        },
    });
}

export function useUpdateTeacher() {
    const queryClient = useQueryClient();

    return useMutation<
        User,
        ApiError,
        { id: string | number; data: TeacherUpdatePayload }
    >({
        mutationFn: ({ id, data }) => teachersApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: teachersKeys.all });
            queryClient.invalidateQueries({
                queryKey: teachersKeys.detail(String(variables.id)),
            });
        },
    });
}

export function useDeleteTeacher() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string | number>({
        mutationFn: teachersApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: teachersKeys.all });
        },
    });
}
