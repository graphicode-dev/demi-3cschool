import { useMutation, useQueryClient } from "@tanstack/react-query";
import { groupsApi } from "./groups.api";
import { groupKeys } from "./groups.keys";
import type { AssignBlocksPayload } from "../types";

export const useAssignBlocks = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            payload,
        }: {
            groupId: number;
            payload: AssignBlocksPayload;
        }) => groupsApi.assignBlocks(groupId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.all });
        },
    });
};

export const useReassignInstructor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            instructorId,
        }: {
            groupId: number;
            instructorId: number;
        }) => groupsApi.reassignInstructor(groupId, instructorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupKeys.all });
        },
    });
};
