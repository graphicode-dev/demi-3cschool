/**
 * Resource Folders Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for folder operations.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foldersApi } from "./folders.api";
import { folderKeys } from "./folders.keys";
import { useToast } from "@/design-system";
import type { FolderCreatePayload, FolderUpdatePayload } from "../../types";
import { useTranslation } from "react-i18next";

/**
 * Hook to create a new folder
 */
export function useCreateFolder() {
    const queryClient = useQueryClient();
    const toast = useToast();
    const { t } = useTranslation("adminResources");

    return useMutation({
        mutationFn: (payload: FolderCreatePayload) =>
            foldersApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: t("toasts.folderCreated"),
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || t("toasts.folderCreateFailed"),
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
    const { t } = useTranslation("adminResources");

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string | number;
            payload: FolderUpdatePayload;
        }) => foldersApi.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            queryClient.invalidateQueries({
                queryKey: folderKeys.detail(variables.id),
            });
            toast.addToast({
                type: "success",
                message: t("toasts.folderUpdated"),
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || t("toasts.folderUpdateFailed"),
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
    const { t } = useTranslation("adminResources");

    return useMutation({
        mutationFn: (id: string | number) => foldersApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: folderKeys.all });
            toast.addToast({
                type: "success",
                message: t("toasts.folderDeleted"),
            });
        },
        onError: (error: Error) => {
            toast.addToast({
                type: "error",
                message: error.message || t("toasts.folderDeleteFailed"),
            });
        },
    });
}
