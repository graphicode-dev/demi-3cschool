/**
 * Content List Item Component
 *
 * Draggable item for content lists (videos, quizzes, assignments, materials).
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import {
    GripVertical,
    Video,
    HelpCircle,
    ClipboardList,
    FileText,
    Clock,
} from "lucide-react";
import type { ReactNode } from "react";

export interface ContentListItemProps {
    id: string;
    title: string;
    type: "video" | "quiz" | "assignment" | "material";
    duration?: string | number;
    isPublished?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
}

const typeIcons: Record<ContentListItemProps["type"], ReactNode> = {
    video: <Video className="w-4 h-4" />,
    quiz: <HelpCircle className="w-4 h-4" />,
    assignment: <ClipboardList className="w-4 h-4" />,
    material: <FileText className="w-4 h-4" />,
};

const typeColors: Record<ContentListItemProps["type"], string> = {
    video: "text-brand-500 bg-brand-50 dark:bg-brand-500/10",
    quiz: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
    assignment: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
    material: "text-green-500 bg-green-50 dark:bg-green-500/10",
};

export default function ContentListItem({
    id,
    title,
    type,
    duration,
    isPublished = false,
    isSelected = false,
    onClick,
}: ContentListItemProps) {
    const { t } = useTranslation();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Icon */}
            <div className={`p-2 rounded-lg ${typeColors[type]}`}>
                {typeIcons[type]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    {duration !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {duration}{" "}
                            {t("lessons:content.durationUnit", "min")}
                        </span>
                    )}
                    <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                            isPublished
                                ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
                                : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700"
                        }`}
                    >
                        {isPublished
                            ? t("lessons:content.status.active", "Active")
                            : t("lessons:content.status.draft", "Draft")}
                    </span>
                </div>
            </div>
        </div>
    );
}
