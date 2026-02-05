import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { teachersKeys } from "./teachers.keys";
import { teachersApi } from "./teachers.api";
import type { PaginatedData } from "@/shared/api";
import type { TeachersListParams } from "../types";
import { User } from "@/auth/auth.types";

export function useTeachersList(
    params?: TeachersListParams,
    options?: Partial<UseQueryOptions<PaginatedData<User>, Error>>
) {
    return useQuery({
        queryKey: teachersKeys.list(params),
        queryFn: ({ signal }) => teachersApi.list(params, signal),
        ...options,
    });
}

export function useTeacher(
    id: string | number | null | undefined,
    options?: Partial<UseQueryOptions<User, Error>>
) {
    return useQuery({
        queryKey: teachersKeys.detail(String(id ?? "")),
        queryFn: ({ signal }) => teachersApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
