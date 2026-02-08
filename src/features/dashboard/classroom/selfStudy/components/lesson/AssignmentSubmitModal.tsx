import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Send, Loader2 } from "lucide-react";
import { FileInput } from "@/design-system";
import { useCreateLessonAssignment } from "@/features/dashboard/admin/learning/pages/lessons/api";
import type { LessonAssignment } from "@/features/dashboard/admin/learning/pages/lessons/types/lesson-assignments.types";

interface AssignmentSubmitModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignment: LessonAssignment;
    lessonId: string;
    onSuccess?: () => void;
}

export function AssignmentSubmitModal({
    isOpen,
    onClose,
    assignment,
    lessonId,
    onSuccess,
}: AssignmentSubmitModalProps) {
    const { t } = useTranslation("selfStudy");
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const createMutation = useCreateLessonAssignment();

    // Handle visibility animation
    useState(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) return;

        try {
            await createMutation.mutateAsync({
                lessonId,
                title: title || assignment.title,
                file,
            });

            // Reset form
            setFile(null);
            setTitle("");
            onSuccess?.();
            onClose();
        } catch (error) {
            // Error handled by mutation
        }
    };

    const handleClose = () => {
        if (!createMutation.isPending) {
            setFile(null);
            setTitle("");
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t(
                                "lesson.assignments.submitTitle",
                                "Submit Assignment"
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {assignment.title}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={createMutation.isPending}
                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Title Input */}
                    <div className="mb-4">
                        <label
                            htmlFor="submission-title"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            {t(
                                "lesson.assignments.submissionTitle",
                                "Submission Title"
                            )}
                        </label>
                        <input
                            id="submission-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t(
                                "lesson.assignments.titlePlaceholder",
                                "Enter a title for your submission"
                            )}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
                            disabled={createMutation.isPending}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t("lesson.assignments.uploadFile", "Upload File")}
                            <span className="text-red-500 ms-1">*</span>
                        </label>
                        <FileInput
                            value={file}
                            onChange={(f) => setFile(f as File | null)}
                            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                            maxSize={10 * 1024 * 1024} // 10MB
                            disabled={createMutation.isPending}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={createMutation.isPending}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            {t("common.cancel", "Cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={!file || createMutation.isPending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    {t("common.submitting", "Submitting...")}
                                </>
                            ) : (
                                <>
                                    <Send className="size-4" />
                                    {t("lesson.assignments.submit", "Submit")}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AssignmentSubmitModal;
