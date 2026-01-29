/**
 * BlockCard Component
 *
 * Displays a collapsible block/team card with agents.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Block } from "../types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AgentCard } from "./AgentCard";

interface BlockCardProps {
    block: Block;
    defaultExpanded?: boolean;
}

export function BlockCard({ block, defaultExpanded = false }: BlockCardProps) {
    const { t } = useTranslation("ticketsManagement");
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5" />
                        )}
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {block.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("teamStructure.ledBy", "Led by")}{" "}
                            {block.leadName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {block.totalAgents}{" "}
                            {t("teamStructure.agents", "agents")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {block.availableAgents}{" "}
                            {t("teamStructure.available", "available")}
                        </p>
                    </div>
                    <div className="px-3 py-1 bg-brand-500/10 text-brand-500 rounded-full text-sm font-medium">
                        {block.totalTickets}{" "}
                        {t("teamStructure.tickets", "tickets")}
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && block.agents.length > 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-full flex flex-wrap justify-between">
                        {block.agents.map((agent) => (
                            <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlockCard;
