/**
 * AgentCard Component
 *
 * Displays an agent card with avatar, name, role, status, and active tickets.
 * Matches Figma design node 1263:12630
 */

import { useTranslation } from "react-i18next";
import type { Agent } from "../types";
import { Crown } from "lucide-react";

interface AgentCardProps {
    agent: Agent;
}

const statusDotColors = {
    available: "bg-[#2BB673]",
    busy: "bg-[#FFA242]",
    offline: "bg-gray-400",
};

export function AgentCard({ agent }: AgentCardProps) {
    const { t } = useTranslation("ticketsManagement");
    const isLead = agent.role === "lead";

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const statusLabel = {
        available: t("supportBlock.status.available", "Available"),
        busy: t("supportBlock.status.busy", "Busy"),
        offline: t("supportBlock.status.offline", "Offline"),
    };

    const roleLabel = {
        lead: t("supportBlock.role.lead", "Lead"),
        agent: t("supportBlock.role.agent", "Agent"),
    };

    return (
        <div
            className={`flex items-start gap-4 p-3 rounded-lg border min-w-[180px] ${
                isLead
                    ? "bg-brand-50 dark:bg-brand-900 border-brand-500"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
        >
            {/* Avatar with status dot */}
            <div className="relative shrink-0">
                <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-[17px] font-normal ${
                        isLead
                            ? "bg-brand-500 text-white"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                >
                    {agent.avatar ? (
                        <img
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        getInitials(agent.name)
                    )}
                </div>
                {/* Status dot - positioned bottom-right */}
                <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${
                        isLead
                            ? "border-brand-50"
                            : "border-white dark:border-gray-800"
                    } ${statusDotColors[agent.status]}`}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Name and crown */}
                <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">
                        {agent.name}
                    </span>
                    {isLead && (
                        <Crown className="w-[18px] h-[18px] text-brand-500 shrink-0" />
                    )}
                </div>

                {/* Role and status badges */}
                <div className="flex items-center gap-2">
                    <span className="px-4 py-0.5 rounded-full border border-[rgba(153,153,153,0.4)] text-[12px] font-semibold text-gray-900 dark:text-white">
                        {roleLabel[agent.role]}
                    </span>
                    <span className="text-[12px] text-gray-900/80 dark:text-gray-400">
                        {statusLabel[agent.status]}
                    </span>
                </div>

                {/* Active tickets */}
                <p className="text-[12px] text-gray-900/80 dark:text-gray-400">
                    {agent.activeTickets}{" "}
                    {t("supportBlock.activeTickets", "active tickets")}
                </p>
            </div>
        </div>
    );
}

export default AgentCard;
