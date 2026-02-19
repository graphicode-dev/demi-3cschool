import { useMutation, useQueryClient } from "@tanstack/react-query";
import { squadsApi } from "./squads.api";
import { squadKeys } from "./squads.keys";
import type {
    CreateSquadPayload,
    UpdateSquadPayload,
    AssignSquadMembersPayload,
    AssignGroupToSquadPayload,
} from "../types";

export const useCreateSquad = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateSquadPayload) => squadsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};

export const useUpdateSquad = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: number;
            payload: UpdateSquadPayload;
        }) => squadsApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};

export const useDeleteSquad = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => squadsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};

export const useAssignSquadMembers = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            squadId,
            payload,
        }: {
            squadId: number;
            payload: AssignSquadMembersPayload;
        }) => squadsApi.assignMembers(squadId, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: squadKeys.members(variables.squadId),
            });
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};

export const useRemoveSquadMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            squadId,
            userId,
        }: {
            squadId: number;
            userId: number;
        }) => squadsApi.removeMember(squadId, userId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: squadKeys.members(variables.squadId),
            });
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};

export const useAssignGroupToSquad = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            payload,
        }: {
            groupId: number;
            payload: AssignGroupToSquadPayload;
        }) => squadsApi.assignGroupToSquad(groupId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};

export const useRemoveGroupFromSquad = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            groupId,
            squadId,
        }: {
            groupId: number;
            squadId: number;
        }) => squadsApi.removeGroupFromSquad(groupId, squadId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: squadKeys.all });
        },
    });
};
