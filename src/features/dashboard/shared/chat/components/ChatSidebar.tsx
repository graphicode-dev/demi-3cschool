import { useTranslation } from "react-i18next";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { ConversationListItem } from "../types";

interface ChatSidebarProps {
    conversations: ConversationListItem[];
    activeConversationId: number | null;
    onSelectConversation: (id: number) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onNewConversation?: () => void;
}

export default function ChatSidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    searchQuery,
    onSearchChange,
    onNewConversation,
}: ChatSidebarProps) {
    const { t } = useTranslation("chat");
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const filteredConversations = conversations.filter((conversation) =>
        conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 transition-all duration-300 bg-gray-900/50 z-999999"
                    onClick={toggleSidebar}
                ></div>
            )}
            <div className="flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 xl:flex xl:w-1/4 relative">
                <ChatHeader
                    onToggle={toggleSidebar}
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                />
                <ChatList
                    isOpen={isOpen}
                    onToggle={toggleSidebar}
                    conversations={filteredConversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={onSelectConversation}
                />

                {/* Fixed New Conversation Button */}
                {onNewConversation && (
                    <button
                        onClick={onNewConversation}
                        className="absolute bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                        title={t("chat.newConversation")}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                )}
            </div>
        </>
    );
}
