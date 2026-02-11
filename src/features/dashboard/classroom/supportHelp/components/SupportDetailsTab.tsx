/**
 * SupportDetailsTab Component
 *
 * Displays ticket details information for students.
 */

import { useTranslation } from "react-i18next";
import { Tag, Clock, FolderOpen } from "lucide-react";
import type { SupportTicket } from "../types";
import { SupportTicketStatusBadge } from "./SupportTicketStatusBadge";
import { format } from "date-fns";

interface SupportDetailsTabProps {
    ticket: SupportTicket;
}

export function SupportDetailsTab({ ticket }: SupportDetailsTabProps) {
    const { t } = useTranslation("supportHelp");

    return (
        <div className="p-3 overflow-y-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                        {t("supportHelp.details.ticketInfo", "Ticket Info")}
                    </h3>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Status */}
                <div className="flex items-start gap-2">
                    <div className="w-8 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-500 capitalize">
                            {t("supportHelp.details.status", "Status")}
                        </span>
                        <SupportTicketStatusBadge status={ticket.status} />
                    </div>
                </div>

                {/* Created On */}
                <div className="flex items-start gap-2">
                    <div className="w-8 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-500 capitalize">
                            {t("supportHelp.details.createdOn", "Created On")}
                        </span>
                        <span className="text-xs text-gray-900 dark:text-white">
                            {format(
                                new Date(ticket.createdAt),
                                "MMM dd, yyyy h:mm a"
                            )}
                        </span>
                    </div>
                </div>

                {/* Category */}
                {ticket.category && (
                    <div className="flex items-start gap-2">
                        <div className="w-8 flex items-center justify-center">
                            <FolderOpen className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-500 capitalize">
                                {t("supportHelp.details.category", "Category")}
                            </span>
                            <span className="text-xs text-gray-900 dark:text-white">
                                {ticket.category}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SupportDetailsTab;
