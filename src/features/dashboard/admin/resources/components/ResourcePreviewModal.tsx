/**
 * ResourcePreviewModal Component
 *
 * Modal for previewing a resource (video, image, file, audio).
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Resource } from "../types";

interface ResourcePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource;
}

export function ResourcePreviewModal({
    isOpen,
    onClose,
    resource,
}: ResourcePreviewModalProps) {
    const { t } = useTranslation("adminResources");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });
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
                className={`fixed z-99999 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-800 shadow-theme-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {resource.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {resource.description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Preview Area */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center mb-4">
                        {resource.type === "video" && (
                            <div className="text-center text-white">
                                <p className="text-sm">
                                    {t("preview.videoPreview")} {resource.title}
                                </p>
                            </div>
                        )}
                        {resource.type === "image" && (
                            <div className="text-center text-white">
                                <p className="text-sm">
                                    Image Preview: {resource.fileName}
                                </p>
                            </div>
                        )}
                        {resource.type === "file" && (
                            <div className="text-center text-white">
                                <p className="text-sm">
                                    File: {resource.fileName}
                                </p>
                            </div>
                        )}
                        {resource.type === "audio" && (
                            <div className="text-center text-white">
                                <p className="text-sm">
                                    Audio: {resource.fileName}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {resource.type.charAt(0).toUpperCase() +
                                resource.type.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("preview.uploaded")}{" "}
                            {formatDate(resource.uploadedAt)}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResourcePreviewModal;
