/**
 * FolderCard Component
 *
 * Displays a resource folder card with name, resource count, and actions menu.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MoreVertical, Pencil, Trash2, FileText, File } from "lucide-react";
import type { ResourceFolder } from "../types";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import ActionsDropdown, {
    DropdownAction,
} from "@/design-system/components/ActionsDropdown";
import { useDeleteFolder } from "../api";

interface FolderCardProps {
    folder: ResourceFolder;
    index: number;
}

export function FolderCard({ folder, index }: FolderCardProps) {
    const { t } = useTranslation("adminResources");
    const navigate = useNavigate();
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    const deleteFolder = useDeleteFolder();

    const handleCardClick = () => {
        navigate(`/admin/resources/folder/${folder.id}`);
    };

    const confirmDelete = async () => {
        if (deleteTargetId == null) return;
        await deleteFolder.mutateAsync(deleteTargetId);
        setDeleteTargetId(null);
    };

    // Check if folder has resources for styling
    const hasResources = folder.resourcesCount > 0;

    const folderActions: DropdownAction[] = [
        {
            id: "edit",
            label: t("folder.edit"),
            icon: <Pencil className="size-4" />,
            onClick: (itemId) => {
                navigate(`/admin/resources/folder/${itemId}/edit`);
            },
        },
        {
            id: "delete",
            label: t("folder.delete"),
            icon: <Trash2 className="size-4" />,
            onClick: (itemId) => {
                setDeleteTargetId(Number(itemId));
            },
            className:
                "text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20",
        },
    ];

    return (
        <>
            <div
                onClick={handleCardClick}
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden h-[110px]"
            >
                {/* Decorative ellipse in bottom-right */}
                <div
                    className={`absolute -bottom-10 -right-10 w-28 h-28 rounded-full ${
                        hasResources
                            ? "bg-brand-100 dark:bg-brand-900/20"
                            : "bg-gray-100 dark:bg-gray-700/20"
                    }`}
                />

                {/* Actions menu */}
                <div
                    className="absolute top-4 right-4 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ActionsDropdown
                        itemId={String(folder.id)}
                        actions={folderActions}
                        triggerIcon={
                            <MoreVertical className="size-5 text-gray-400" />
                        }
                        triggerClassName="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        width="w-40"
                    />
                </div>

                {/* Content */}
                <div className="flex gap-4 items-center h-full">
                    {/* Icon tile */}
                    <div
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 ${
                            hasResources
                                ? "bg-brand-100 dark:bg-brand-900/25"
                                : "bg-gray-100 dark:bg-gray-700"
                        }`}
                    >
                        <File
                            className={`size-6 ${
                                hasResources
                                    ? "text-brand-600 dark:text-brand-400"
                                    : "text-gray-400"
                            }`}
                        />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col min-w-0 pr-8 w-full">
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white line-clamp-1 leading-6">
                            {folder.name}
                        </h3>

                        <div className="mt-3">
                            <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-sm font-semibold px-8 py-2 rounded-2xl">
                                {folder.resourcesCount} {t("resources")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={deleteTargetId != null}
                onClose={() => setDeleteTargetId(null)}
                title={t("folder.deleteConfirmTitle")}
                message={t("folder.deleteConfirmMessage")}
                variant="danger"
                confirmText={t("folder.confirmDelete")}
                cancelText={t("folder.cancel")}
                onConfirm={confirmDelete}
                loading={deleteFolder.isPending}
            />
        </>
    );
}

export default FolderCard;
