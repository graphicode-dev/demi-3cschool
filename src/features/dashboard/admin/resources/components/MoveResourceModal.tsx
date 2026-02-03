/**
 * MoveResourceModal Component
 *
 * Modal for moving a resource to another folder.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useFoldersList } from "../api";
import { useToast } from "@/design-system/hooks/useToast";
import type { Resource, ResourceFolder } from "../types";

interface MoveResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource;
    currentFolder?: ResourceFolder;
}

export function MoveResourceModal({
    isOpen,
    onClose,
    resource,
    currentFolder,
}: MoveResourceModalProps) {
    const { t } = useTranslation("adminResources");
    const toast = useToast();
    const [selectedFolderId, setSelectedFolderId] = useState<string>("");
    const [isVisible, setIsVisible] = useState(false);

    const { data: foldersPage } = useFoldersList({
        gradeId: currentFolder?.grade.id,
        programId: currentFolder?.programsCurriculum.id,
        page: 1,
    });

    const folders = foldersPage?.items ?? [];

    // Filter out current folder
    const availableFolders = folders.filter((f) => f.id !== currentFolder?.id);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            setSelectedFolderId("");
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (!selectedFolderId) return;

        toast.addToast({
            type: "error",
            message: "Move resource is not available yet",
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-99999 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`fixed z-99999 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-theme-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("resource.moveTitle")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Current Information */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            {t("resource.currentInformation")}
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {t("resource.resourceName")}
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {resource.title}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {t("resource.currentGrade")}
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {currentFolder?.grade.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {t("resource.currentTerm")}
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {currentFolder?.programsCurriculum.caption}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {t("resource.currentFolder")}
                                </span>
                                <span className="text-gray-900 dark:text-white font-medium">
                                    {currentFolder?.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Target Folder Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("resource.selectTargetFolder")}{" "}
                            <span className="text-error-500">*</span>
                        </label>
                        <select
                            value={selectedFolderId}
                            onChange={(e) =>
                                setSelectedFolderId(e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="">
                                {t("resource.selectFolderPlaceholder")}
                            </option>
                            {availableFolders.map((folder) => (
                                <option
                                    key={folder.id}
                                    value={String(folder.id)}
                                >
                                    {folder.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {t("resource.folderHint")}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedFolderId}
                        className="flex-1 px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("resource.confirmMove")}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        {t("resource.cancel")}
                    </button>
                </div>
            </div>
        </>
    );
}

export default MoveResourceModal;
