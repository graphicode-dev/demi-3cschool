/**
 * SupportConversationTab Component
 *
 * Displays the conversation thread and message input for student support.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Send, Paperclip } from "lucide-react";
import type { SupportMessage } from "../types";
import { format } from "date-fns";

interface SupportConversationTabProps {
    messages: SupportMessage[];
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
}

export function SupportConversationTab({
    messages,
    onSendMessage,
    isLoading,
}: SupportConversationTabProps) {
    const { t } = useTranslation("supportHelp");
    const [newMessage, setNewMessage] = useState("");

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
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {messages.map((message) => {
                    const isStudent = message.sender === "student";

                    return (
                        <div
                            key={message.id}
                            className={`flex flex-col gap-2 ${isStudent ? "items-start" : "items-end"}`}
                        >
                            {/* Sender info for support team */}
                            {!isStudent && (
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-[7px] font-medium">
                                        {getInitials(message.senderName)}
                                    </div>
                                    <span className="text-[10px] text-gray-500">
                                        {t(
                                            "supportHelp.conversation.supportTeam",
                                            "Support Team"
                                        )}
                                    </span>
                                </div>
                            )}

                            {/* Message bubble */}
                            <div
                                className={`max-w-[85%] p-3 ${
                                    isStudent
                                        ? "bg-brand-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl border border-gray-200 dark:border-gray-600"
                                }`}
                            >
                                <p className="text-xs whitespace-pre-wrap">
                                    {message.content}
                                </p>
                            </div>

                            {/* Timestamp */}
                            <span className="text-[10px] text-gray-400">
                                {format(
                                    new Date(message.createdAt),
                                    "MMM dd, yyyy h:mm a"
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t(
                            "supportHelp.conversation.placeholder",
                            "Type your message..."
                        )}
                        className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-xs"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isLoading}
                        className="p-2 bg-gray-400 text-white rounded-lg hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SupportConversationTab;
