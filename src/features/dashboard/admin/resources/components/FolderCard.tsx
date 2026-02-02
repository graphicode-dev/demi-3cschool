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

    // Alternate colors for folder icons
    const iconColors = [
        "text-amber-400",
        "text-brand-400",
        "text-amber-400",
        "text-amber-400",
        "text-gray-400",
    ];
    const iconColor = iconColors[index % iconColors.length];

    return (
        <>
            <div
                onClick={handleCardClick}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700 group"
            >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden rounded-tr-xl">
                    <div
                        className={`absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8 ${
                            index % 2 === 0
                                ? "bg-amber-100 dark:bg-amber-900/30"
                                : "bg-brand-100 dark:bg-brand-900/30"
                        }`}
                    />
                </div>

                {/* Menu button */}
                <button
                    onClick={toggleMenu}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
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
                        <div className="absolute top-10 right-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-30 min-w-[120px]">
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

                {/* Folder icon */}
                <div className="mb-3">
                    <FileText className={`size-8 ${iconColor}`} />
                </div>

                {/* Folder name */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 pr-6 line-clamp-1">
                    {folder.name}
                </h3>

                {/* Resource count */}
                <p className="text-xs text-gray-400">
                    {folder.resourceCount} {t("resources")}
                </p>
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
