/**
 * BlockCard Component
 *
 * Displays a collapsible support block card with members.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { SupportBlock } from "../types";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import { LeadBadge } from "./LeadBadge";
import { supportBlock as supportBlockPaths } from "../navigation/paths";

interface BlockCardProps {
    block: SupportBlock;
    defaultExpanded?: boolean;
}

export function BlockCard({ block, defaultExpanded = false }: BlockCardProps) {
    const { t } = useTranslation("adminTicketsManagement");
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const handleManageTeam = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(supportBlockPaths.manageTeam(block.id));
    };

    // Get leads from members
    const leads = useMemo(
        () => block.members?.filter((member) => member.isLead) ?? [],
        [block.members]
    );

    const leadNames =
        leads.length > 0
            ? leads.map((lead) => lead.name).join(", ")
            : t("supportBlock.noLeads", "No leads assigned");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    <div className="text-gray-400">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5" />
                        ) : (
                            <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                        )}
                    </div>
                    <div className="text-left rtl:text-right">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {block.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("supportBlock.ledBy", "Led by")} {leadNames}
                        </p>
                    </div>
                </button>

                <div className="flex items-center gap-4">
                    <div className="text-right rtl:text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {block.totalAgents}{" "}
                            {t("supportBlock.agents", "agents")}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {block.availableAgents}{" "}
                            {t("supportBlock.available", "available")}
                        </p>
                    </div>
                    <div className="px-3 py-1 bg-brand-500/10 text-brand-500 rounded-full text-sm font-medium">
                        {block.openTickets}{" "}
                        {t("supportBlock.tickets", "tickets")}
                    </div>
                    <button
                        onClick={handleManageTeam}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        {t("supportBlock.manageTeam", "Manage Team")}
                    </button>
                </div>
            </div>

            {/* Expanded Content - Show members using LeadBadge */}
            {isExpanded && (block.members?.length ?? 0) > 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-wrap gap-3">
                        {block.members?.map((member) => (
                            <LeadBadge key={member.id} member={member} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default BlockCard;
