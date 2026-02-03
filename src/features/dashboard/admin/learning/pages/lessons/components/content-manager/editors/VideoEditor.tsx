/**
 * Video Editor Component
 *
 * Form for creating/editing lesson videos.
 * Matches the design from the provided images.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, Play, Loader2, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import {
    useCreateLessonVideo,
    useDeleteLessonVideo,
    useUpdateLessonVideo,
} from "../../../api";
import { useMutationHandler } from "@/shared/api";
import type { ApiError } from "@/shared/api/types";
import { LessonVideo } from "../../../types";

interface VideoEditorProps {
    lessonId: string;
    video: LessonVideo | null;
    onSave: () => void;
    onCancel: () => void;
    onDelete?: () => void;
}

type VideoPreviewTab = "arabic" | "english";

export default function VideoEditor({
    lessonId,
    video,
    onSave,
    onCancel,
    onDelete,
}: VideoEditorProps) {
    const { t } = useTranslation();
    const isEditing = !!video;

    const { mutateAsync: createMutateAsync, isPending: isCreating } =
        useCreateLessonVideo();
    const { mutateAsync: updateMutateAsync, isPending: isUpdating } =
        useUpdateLessonVideo();
    const { mutateAsync: deleteMutateAsync, isPending: isDeleting } =
        useDeleteLessonVideo();
    const { execute } = useMutationHandler();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        provider: "bunny",
        videoReferenceAr: "",
        videoReferenceEn: "",
        isActive: false,
    });

    const [previewTab, setPreviewTab] = useState<VideoPreviewTab>("arabic");
    const [isSaved, setIsSaved] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const isSaving = isCreating || isUpdating;

    useEffect(() => {
        if (video) {
            console.log("VideoEditor - video data:", video);
            console.log(
                "VideoEditor - videoReferenceEn:",
                video.videoReferenceEn
            );
            setFormData({
                title: video.title || "",
                description: video.description || "",
                duration: String(video.duration) || "",
                provider: video.provider || "bunny",
                videoReferenceAr: video.videoReferenceAr || "",
                videoReferenceEn: video.videoReferenceEn || "",
                isActive: video.isActive === 1,
            });
        }
    }, [video]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setIsSaved(false);
        // Clear field error when user starts typing
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleValidationError = (error: ApiError) => {
        if (error?.validationErrors) {
            const errors: Record<string, string> = {};
            Object.entries(error.validationErrors).forEach(
                ([field, messages]) => {
                    errors[field] = Array.isArray(messages)
                        ? messages[0]
                        : messages;
                }
            );
            setFieldErrors(errors);
        }
    };

    const handleSaveChanges = async () => {
        await handleSave(true);
    };

    const handleSave = (active: boolean) => {
        const payload = {
            lessonId: lessonId,
            title: formData.title,
            description: formData.description,
            duration: Number(formData.duration) || 0,
            provider: formData.provider,
            videoReferenceAr: formData.videoReferenceAr,
            videoReferenceEn: formData.videoReferenceEn,
            isActive: active ? 1 : 0,
        };

        setFieldErrors({});

        if (isEditing && video) {
            execute(() => updateMutateAsync({ id: video.id, data: payload }), {
                successMessage: t(
                    "lessons:content.videos.toast.updateSuccessMessage",
                    "Video has been updated successfully"
                ),
                onSuccess: () => {
                    setIsSaved(true);
                    onSave();
                },
                onError: handleValidationError,
            });
        } else {
            execute(() => createMutateAsync(payload), {
                successMessage: t(
                    "lessons:content.videos.toast.createSuccessMessage",
                    "Video has been created successfully"
                ),
                onSuccess: () => {
                    setIsSaved(true);
                    onSave();
                },
                onError: handleValidationError,
            });
        }
    };

    const handleDelete = () => {
        if (!video) return;

        execute(() => deleteMutateAsync(video.id), {
            successMessage: t(
                "lessons:content.videos.toast.deleteSuccessMessage",
                "Video has been deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteDialog(false);
                onDelete?.();
            },
        });
    };

    const currentVideoUrl =
        previewTab === "arabic"
            ? formData.videoReferenceAr
            : formData.videoReferenceEn;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {t(
                            "lessons:content.videos.editor.title",
                            "Video Editor"
                        )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "lessons:content.videos.editor.subtitle",
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
                            "lessons:content.fields.titlePlaceholder",
                            "Enter video title..."
                        )}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none ${fieldErrors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    />
                    {fieldErrors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.title}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("lessons:content.fields.description", "Description")}
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        placeholder={t(
                            "lessons:content.fields.descriptionPlaceholder",
                            "Provide a brief description..."
                        )}
                        rows={3}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none ${fieldErrors.description ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    />
                    {fieldErrors.description && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.description}
                        </p>
                    )}
                </div>

                {/* Duration & Provider */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t(
                                "lessons:content.fields.duration",
                                "Duration (minutes)"
                            )}
                        </label>
                        <input
                            type="text"
                            value={formData.duration}
                            onChange={(e) =>
                                handleChange("duration", e.target.value)
                            }
                            placeholder="15 min"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t(
                                "lessons:content.fields.provider",
                                "Video Provider"
                            )}
                        </label>
                        <select
                            value={formData.provider}
                            onChange={(e) =>
                                handleChange("provider", e.target.value)
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        >
                            <option value="bunny">Bunny</option>
                            <option value="youtube">YouTube</option>
                            <option value="vimeo">Vimeo</option>
                        </select>
                    </div>
                </div>

                {/* Video ID (Arabic) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "lessons:content.fields.videoIdAr",
                            "Video ID (Arabic)"
                        )}
                    </label>
                    <input
                        type="text"
                        value={formData.videoReferenceAr}
                        onChange={(e) =>
                            handleChange("videoReferenceAr", e.target.value)
                        }
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-sm ${fieldErrors.videoReferenceAr ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    />
                    {fieldErrors.videoReferenceAr && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.videoReferenceAr}
                        </p>
                    )}
                </div>

                {/* Video ID (English) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "lessons:content.fields.videoIdEn",
                            "Video ID (English)"
                        )}
                    </label>
                    <input
                        type="text"
                        value={formData.videoReferenceEn}
                        onChange={(e) =>
                            handleChange("videoReferenceEn", e.target.value)
                        }
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-sm ${fieldErrors.videoReferenceEn ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    />
                    {fieldErrors.videoReferenceEn && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.videoReferenceEn}
                        </p>
                    )}
                </div>

                {/* isActive Toggle */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                            handleChange("isActive", e.target.checked)
                        }
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {t("lessons:content.fields.active", "Active")}
                    </label>
                </div>

                {/* Video Preview */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t(
                                "lessons:content.fields.videoPreview",
                                "Video Preview"
                            )}
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPreviewTab("arabic")}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                    previewTab === "arabic"
                                        ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                {t(
                                    "lessons:content.fields.arabicVideo",
                                    "Arabic Video"
                                )}
                            </button>
                            <button
                                onClick={() => setPreviewTab("english")}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                    previewTab === "english"
                                        ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                {t(
                                    "lessons:content.fields.englishVideo",
                                    "English Video"
                                )}
                            </button>
                        </div>
                    </div>
                    {video?.embedHtml ? (
                        <div
                            className="w-full rounded-xl overflow-hidden"
                            dangerouslySetInnerHTML={{
                                __html: video.embedHtml,
                            }}
                        />
                    ) : (
                        <div className="aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-800 text-gray-500 mb-3">
                                <Play className="w-8 h-8" />
                            </div>
                            <p className="text-sm text-gray-400">
                                {t(
                                    "lessons:content.fields.noVideoUploaded",
                                    "No video uploaded"
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {t(
                                    "lessons:content.fields.addVideoUrl",
                                    "Add a video URL to preview"
                                )}
                            </p>
                        </div>
                    )}
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
                        {isSaving && formData.isActive ? (
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
                    "lessons:content.videos.deleteDialog.title",
                    "Delete Video"
                )}
                message={t(
                    "lessons:content.videos.deleteDialog.message",
                    "Are you sure you want to delete this video? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDelete}
                loading={isDeleting}
            />
        </div>
    );
}
