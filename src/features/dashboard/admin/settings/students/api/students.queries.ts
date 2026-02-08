import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { studentsKeys } from "./students.keys";
import { studentsApi } from "./students.api";
import type { ListQueryParams, PaginatedData } from "@/shared/api";
import { User } from "@/auth/auth.types";

export function useStudentsList(
    params?: ListQueryParams,
    options?: Partial<UseQueryOptions<PaginatedData<User>, Error>>
) {
    return useQuery({
        queryKey: studentsKeys.list(params),
        queryFn: ({ signal }) => studentsApi.list(params, signal),
        ...options,
    });
}

export function useStudent(
    id: string | number | null | undefined,
    options?: Partial<UseQueryOptions<User, Error>>
) {
    return useQuery({
        queryKey: studentsKeys.detail(String(id ?? "")),
        queryFn: ({ signal }) => studentsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
