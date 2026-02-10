/**
 * ConversationTab Component
 *
 * Displays the conversation thread and message input.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, Paperclip } from "lucide-react";
import type { TicketMessage, RequesterType } from "../types";
import { format } from "date-fns";
import { authStore } from "@/auth/auth.store";

interface ConversationTabProps {
    messages: TicketMessage[];
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
}

const senderTypeBadgeStyles: Record<
    RequesterType | "agent",
    { bg: string; text: string }
> = {
    student: {
        bg: "bg-brand-100",
        text: "text-brand-500",
    },
    instructor: {
        bg: "bg-purple-500",
        text: "text-white",
    },
    parent: {
        bg: "bg-green-500",
        text: "text-white",
    },
    agent: {
        bg: "bg-green-100",
        text: "text-green-500",
    },
};

export function ConversationTab({
    messages,
    onSendMessage,
    isLoading,
}: ConversationTabProps) {
    const { t } = useTranslation("ticketsManagement");
    const [newMessage, setNewMessage] = useState("");
    const currentUser = authStore((state) => state.user);
    const currentUserId = currentUser?.id ? Number(currentUser.id) : null;

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                    // Check if message is from current user by comparing senderId
                    // Current user's messages appear on the right, others on the left
                    const isCurrentUser =
                        currentUserId !== null &&
                        message.senderId === currentUserId;
                    const senderType =
                        message.senderType ||
                        (isCurrentUser ? "agent" : "student");

                    return (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                        >
                            <div
                                className={`flex-1 max-w-[80%] space-y-3 ${isCurrentUser ? "text-right" : ""}`}
                            >
                                {/* Header */}
                                <div
                                    className={`flex items-center gap-3 ${isCurrentUser ? "justify-end" : ""}`}
                                >
                                    {/* Avatar - show first for non-agent */}
                                    {!isCurrentUser && (
                                        <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0 flex items-center justify-center text-white text-xs font-medium">
                                            {getInitials(message.senderName)}
                                        </div>
                                    )}

                                    {/* Name and Badge */}
                                    <div
                                        className={`flex items-center gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                                    >
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {message.senderName}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${senderTypeBadgeStyles[senderType].bg} ${senderTypeBadgeStyles[senderType].text}`}
                                        >
                                            {senderType === "agent"
                                                ? t(
                                                      "tickets.conversation.customerService",
                                                      "Customer Service"
                                                  )
                                                : t(
                                                      `tickets.requesterType.${senderType}`,
                                                      senderType
                                                  )}
                                        </span>
                                    </div>

                                    {/* Avatar - show last for agent */}
                                    {isCurrentUser && (
                                        <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0 flex items-center justify-center text-white text-xs font-medium">
                                            {getInitials(message.senderName)}
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div
                                    className={`p-4 rounded-xl ${
                                        isCurrentUser
                                            ? "bg-gray-100 dark:bg-gray-700 border-2  border-gray-300"
                                            : "bg-brand-50 dark:bg-gray-800 border-2 border-brand-500"
                                    }`}
                                >
                                    <p className="text-sm text-gray-700 dark:text-gray-300 text-left">
                                        {message.content}
                                    </p>
                                </div>

                                {/* Date */}
                                <span className="text-xs text-gray-400 mt-1 block">
                                    {format(
                                        new Date(message.createdAt),
                                        "MMM dd, yyyy h:mm a"
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t(
                            "tickets.conversation.placeholder",
                            "Type your message..."
                        )}
                        className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isLoading}
                        className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConversationTab;
