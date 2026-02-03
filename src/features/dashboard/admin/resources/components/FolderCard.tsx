/**
 * FolderCard Component
 *
 * Displays a resource folder card with name, resource count, and actions menu.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MoreVertical, Pencil, Trash2, FileText } from "lucide-react";
import type { ResourceFolder } from "../types";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import { useDeleteFolder } from "../api";

interface FolderCardProps {
    folder: ResourceFolder;
    index: number;
}

export function FolderCard({ folder, index }: FolderCardProps) {
    const { t } = useTranslation("adminResources");
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const deleteFolder = useDeleteFolder();

    const handleCardClick = () => {
        navigate(`/admin/resources/folder/${folder.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        navigate(`/admin/resources/folder/${folder.id}/edit`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        await deleteFolder.mutateAsync(folder.id);
        setShowDeleteDialog(false);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // Check if folder has resources for styling
    const hasResources = folder.resourceCount > 0;

    return (
        <>
            <div
                onClick={handleCardClick}
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden h-[110px]"
            >
                {/* Decorative ellipse in bottom-right */}
                <div
                    className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full ${
                        hasResources
                            ? "bg-brand-100 dark:bg-brand-900/30"
                            : "bg-gray-100 dark:bg-gray-700/30"
                    }`}
                />

                {/* Menu button */}
                <button
                    onClick={toggleMenu}
                    className="absolute top-4 right-4 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                >
                    <MoreVertical className="size-5 text-gray-400" />
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-20"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                            }}
                        />
                        <div className="absolute top-10 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-30 min-w-[120px]">
                            <button
                                onClick={handleEdit}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <Pencil className="size-4" />
                                {t("folder.edit")}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20"
                            >
                                <Trash2 className="size-4" />
                                {t("folder.delete")}
                            </button>
                        </div>
                    </>
                )}

                {/* Content - Horizontal layout */}
                <div className="flex gap-4 items-start">
                    {/* Icon container */}
                    <div
                        className={`flex items-center justify-center w-10 h-12 rounded-xl shrink-0 ${
                            hasResources
                                ? "bg-brand-500/15 dark:bg-brand-500/20"
                                : "bg-gray-100 dark:bg-gray-700"
                        }`}
                    >
                        <FileText
                            className={`size-5 ${
                                hasResources
                                    ? "text-brand-500"
                                    : "text-gray-400"
                            }`}
                        />
                    </div>

                    {/* Text content */}
                    <div className="flex flex-col gap-1.5 min-w-0 pr-6">
                        {/* Folder name */}
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-5">
                            {folder.name}
                        </h3>

                        {/* Resource count badge */}
                        <div className="inline-flex">
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-semibold px-2.5 py-1 rounded-md">
                                {folder.resourceCount} {t("resources")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
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
