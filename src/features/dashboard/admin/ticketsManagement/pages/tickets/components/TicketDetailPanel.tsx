/**
 * TicketDetailPanel Component
 *
 * Main panel for displaying ticket details with tabs.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, FileText, StickyNote } from "lucide-react";
import type { Ticket, TicketStatus, TicketPriority } from "../types";
import { TicketDetailHeader } from "./TicketDetailHeader";
import { ConversationTab } from "./ConversationTab";
import { DetailsTab } from "./DetailsTab";
import { InternalNotesTab } from "./InternalNotesTab";

type TabId = "conversation" | "details" | "notes";

interface TicketDetailPanelProps {
    ticket: Ticket;
    agents: { id: string; name: string }[];
    onClose: () => void;
    onSendMessage: (content: string) => void;
    onAddNote: (content: string) => void;
    onUpdateTicket: (updates: {
        status?: TicketStatus;
        priority?: TicketPriority;
        assignedAgentId?: string;
    }) => void;
    isLoading?: boolean;
}

export function TicketDetailPanel({
    ticket,
    agents,
    onClose,
    onSendMessage,
    onAddNote,
    onUpdateTicket,
    isLoading,
}: TicketDetailPanelProps) {
    const { t } = useTranslation("ticketsManagement");
    const [activeTab, setActiveTab] = useState<TabId>("conversation");

    const tabs: {
        id: TabId;
        label: string;
        icon: React.ReactNode;
        count?: number;
    }[] = [
        {
            id: "conversation",
            label: t("tickets.tabs.conversation", "Conversation"),
            icon: <MessageSquare className="w-4 h-4" />,
            count: ticket.messages.length,
        },
        {
            id: "details",
            label: t("tickets.tabs.details", "Details"),
            icon: <FileText className="w-4 h-4" />,
        },
        {
            id: "notes",
            label: t("tickets.tabs.internalNotes", "Internal notes"),
            icon: <StickyNote className="w-4 h-4" />,
            count: ticket.internalNotes.length,
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            {/* Header */}
            <TicketDetailHeader ticket={ticket} onClose={onClose} />

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? "border-brand-500 text-brand-500"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
                {activeTab === "conversation" && (
                    <ConversationTab
                        messages={ticket.messages}
                        onSendMessage={onSendMessage}
                        isLoading={isLoading}
                    />
                )}
                {activeTab === "details" && (
                    <DetailsTab
                        ticket={ticket}
                        agents={agents}
                        onUpdateTicket={onUpdateTicket}
                    />
                )}
                {activeTab === "notes" && (
                    <InternalNotesTab
                        notes={ticket.internalNotes}
                        onAddNote={onAddNote}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
}

export default TicketDetailPanel;
