/**
 * TicketFilters Component
 *
 * Filter bar for tickets list.
 */

import { useTranslation } from "react-i18next";
import { Search, ChevronDown } from "lucide-react";
import type {
    TicketFilters as TicketFiltersType,
    TicketStatus,
    TicketPriority,
} from "../types";

interface TicketFiltersProps {
    filters: TicketFiltersType;
    onFiltersChange: (filters: TicketFiltersType) => void;
    agents: { id: string; name: string }[];
    blocks: { id: string; name: string }[];
}

export function TicketFilters({
    filters,
    onFiltersChange,
    agents,
    blocks,
}: TicketFiltersProps) {
    const { t } = useTranslation("ticketsManagement");

    const statusOptions: { value: TicketStatus | "all"; label: string }[] = [
        { value: "all", label: t("tickets.filters.allStatus", "All Status") },
        { value: "open", label: t("tickets.status.open", "Open") },
        {
            value: "in_progress",
            label: t("tickets.status.inProgress", "In Progress"),
        },
        { value: "resolved", label: t("tickets.status.resolved", "Resolved") },
        { value: "closed", label: t("tickets.status.closed", "Closed") },
    ];

    const priorityOptions: { value: TicketPriority | "all"; label: string }[] =
        [
            {
                value: "all",
                label: t("tickets.filters.allPriority", "All Priority"),
            },
            { value: "low", label: t("tickets.priority.low", "Low") },
            { value: "medium", label: t("tickets.priority.medium", "Medium") },
            { value: "high", label: t("tickets.priority.high", "High") },
            { value: "urgent", label: t("tickets.priority.urgent", "Urgent") },
        ];

    return (
        <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t(
                            "tickets.filters.searchPlaceholder",
                            "Search by ticket ID, student name, or subject..."
                        )}
                        value={filters.search || ""}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                search: e.target.value,
                            })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={filters.status || "all"}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                status: e.target.value as TicketStatus | "all",
                            })
                        }
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Agents Filter */}
                <div className="relative">
                    <select
                        value={filters.agentId || "all"}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                agentId: e.target.value,
                            })
                        }
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                    >
                        <option value="all">
                            {t("tickets.filters.allAgents", "All Agents")}
                        </option>
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Blocks Filter */}
                <div className="relative">
                    <select
                        value={filters.blockId || "all"}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                blockId: e.target.value,
                            })
                        }
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                    >
                        <option value="all">
                            {t("tickets.filters.allBlocks", "All Blocks")}
                        </option>
                        {blocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Priority Filter */}
                <div className="relative">
                    <select
                        value={filters.priority || "all"}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                priority: e.target.value as
                                    | TicketPriority
                                    | "all",
                            })
                        }
                        className="appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                    >
                        {priorityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

export default TicketFilters;
