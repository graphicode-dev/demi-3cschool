import { useQuery } from "@tanstack/react-query";
import { eligibleStudentsApi } from "./eligibleStudents.api";
import { eligibleStudentsKeys } from "./eligibleStudents.keys";
import type { EligibleStudentsListParams } from "../types";

export const useEligibleStudentsList = (
    params?: EligibleStudentsListParams
) => {
    return useQuery({
        queryKey: eligibleStudentsKeys.list(params),
        queryFn: () => eligibleStudentsApi.getEligibleStudents(params),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};
