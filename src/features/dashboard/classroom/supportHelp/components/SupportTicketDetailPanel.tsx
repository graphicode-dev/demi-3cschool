/**
 * SupportTicketDetailPanel Component
 *
 * Main panel for displaying support ticket details with tabs.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, FileText } from "lucide-react";
import type { SupportTicket } from "../types";
import { SupportTicketStatusBadge } from "./SupportTicketStatusBadge";
import { SupportConversationTab } from "./SupportConversationTab";
import { SupportDetailsTab } from "./SupportDetailsTab";

type TabId = "conversation" | "details";

interface SupportTicketDetailPanelProps {
    ticket: SupportTicket;
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
}

export function SupportTicketDetailPanel({
    ticket,
    onSendMessage,
    isLoading,
}: SupportTicketDetailPanelProps) {
    const { t } = useTranslation("supportHelp");
    const [activeTab, setActiveTab] = useState<TabId>("conversation");

    const tabs: {
        id: TabId;
        label: string;
        icon: React.ReactNode;
        count?: number;
    }[] = [
        {
            id: "conversation",
            label: t("supportHelp.tabs.conversation", "Conversation"),
            icon: <MessageSquare className="w-3.5 h-3.5" />,
            count: ticket.messages.length,
        },
        {
            id: "details",
            label: t("supportHelp.tabs.details", "Details"),
            icon: <FileText className="w-3.5 h-3.5" />,
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs text-gray-400">
                        #{ticket.ticketNumber}
                    </span>
                    <SupportTicketStatusBadge status={ticket.status} />
                </div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    {ticket.subject}
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full text-[9px] flex items-center justify-center">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "conversation" && (
                    <SupportConversationTab
                        messages={ticket.messages}
                        onSendMessage={onSendMessage}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === "details" && (
                    <SupportDetailsTab ticket={ticket} />
                )}
            </div>
        </div>
    );
}

export default SupportTicketDetailPanel;
