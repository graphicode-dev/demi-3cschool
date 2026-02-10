/**
 * LeadBadge Component
 *
 * Displays a lead badge with name, email, and status.
 */

import { useTranslation } from "react-i18next";
import type { SupportBlockMember } from "../types";
import { Crown } from "lucide-react";

interface LeadBadgeProps {
    member: SupportBlockMember;
}

const statusDotColors = {
    available: "bg-success-500",
    busy: "bg-warning-500",
    offline: "bg-gray-400",
};

export function LeadBadge({ member }: LeadBadgeProps) {
    const { t } = useTranslation("ticketsManagement");

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

    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-lg border ${member.isLead ? "border-brand-500 bg-brand-50 dark:bg-brand-500/20 dark:border-brand-500/30" : "border-brand-200 bg-transparent dark:bg-brand-900/10 dark:border-brand-500/30"} min-w-[200px]`}
        >
            {/* Avatar with status dot */}
            <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-brand-500 text-white">
                    {getInitials(member.name)}
                </div>
                <div
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-brand-50 dark:border-brand-900/20 ${statusDotColors[member.status]}`}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {member.name}
                    </span>
                    {member.isLead && (
                        <Crown className="w-4 h-4 text-brand-500 shrink-0" />
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {member.email}
                </p>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                    {statusLabel[member.status]}
                </span>
            </div>
        </div>
    );
}

export default LeadBadge;
