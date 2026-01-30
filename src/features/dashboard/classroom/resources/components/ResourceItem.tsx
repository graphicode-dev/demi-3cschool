/**
 * Resource Item Component
 *
 * Displays a single resource with type icon, title, meta info, and actions.
 */

import { useTranslation } from "react-i18next";
import { Download, Eye } from "lucide-react";
import type { Resource } from "../types";
import { ResourceTypeIcon } from "./ResourceTypeIcon";

interface ResourceItemProps {
    resource: Resource;
    onView: (resource: Resource) => void;
    onDownload?: (resource: Resource) => void;
}

export function ResourceItem({ resource, onView, onDownload }: ResourceItemProps) {
    const { t } = useTranslation("resources");

    const getTypeLabel = () => {
        const labels = {
            file: t("resources.types.file", "FILE"),
            video: t("resources.types.video", "VIDEO"),
            image: t("resources.types.image", "IMAGE"),
            audio: t("resources.types.audio", "AUDIO"),
        };
        return labels[resource.type];
    };

    const getMeta = () => {
        if (resource.duration) {
            return resource.duration;
        }
        if (resource.size) {
            return resource.size;
        }
        return null;
    };

    const handleView = () => {
        onView(resource);
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload(resource);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 flex items-center gap-3">
            {/* Type Icon */}
            <ResourceTypeIcon type={resource.type} />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                    {resource.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 uppercase">
                        {getTypeLabel()}
                    </span>
                    {getMeta() && (
                        <>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-[10px] text-gray-400">
                                {getMeta()}
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                {resource.type === "file" && onDownload && (
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title={t("resources.actions.download", "Download")}
                    >
                        <Download className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={handleView}
                    className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500 text-white rounded-full text-xs font-medium hover:bg-cyan-600 transition-colors"
                >
                    <Eye className="w-3 h-3" />
                    {t("resources.actions.view", "View")}
                </button>
            </div>
        </div>
    );
}

export default ResourceItem;
