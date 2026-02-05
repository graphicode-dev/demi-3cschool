import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
    MessageSquare,
    CloudUpload,
    Download,
    X,
    Eye,
    FileText,
    Image as ImageIcon,
    Loader2,
} from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import {
    useLessonAssignment,
    useCreateLessonAssignment,
} from "@/features/dashboard/admin/learning/pages/lessons/api";

export function SubmitAssignmentPage() {
    const { t } = useTranslation("projects");
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data: assignment } = useLessonAssignment(projectId, {
        enabled: !!projectId,
    });

    const createMutation = useCreateLessonAssignment();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles((prev) => [...prev, ...droppedFiles]);
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                const selectedFiles = Array.from(e.target.files);
                setFiles((prev) => [...prev, ...selectedFiles]);
            }
        },
        []
    );

    const handleRemoveFile = useCallback(
        (index: number) => {
            setFiles((prev) => prev.filter((_, i) => i !== index));
            // Clear preview if removed file was being previewed
            if (previewFile && files[index] === previewFile) {
                setPreviewFile(null);
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
            }
        },
        [files, previewFile, previewUrl]
    );

    const handlePreviewFile = useCallback(
        (file: File) => {
            // Revoke previous URL if exists
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const url = URL.createObjectURL(file);
            setPreviewFile(file);
            setPreviewUrl(url);
        },
        [previewUrl]
    );

    const closePreview = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewFile(null);
        setPreviewUrl(null);
    }, [previewUrl]);

    const isImageFile = useCallback((file: File) => {
        return file.type.startsWith("image/");
    }, []);

    const isPdfFile = useCallback((file: File) => {
        return file.type === "application/pdf";
    }, []);

    const handleSubmit = useCallback(async () => {
        if (files.length === 0 || !projectId) return;

        try {
            // Submit each file as a separate assignment submission
            for (const file of files) {
                await createMutation.mutateAsync({
                    lessonId: projectId,
                    title: content || assignment?.title || "Submission",
                    file,
                });
            }
            navigate(-1);
        } catch (error) {
            // Error handled by mutation
        }
    }, [content, files, projectId, navigate, createMutation, assignment]);

    const isSubmitDisabled = files.length === 0 || createMutation.isPending;

    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("projectNotFound")}
                </p>
            </div>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("submit.title"),
                subtitle: t("submit.description"),
                backButton: true,
            }}
        >
            {/* Form Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <div className="flex flex-col gap-6">
                    {/* Assignment Content Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="size-6 text-gray-600 dark:text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("submit.contentLabel")}
                            </h3>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t("submit.contentPlaceholder")}
                            className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                    </div>

                    {/* Upload Files Section */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <CloudUpload className="size-6 text-gray-600 dark:text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("submit.uploadLabel")}
                            </h3>
                        </div>

                        {/* Drop Zone */}
                        <label
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center gap-4 h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
                                isDragging
                                    ? "border-brand-500 bg-brand-500/10"
                                    : "border-brand-500 bg-brand-500/5 hover:bg-brand-500/10"
                            }`}
                        >
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Download className="size-12 text-brand-500" />
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                                {t("submit.dropzone")}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("submit.supportedFormats")}
                            </p>
                        </label>

                        {/* Selected Files */}
                        {files.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {isImageFile(file) ? (
                                                <ImageIcon className="size-5 text-brand-500 shrink-0" />
                                            ) : (
                                                <FileText className="size-5 text-brand-500 shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {(file.size / 1024).toFixed(
                                                        2
                                                    )}{" "}
                                                    KB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {/* Preview Button */}
                                            {(isImageFile(file) ||
                                                isPdfFile(file)) && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handlePreviewFile(file)
                                                    }
                                                    className="p-2 rounded-lg text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                                                    title={t(
                                                        "submit.preview",
                                                        "Preview"
                                                    )}
                                                >
                                                    <Eye className="size-4" />
                                                </button>
                                            )}
                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveFile(index)
                                                }
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                title={t(
                                                    "submit.remove",
                                                    "Remove"
                                                )}
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={`w-full py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2 ${
                            isSubmitDisabled
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                        }`}
                    >
                        {createMutation.isPending ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                {t("submit.submitting", "Submitting...")}
                            </>
                        ) : (
                            t("submit.button")
                        )}
                    </button>
                </div>
            </div>

            {/* File Preview Modal */}
            {previewFile && previewUrl && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm"
                        onClick={closePreview}
                    />

                    {/* Modal */}
                    <div className="fixed inset-4 z-50 flex items-center justify-center">
                        <div className="relative w-full max-w-4xl max-h-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    {isImageFile(previewFile) ? (
                                        <ImageIcon className="size-5 text-brand-500" />
                                    ) : (
                                        <FileText className="size-5 text-brand-500" />
                                    )}
                                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                                        {previewFile.name}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={closePreview}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Preview Content */}
                            <div className="p-4 max-h-[70vh] overflow-auto">
                                {isImageFile(previewFile) ? (
                                    <img
                                        src={previewUrl}
                                        alt={previewFile.name}
                                        className="max-w-full h-auto mx-auto rounded-lg"
                                    />
                                ) : isPdfFile(previewFile) ? (
                                    <iframe
                                        src={previewUrl}
                                        title={previewFile.name}
                                        className="w-full h-[60vh] rounded-lg border border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                                        <FileText className="size-16 mb-4" />
                                        <p>
                                            {t(
                                                "submit.noPreview",
                                                "Preview not available for this file type"
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </PageWrapper>
    );
}

export default SubmitAssignmentPage;
