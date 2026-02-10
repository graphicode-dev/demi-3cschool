/**
 * TeamStatsRow Component
 *
 * Displays a row of stat cards for the support block page.
 * Shows: Total Blocks, Block Leads, Total Agents
 * Matches Figma design node 1262:12175
 */

import { useTranslation } from "react-i18next";
import type { TeamStats } from "../types";
import { Users, Crown, User } from "lucide-react";
import type { ReactNode } from "react";

interface TeamStatsRowProps {
    stats: TeamStats;
    isLoading?: boolean;
}

interface StatItemProps {
    icon: ReactNode;
    value: string | number;
    label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] flex items-center gap-4">
            {/* Icon */}
            <div className="w-9 h-9 rounded-md bg-[rgba(0,174,237,0.1)] flex items-center justify-center shrink-0">
                <div className="text-brand-500">{icon}</div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-0.5">
                <span className="text-[22px] font-bold text-gray-900 dark:text-white leading-6">
                    {value}
                </span>
                <span className="text-[12px] text-gray-900/80 dark:text-gray-300 leading-4">
                    {label}
                </span>
            </div>
        </div>
    );
}

export function TeamStatsRow({ stats, isLoading }: TeamStatsRowProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-[73px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatItem
                icon={<Users className="w-[18px] h-[18px]" />}
                value={stats.totalBlocks}
                label={t("supportBlock.stats.totalBlocks", "Total Blocks")}
            />
            <StatItem
                icon={<Crown className="w-[18px] h-[18px]" />}
                value={stats.blockLeads}
                label={t("supportBlock.stats.blockLeads", "Block Leads")}
            />
            <StatItem
                icon={<User className="w-[18px] h-[18px]" />}
                value={stats.totalAgents}
                label={t("supportBlock.stats.totalAgents", "Total Agents")}
            />
        </div>
    );
}

export default TeamStatsRow;
