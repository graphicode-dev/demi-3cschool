/**
 * QuickActionCard Component
 *
 * Displays a quick action card with icon, title, description, and action link.
 */

import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    titleKey: string;
    title: string;
    descriptionKey: string;
    description: string;
    actionLabelKey: string;
    actionLabel: string;
    onClick?: () => void;
}

export function QuickActionCard({
    icon: Icon,
    iconBgColor,
    iconColor,
    titleKey,
    title,
    descriptionKey,
    description,
    actionLabelKey,
    actionLabel,
    onClick,
}: QuickActionCardProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
            <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor}`}
            >
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
                {t(titleKey, title)}
            </h3>
            <p className="mb-4 flex-1 text-sm text-gray-500 dark:text-gray-400">
                {t(descriptionKey, description)}
            </p>
            <button
                onClick={onClick}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
            >
                {t(actionLabelKey, actionLabel)}
                <ArrowRight className="h-4 w-4" />
            </button>
        </div>
    );
}

export default QuickActionCard;
