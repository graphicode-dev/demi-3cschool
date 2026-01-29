import { useTranslation } from "react-i18next";
import ChatBoxHeader from "./ChatBoxHeader";
import ChatBoxSendForm from "./ChatBoxSendForm";
import type { ChatMessage, ConversationListItem } from "../types";
import { Loader2 } from "lucide-react";
import { useRef, useEffect, useCallback } from "react";

interface ChatBoxProps {
    conversation: ConversationListItem | null;
    messages: ChatMessage[];
    onSendMessage: (content: string, attachments?: File[]) => void;
    isLoading?: boolean;
    isSending?: boolean;
    currentUserId?: number | string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

export default function ChatBox({
    conversation,
    messages,
    onSendMessage,
    isLoading,
    isSending,
    currentUserId,
    onLoadMore,
    hasMore,
    isLoadingMore,
}: ChatBoxProps) {
    const { t } = useTranslation("chat");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when new messages arrive or conversation changes
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Scroll to bottom on initial load and when sending new messages
    useEffect(() => {
        if (!isLoading && messages.length > 0) {
            scrollToBottom();
        }
    }, [isLoading, messages.length, scrollToBottom]);

    // Handle scroll to load more messages
    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current;
        if (!container || !onLoadMore || !hasMore || isLoadingMore) return;

        // Load more when scrolled near the top (within 100px)
        if (container.scrollTop < 100) {
            onLoadMore();
        }
    }, [onLoadMore, hasMore, isLoadingMore]);
    if (!conversation) {
        return (
            <div className="flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 xl:w-3/4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {t("chat.selectConversation")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t("chat.selectConversationDesc")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/5 xl:w-3/4">
            <ChatBoxHeader user={conversation.user} />
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 max-h-full p-5 space-y-6 overflow-auto custom-scrollbar xl:space-y-8 xl:p-6 flex flex-col"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t("chat.noMessages")}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Load more indicator at top */}
                        {isLoadingMore && (
                            <div className="flex items-center justify-center py-2">
                                <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                            </div>
                        )}
                        {hasMore && !isLoadingMore && (
                            <div className="flex items-center justify-center py-2">
                                <button
                                    onClick={onLoadMore}
                                    className="text-sm text-brand-500 hover:text-brand-600"
                                >
                                    {t("chat.loadOlderMessages")}
                                </button>
                            </div>
                        )}

                        {/* Messages - oldest first, newest at bottom */}
                        {[...messages].reverse().map((message) => {
                            const isSender =
                                currentUserId &&
                                String(message.senderId) ===
                                    String(currentUserId);
                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        isSender
                                            ? "justify-end"
                                            : "items-start gap-4"
                                    }`}
                                >
                                    {!isSender && (
                                        <div className="w-10 h-10 overflow-hidden rounded-full shrink-0">
                                            <img
                                                src={
                                                    (message.sender as any)
                                                        ?.image ||
                                                    message.sender?.avatar ||
                                                    "/images/user/default-avatar.png"
                                                }
                                                alt={`${
                                                    message.sender?.name ||
                                                    "User"
                                                } profile`}
                                                className="object-cover object-center w-full h-full"
                                            />
                                        </div>
                                    )}

                                    <div
                                        className={`${
                                            isSender ? "text-right" : ""
                                        } max-w-[70%]`}
                                    >
                                        {message.attachments?.map(
                                            (attachment) =>
                                                attachment.type === "image" ? (
                                                    <div
                                                        key={attachment.id}
                                                        className={`mb-2 w-full max-w-[270px] overflow-hidden rounded-lg ${
                                                            isSender
                                                                ? "ml-auto"
                                                                : ""
                                                        }`}
                                                    >
                                                        <img
                                                            src={attachment.url}
                                                            alt={
                                                                attachment.name
                                                            }
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : null
                                        )}

                                        <div
                                            className={`inline-block px-3 py-2 rounded-lg ${
                                                isSender
                                                    ? "bg-brand-500 text-white dark:bg-brand-500"
                                                    : "bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white/90"
                                            } ${
                                                isSender
                                                    ? "rounded-tr-sm"
                                                    : "rounded-tl-sm"
                                            }`}
                                        >
                                            <p className="text-sm">
                                                {message.content}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-gray-500 text-theme-xs dark:text-gray-400">
                                            {isSender
                                                ? message.createdAtFormatted
                                                : `${
                                                      message.sender?.name ||
                                                      "User"
                                                  }, ${
                                                      message.createdAtFormatted
                                                  }`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Scroll anchor at bottom */}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
            <ChatBoxSendForm
                onSendMessage={onSendMessage}
                isSending={isSending}
            />
        </div>
    );
}
