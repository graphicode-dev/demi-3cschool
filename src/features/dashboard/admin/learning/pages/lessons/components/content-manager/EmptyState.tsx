/**
 * Empty State Component
 *
 * Displays when no content is selected or list is empty.
 */

import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                {title ||
                    t("lessons:content.empty.title", "No Content Selected")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                {description ||
                    t(
                        "lessons:content.empty.description",
                        "Select a content item from the list or add new content to get started"
                    )}
            </p>
        </div>
    );
}
