/**
 * TicketStatusBadge Component
 *
 * Displays a colored badge for ticket status.
 */

import { useTranslation } from "react-i18next";
import type { TicketStatus } from "../types";

interface TicketStatusBadgeProps {
    status: TicketStatus;
    size?: "sm" | "md";
}

const statusStyles: Record<TicketStatus, { bg: string; text: string }> = {
    open: {
        bg: "bg-brand-500",
        text: "text-white",
    },
    in_progress: {
        bg: "bg-orange-500",
        text: "text-white",
    },
    resolved: {
        bg: "bg-brand-500",
        text: "text-white",
    },
    closed: {
        bg: "bg-green-500",
        text: "text-white",
    },
};

export function TicketStatusBadge({
    status,
    size = "sm",
}: TicketStatusBadgeProps) {
    const { t } = useTranslation("ticketsManagement");

    const statusLabels: Record<TicketStatus, string> = {
        open: t("tickets.status.open", "Open"),
        in_progress: t("tickets.status.inProgress", "In Progress"),
        resolved: t("tickets.status.resolved", "Resolved"),
        closed: t("tickets.status.closed", "Closed"),
    };

    const styles = statusStyles[status];
    const sizeClasses =
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${styles.bg} ${styles.text} ${sizeClasses}`}
        >
            {statusLabels[status]}
        </span>
    );
}

export default TicketStatusBadge;
