/**
 * Resources Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for resource operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "./resources.api";
import { resourceKeys } from "./resources.keys";
import { folderKeys } from "../folders/folders.keys";
import { useToast } from "@/design-system/hooks/useToast";
import type {
    ResourceCreatePayload,
    ResourceUpdatePayload,
    MoveResourcePayload,
} from "../../types";

/**
 * Hook to create a new resource
 */
export function useCreateResource() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (payload: ResourceCreatePayload) =>
            resourcesApi.create(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: resourceKeys.all });
            queryClient.invalidateQueries({
                queryKey: resourceKeys.byFolder(variables.folderId),
            });
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: "Resource created successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to create resource",
            });
        },
    });
}

/**
 * Hook to update a resource
 */
export function useUpdateResource() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: ResourceUpdatePayload;
        }) => resourcesApi.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: resourceKeys.all });
            queryClient.invalidateQueries({
                queryKey: resourceKeys.detail(variables.id),
            });
            toast.addToast({
                type: "success",
                message: "Resource updated successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to update resource",
            });
        },
    });
}

/**
 * Hook to delete a resource
 */
export function useDeleteResource() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (id: string) => resourcesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resourceKeys.all });
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: "Resource deleted successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to delete resource",
            });
        },
    });
}

/**
 * Hook to move a resource to another folder
 */
export function useMoveResource() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (payload: MoveResourcePayload) =>
            resourcesApi.move(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: resourceKeys.all });
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: "Resource moved successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to move resource",
            });
        },
    });
}
