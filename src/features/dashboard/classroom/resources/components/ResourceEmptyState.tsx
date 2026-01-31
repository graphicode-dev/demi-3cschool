/**
 * Resource Empty State Component
 *
 * Displays empty state when no resources are found.
 */

import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { ResourceFilter } from "../types";

interface ResourceEmptyStateProps {
    filter: ResourceFilter;
}

export function ResourceEmptyState({ filter }: ResourceEmptyStateProps) {
    const { t } = useTranslation("resources");

    const getFilterLabel = () => {
        const labels: Record<ResourceFilter, string> = {
            all: t("resources.filters.all", "resources"),
            video: t("resources.filters.videos", "videos"),
            file: t("resources.filters.files", "files"),
            image: t("resources.filters.images", "images"),
            audio: t("resources.filters.audio", "audio"),
        };
        return labels[filter].toLowerCase();
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
                <FileText
                    className="w-16 h-16 text-gray-300 dark:text-gray-600"
                    strokeWidth={1}
                />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                {t("resources.emptyState.title", "No resources found")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("resources.emptyState.description", "No {{type}} found in this folder.", {
                    type: getFilterLabel(),
                })}
            </p>
        </div>
    );
}

export default ResourceEmptyState;
