import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, CloudUpload, Download, ArrowLeft } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useLessonAssignment } from "@/features/dashboard/admin/learning/pages/lessons/api";

export function SubmitAssignmentPage() {
    const { t } = useTranslation("projects");
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const { data: assignment } = useLessonAssignment(projectId, {
        enabled: !!projectId,
    });

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

    const handleSubmit = useCallback(() => {
        console.log("Submitting:", { content, files, projectId });
        navigate(-1);
    }, [content, files, projectId, navigate]);

    const isSubmitDisabled = files.length === 0;

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
                            <div className="flex flex-wrap gap-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <span>{file.name}</span>
                                        <button
                                            onClick={() =>
                                                setFiles((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={`w-full py-4 rounded-full text-lg font-bold transition-all ${
                            isSubmitDisabled
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                : "bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/25"
                        }`}
                    >
                        {t("submit.button")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
}

export default SubmitAssignmentPage;
