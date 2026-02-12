/**
 * RequesterTypeBadge Component
 *
 * Displays a colored badge for requester type.
 */

import { useTranslation } from "react-i18next";
import type { RequesterType } from "../types";

interface RequesterTypeBadgeProps {
    type: RequesterType;
}

const typeStyles: Record<RequesterType, { bg: string; text: string }> = {
    student: {
        bg: "bg-brand-500/10",
        text: "text-brand-500",
    },
    instructor: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
    },
    parent: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
    },
};

export function RequesterTypeBadge({ type }: RequesterTypeBadgeProps) {
    const { t } = useTranslation("adminTicketsManagement");

    const typeLabels: Record<RequesterType, string> = {
        student: t("tickets.requesterType.student", "Student"),
        instructor: t("tickets.requesterType.instructor", "Instructor"),
        parent: t("tickets.requesterType.parent", "Parent"),
    };

    const styles = typeStyles[type];

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles?.bg} ${styles?.text}`}
        >
            {typeLabels[type]}
        </span>
    );
}

export default RequesterTypeBadge;
