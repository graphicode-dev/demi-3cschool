/**
 * SupportTicketStatusBadge Component
 *
 * Displays a status badge for support tickets.
 */

import { useTranslation } from "react-i18next";
import type { SupportTicketStatus } from "../types";

interface SupportTicketStatusBadgeProps {
    status: SupportTicketStatus;
}

const statusStyles: Record<SupportTicketStatus, { bg: string; text: string }> =
    {
        open: {
            bg: "bg-brand-500",
            text: "text-white",
        },
        in_progress: {
            bg: "bg-amber-500",
            text: "text-white",
        },
        resolved: {
            bg: "bg-brand-100 dark:bg-brand-900/30",
            text: "text-brand-500",
        },
        closed: {
            bg: "bg-gray-500",
            text: "text-white",
        },
    };

export function SupportTicketStatusBadge({
    status,
}: SupportTicketStatusBadgeProps) {
    const { t } = useTranslation("ticketsManagement");

    const statusLabels: Record<SupportTicketStatus, string> = {
        open: t("supportHelp.status.open", "Open"),
        in_progress: t("supportHelp.status.inProgress", "In Progress"),
        resolved: t("supportHelp.status.resolved", "Resolved"),
        closed: t("supportHelp.status.closed", "Closed"),
    };

    const styles = statusStyles[status];

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${styles.bg} ${styles.text}`}
        >
            {statusLabels[status]}
        </span>
    );
}

export default SupportTicketStatusBadge;
