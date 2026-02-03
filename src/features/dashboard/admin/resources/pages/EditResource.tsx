/**
 * EditResource Page
 *
 * Page for editing an existing resource.
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Save, Upload } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { LoadingState } from "@/design-system/components/LoadingState";
import { useResource, useUpdateResource } from "../api";
import type { ResourceType } from "../types";

const RESOURCE_TYPES: { value: ResourceType; label: string }[] = [
    { value: "video", label: "Video" },
    { value: "file", label: "File" },
    { value: "image", label: "Image" },
    { value: "audio", label: "Audio" },
];

export function EditResource() {
    const { t } = useTranslation("adminResources");
    const navigate = useNavigate();
    const { folderId, resourceId } = useParams<{
        folderId: string;
        resourceId: string;
    }>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const numericResourceId = resourceId ? Number(resourceId) : undefined;
    const { data: resource, isLoading } = useResource(
        numericResourceId || "",
        !!numericResourceId
    );
    const updateResource = useUpdateResource();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "video" as ResourceType,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (resource) {
            setFormData({
                title: resource.title,
                description: resource.description,
                type: resource.type,
            });
        }
    }, [resource]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!numericResourceId || !formData.title || !formData.description) {
            return;
        }

        await updateResource.mutateAsync({
            id: numericResourceId,
            payload: {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                file: selectedFile || undefined,
            },
        });

        navigate(`/admin/resources/folder/${folderId}`);
    };

    const handleCancel = () => {
        navigate(`/admin/resources/folder/${folderId}`);
    };

    if (isLoading) {
        return (
            <PageWrapper pageHeaderProps={{ title: t("resource.edit") }}>
                <LoadingState />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("resource.edit"),
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        {t("resource.updateInformation")}
                    </h2>

                    <div className="space-y-6">
                        {/* Resource Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("resource.title")}{" "}
                                <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                                placeholder={t("resource.titlePlaceholder")}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("resource.description")}{" "}
                                <span className="text-error-500">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder={t(
                                    "resource.descriptionPlaceholder"
                                )}
                                rows={4}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                required
                            />
                        </div>

                        {/* Resource Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("resource.type")}{" "}
                                <span className="text-error-500">*</span>
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        type: e.target.value as ResourceType,
                                    })
                                }
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                {RESOURCE_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("resource.uploadFile")}
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-500 transition-colors bg-brand-50 dark:bg-brand-900/20"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept="video/*,audio/*,image/*,.pdf,.doc,.docx"
                                />
                                <Upload className="size-8 mx-auto text-brand-500 mb-3" />
                                {selectedFile ? (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                        {selectedFile.name}
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            {t("resource.clickToUpload")}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {t("resource.supportedFormats")}
                                        </p>
                                        {resource && (
                                            <p className="mt-2 text-xs text-gray-400">
                                                Current file:{" "}
                                                {resource.fileName}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={updateResource.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="size-4" />
                        {t("resource.updateResource")}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        {t("resource.cancel")}
                    </button>
                </div>
            </form>
        </PageWrapper>
    );
}

export default EditResource;
