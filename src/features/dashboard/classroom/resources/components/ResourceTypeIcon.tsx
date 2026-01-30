/**
 * Resource Type Icon Component
 *
 * Displays the appropriate icon for a resource type.
 */

import { FileText, Video, Image, Music } from "lucide-react";
import type { ResourceType } from "../types";

interface ResourceTypeIconProps {
    type: ResourceType;
    className?: string;
}

const iconMap = {
    file: FileText,
    video: Video,
    image: Image,
    audio: Music,
};

const colorMap = {
    file: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
    video: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
    image: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
    audio: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
};

export function ResourceTypeIcon({ type, className = "" }: ResourceTypeIconProps) {
    const Icon = iconMap[type];
    const colors = colorMap[type];

    return (
        <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors} ${className}`}
        >
            <Icon className="w-4 h-4" />
        </div>
    );
}

export default ResourceTypeIcon;
