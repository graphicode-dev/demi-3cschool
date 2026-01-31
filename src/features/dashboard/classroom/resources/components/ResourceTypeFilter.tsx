/**
 * Resource Type Filter Component
 *
 * Filter tabs for resource types (All, Videos, Files, Images, Audio).
 */

import { useTranslation } from "react-i18next";
import { Video, FileText, Image, Music } from "lucide-react";
import type { ResourceFilter } from "../types";

interface ResourceTypeFilterProps {
    activeFilter: ResourceFilter;
    onFilterChange: (filter: ResourceFilter) => void;
}

export function ResourceTypeFilter({
    activeFilter,
    onFilterChange,
}: ResourceTypeFilterProps) {
    const { t } = useTranslation("resources");

    const filters: {
        id: ResourceFilter;
        label: string;
        icon?: React.ReactNode;
    }[] = [
        {
            id: "all",
            label: t("resources.filters.all", "All"),
        },
        {
            id: "video",
            label: t("resources.filters.videos", "Videos"),
            icon: <Video className="w-3.5 h-3.5" />,
        },
        {
            id: "file",
            label: t("resources.filters.files", "Files"),
            icon: <FileText className="w-3.5 h-3.5" />,
        },
        {
            id: "image",
            label: t("resources.filters.images", "Images"),
            icon: <Image className="w-3.5 h-3.5" />,
        },
        {
            id: "audio",
            label: t("resources.filters.audio", "Audio"),
            icon: <Music className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.id;
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs transition-all ${
                            isActive
                                ? "bg-cyan-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        {filter.icon}
                        <span>{filter.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default ResourceTypeFilter;
