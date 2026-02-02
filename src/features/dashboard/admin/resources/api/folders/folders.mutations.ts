/**
 * Resource Folders Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for folder operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersApi } from "./folders.api";
import { folderKeys } from "./folders.keys";
import { useToast } from "@/design-system/hooks/useToast";
import type { FolderCreatePayload, FolderUpdatePayload } from "../../types";

/**
 * Hook to create a new folder
 */
export function useCreateFolder() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (payload: FolderCreatePayload) =>
            foldersApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: "Folder created successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to create folder",
            });
        },
    });
}

/**
 * Hook to update a folder
 */
export function useUpdateFolder() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: FolderUpdatePayload;
        }) => foldersApi.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            queryClient.invalidateQueries({
                queryKey: folderKeys.detail(variables.id),
            });
            toast.addToast({
                type: "success",
                message: "Folder updated successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to update folder",
            });
        },
    });
}

/**
 * Hook to delete a folder
 */
export function useDeleteFolder() {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (id: string) => foldersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: "Folder deleted successfully",
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || "Failed to delete folder",
            });
        },
    });
}
