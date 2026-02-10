/**
 * Assignment Editor Component
 *
 * Form for creating/editing lesson assignments with file upload.
 * Matches the design from the provided images.
 */

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Check,
    FileText,
    Upload,
    ExternalLink,
    Loader2,
    Trash2,
    Eye,
    X,
} from "lucide-react";
import { ConfirmDialog } from "@/design-system";
import {
    useCreateLessonAssignment,
    useDeleteLessonAssignment,
    useUpdateLessonAssignment,
} from "../../../api";
import { useMutationHandler } from "@/shared/api";
import type { ApiError } from "@/shared/api/types";
import { LessonAssignment } from "../../../types/lesson-assignments.types";

interface AssignmentEditorProps {
    lessonId: string;
    assignment: LessonAssignment | null;
    onSave: () => void;
    onCancel: () => void;
    onDelete?: () => void;
}

export default function AssignmentEditor({
    lessonId,
    assignment,
    onSave,
    onCancel,
    onDelete,
}: AssignmentEditorProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditing = !!assignment;

    const { mutateAsync: createMutateAsync, isPending: isCreating } =
        useCreateLessonAssignment();
    const { mutateAsync: updateMutateAsync, isPending: isUpdating } =
        useUpdateLessonAssignment();
    const { mutateAsync: deleteMutateAsync, isPending: isDeleting } =
        useDeleteLessonAssignment();
    const { execute } = useMutationHandler();

    const [formData, setFormData] = useState({
        title: "",
        isPublished: false,
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const isSaving = isCreating || isUpdating;

    useEffect(() => {
        if (assignment) {
            setFormData({
                title: assignment.title || "",
                isPublished: true,
            });
        }
    }, [assignment]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setIsSaved(false);
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleValidationError = (error: ApiError) => {
        const validationErrors =
            error?.validationErrors || (error as any)?.errors;
        if (validationErrors) {
            const errors: Record<string, string> = {};
            Object.entries(validationErrors).forEach(([field, messages]) => {
                errors[field] = Array.isArray(messages)
                    ? messages[0]
                    : String(messages);
            });
            setFieldErrors(errors);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setIsSaved(false);
            if (fieldErrors.file) {
                setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.file;
                    return newErrors;
                });
            }
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handlePreviewFile = () => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
            setShowPreviewModal(true);
        } else if (existingFile?.url) {
            setPreviewUrl(existingFile.url);
            setShowPreviewModal(true);
        }
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
        if (previewUrl && selectedFile) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
    };

    const getFileExtension = (filename: string) => {
        return filename.split(".").pop()?.toLowerCase() || "";
    };

    const canPreviewFile = () => {
        const filename = selectedFile?.name || existingFile?.fileName || "";
        const ext = getFileExtension(filename);
        return ["pdf", "jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    };

    const handleSaveChanges = async () => {
        await handleSave();
    };

    const handleSave = () => {
        const payload = {
            lessonId: lessonId,
            title: formData.title,
            file: selectedFile || undefined,
        };

        setFieldErrors({});

        if (isEditing && assignment) {
            execute(
                () => updateMutateAsync({ id: assignment.id, data: payload }),
                {
                    successMessage: t(
                        "lessons:content.assignments.toast.updateSuccessMessage",
                        "Assignment has been updated successfully"
                    ),
                    onSuccess: () => {
                        setIsSaved(true);
                        onSave();
                    },
                    onError: handleValidationError,
                }
            );
        } else {
            execute(() => createMutateAsync(payload), {
                successMessage: t(
                    "lessons:content.assignments.toast.createSuccessMessage",
                    "Assignment has been created successfully"
                ),
                onSuccess: () => {
                    setIsSaved(true);
                    onSave();
                },
                onError: handleValidationError,
            });
        }
    };

    const handleDeleteAssignment = () => {
        if (!assignment) return;

        execute(() => deleteMutateAsync(assignment.id), {
            successMessage: t(
                "lessons:content.assignments.toast.deleteSuccessMessage",
                "Assignment has been deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteDialog(false);
                onDelete?.();
            },
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const existingFile = assignment?.file;
    const hasFile = selectedFile || existingFile;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {t(
                            "lessons:content.assignments.editor.title",
                            "Assignment Editor"
                        )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "lessons:content.assignments.editor.subtitle",
                            "Configure content details and settings"
                        )}
                    </p>
                </div>
                {isSaved && (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        {t("common.saved", "Saved")}
                    </span>
                )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("lessons:content.fields.title", "Title")} *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder={t(
                            "lessons:content.assignments.titlePlaceholder",
                            "Enter assignment title..."
                        )}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none ${fieldErrors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    />
                    {fieldErrors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.title}
                        </p>
                    )}
                </div>

                {/* File Preview */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "lessons:content.assignments.filePreview",
                            "File Preview"
                        )}
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="assignment-file-upload"
                    />
                    {hasFile ? (
                        <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                            <div className="text-center">
                                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg">
                                    <FileText className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {selectedFile?.name ||
                                        existingFile?.fileName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {selectedFile
                                        ? formatFileSize(selectedFile.size)
                                        : existingFile?.humanReadableSize}
                                </p>
                                {!selectedFile && (
                                    <button
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="mt-3 text-xs text-brand-500 hover:text-brand-600"
                                    >
                                        {t(
                                            "lessons:content.assignments.changeFile",
                                            "Change file"
                                        )}
                                    </button>
                                )}
                                {selectedFile && (
                                    <button
                                        onClick={clearFile}
                                        className="mt-3 text-xs text-red-500 hover:text-red-600"
                                    >
                                        {t(
                                            "lessons:content.assignments.removeFile",
                                            "Remove file"
                                        )}
                                    </button>
                                )}
                                {canPreviewFile() && (
                                    <button
                                        onClick={handlePreviewFile}
                                        className="mt-2 flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600"
                                    >
                                        <Eye className="w-3 h-3" />
                                        {t(
                                            "lessons:content.assignments.previewFile",
                                            "Preview file"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <label
                            htmlFor="assignment-file-upload"
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-500/5 transition-colors"
                        >
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t(
                                    "lessons:content.assignments.uploadFile",
                                    "Click to upload file"
                                )}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                PDF, DOC, XLSX, PPTX, etc.
                            </p>
                        </label>
                    )}
                    {fieldErrors.file && (
                        <p className="mt-2 text-sm text-red-500">
                            {fieldErrors.file}
                        </p>
                    )}
                </div>

                {/* Download Link */}
                {existingFile?.url && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t(
                                "lessons:content.assignments.downloadLink",
                                "Download Link"
                            )}
                        </label>
                        <a
                            href={existingFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600"
                        >
                            <ExternalLink className="w-4 h-4" />
                            {t(
                                "lessons:content.assignments.downloadFile",
                                "Download File"
                            )}
                        </a>
                    </div>
                )}

                {/* isActive Toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isPublished"
                        checked={formData.isPublished}
                        onChange={(e) =>
                            handleChange("isPublished", e.target.checked)
                        }
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label
                        htmlFor="isPublished"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {t("lessons:content.fields.active", "Active")}
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isSaving || isDeleting}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isSaving || isDeleting}
                            className="flex items-center gap-1 text-sm text-error-500 hover:text-error-600 disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            {t("common.delete", "Delete")}
                        </button>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveChanges}
                        disabled={isSaving || isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("common.saving", "Saving...")}
                            </span>
                        ) : (
                            t("common.saveChanges", "Save Changes")
                        )}
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                variant="danger"
                title={t(
                    "lessons:content.assignments.deleteDialog.title",
                    "Delete Assignment"
                )}
                message={t(
                    "lessons:content.assignments.deleteDialog.message",
                    "Are you sure you want to delete this assignment? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDeleteAssignment}
                loading={isDeleting}
            />

            {/* File Preview Modal */}
            {showPreviewModal && previewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {t(
                                    "lessons:content.assignments.filePreview",
                                    "File Preview"
                                )}
                            </h3>
                            <button
                                onClick={closePreviewModal}
                                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                            {getFileExtension(
                                selectedFile?.name ||
                                    existingFile?.fileName ||
                                    ""
                            ) === "pdf" ? (
                                <iframe
                                    src={`${previewUrl}#toolbar=0`}
                                    className="w-full h-[70vh] border-0"
                                    title="PDF Preview"
                                />
                            ) : (
                                <img
                                    src={previewUrl}
                                    alt="File preview"
                                    className="max-w-full h-auto mx-auto"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
