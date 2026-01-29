/**
 * TicketPriorityBadge Component
 *
 * Displays a colored badge for ticket priority.
 */

import { useTranslation } from "react-i18next";
import type { TicketPriority } from "../types";

interface TicketPriorityBadgeProps {
    priority: TicketPriority;
    size?: "sm" | "md";
}

const priorityStyles: Record<TicketPriority, { bg: string; text: string }> = {
    low: {
        bg: "bg-gray-800",
        text: "text-white",
    },
    medium: {
        bg: "bg-brand-500",
        text: "text-white",
    },
    high: {
        bg: "bg-red-500",
        text: "text-white",
    },
    urgent: {
        bg: "bg-red-800",
        text: "text-white",
    },
};

export function TicketPriorityBadge({
    priority,
    size = "sm",
}: TicketPriorityBadgeProps) {
    const { t } = useTranslation("ticketsManagement");

    const priorityLabels: Record<TicketPriority, string> = {
        low: t("tickets.priority.low", "Low"),
        medium: t("tickets.priority.medium", "Medium"),
        high: t("tickets.priority.high", "High"),
        urgent: t("tickets.priority.urgent", "Urgent"),
    };

    const styles = priorityStyles[priority];
    const sizeClasses =
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${styles.bg} ${styles.text} ${sizeClasses}`}
        >
            {priorityLabels[priority]}
        </span>
    );
}

export default TicketPriorityBadge;
