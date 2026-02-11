/**
 * SupportFilterTabs Component
 *
 * Filter tabs for support tickets (All, Resolved, In Progress, Closed).
 */

import { useTranslation } from "react-i18next";
import { Layers, CheckCircle, Loader2, Archive } from "lucide-react";
import type { SupportTicketFilter } from "../types";

interface SupportFilterTabsProps {
    activeFilter: SupportTicketFilter;
    onFilterChange: (filter: SupportTicketFilter) => void;
}

export function SupportFilterTabs({
    activeFilter,
    onFilterChange,
}: SupportFilterTabsProps) {
    const { t } = useTranslation("supportHelp");

    const filters: {
        id: SupportTicketFilter;
        label: string;
        icon: React.ReactNode;
    }[] = [
        {
            id: "all",
            label: t("supportHelp.filters.allTickets", "All Tickets"),
            icon: <Layers className="w-3.5 h-3.5" />,
        },
        {
            id: "resolved",
            label: t("supportHelp.filters.resolved", "Resolved"),
            icon: <CheckCircle className="w-3.5 h-3.5" />,
        },
        {
            id: "in_progress",
            label: t("supportHelp.filters.inProgress", "In Progress"),
            icon: <Loader2 className="w-3.5 h-3.5" />,
        },
        {
            id: "closed",
            label: t("supportHelp.filters.closed", "Closed"),
            icon: <Archive className="w-3.5 h-3.5" />,
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
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs transition-all shadow-sm ${
                            isActive
                                ? "bg-brand-500 text-white"
                                : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
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

export default SupportFilterTabs;
