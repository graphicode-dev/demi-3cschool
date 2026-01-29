import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { usePusher, MessageSentEvent } from "../hooks";
import { ChatMessage, ConversationListItem } from "../types";
import NewConversationModal from "../components/NewConversationModal";
import ChatBox from "../components/ChatBox";
import ChatSidebar from "../components/ChatSidebar";
import { useMutationResponse } from "@/shared/hooks/useMutationResponse";
import { authStore } from "@/auth/auth.store";
import {
    mockChatMessages,
    mockChatUsers,
    mockConversationListItems,
} from "../mockData";

function ChatPage() {
    const { t } = useTranslation("chat");
    const { handleMutationError } = useMutationResponse();
    const { user } = authStore();

    const [activeConversationId, setActiveConversationId] = useState<
        number | null
    >(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewConversationModalOpen, setIsNewConversationModalOpen] =
        useState(false);

    // Pagination state
    const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Update allMessages when initial messages load
    useMemo(() => {
        if (mockChatMessages.length > 0) {
            setAllMessages(mockChatMessages);
            setHasMore(mockChatMessages.length >= 20); // Assume page size is 20
        }
    }, [mockChatMessages]);

    // Load more (older) messages
    const handleLoadMore = useCallback(async () => {
        if (
            !activeConversationId ||
            isLoadingMore ||
            !hasMore ||
            allMessages.length === 0
        )
            return;

        setIsLoadingMore(true);
        try {
            // Get the oldest message ID to fetch messages before it
            // const oldestMessageId = allMessages[0]?.id;
            // if (!oldestMessageId) return;
            // const olderMessagesResponse =
            //     await Endpoints.dashboard.chat.messages.list(
            //         activeConversationId,
            //         oldestMessageId
            //     );
            // const olderMessages =
            //     (olderMessagesResponse as ChatMessage[] | undefined) || [];
            // if (olderMessages.length > 0) {
            //     setAllMessages((prev) => [...olderMessages, ...prev]);
            //     setHasMore(olderMessages.length >= 20);
            // } else {
            //     setHasMore(false);
            // }
        } catch (error) {
            console.error("Failed to load more messages:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [activeConversationId, isLoadingMore, hasMore, allMessages]);

    // Send message mutation
    // const { mutate: sendMessageMutate, isPending: isSendingMessage } =
    //     sendMessage();

    // Mark as read mutation
    // const { mutate: markAsReadMutate } = markConversationAsRead();

    // Create conversation mutation
    // const {
    //     mutate: createConversationMutate,
    //     isPending: isCreatingConversation,
    // } = createConversation();

    // Real-time message handling with Pusher
    const handleMessageSent = useCallback((data: MessageSentEvent) => {
        // Transform the event data to ChatMessage format
        const newMessage: ChatMessage = {
            id: data.id,
            conversationId: data.conversation_id,
            senderId: data.sender_id,
            sender: {
                id: data.sender.id,
                name: data.sender.name,
                avatar: "",
            },
            type: data.type as any,
            content: data.content,
            isRead: false,
            isEdited: false,
            isDeleted: false,
            createdAt: data.created_at,
        };

        setAllMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) {
                return prev;
            }
            return [...prev, newMessage];
        });
    }, []);

    // Subscribe to Pusher channel for real-time updates
    usePusher({
        conversationId: activeConversationId,
        onMessageSent: handleMessageSent,
        enabled: !!activeConversationId,
    });

    // Transform conversations to ConversationListItem format
    const conversationList: ConversationListItem[] = useMemo(() => {
        if (
            !mockConversationListItems ||
            mockConversationListItems.length === 0
        )
            return [];
        return mockConversationListItems.map((conv: any) => {
            const otherParticipant = conv?.participants?.[0]?.user;
            return {
                id: conv.id,
                type: conv.type,
                name: conv.name || otherParticipant?.name || "Unknown",
                user: {
                    id: otherParticipant?.id || 0,
                    name: otherParticipant?.name || "Unknown",
                    avatar:
                        otherParticipant?.image ||
                        otherParticipant?.avatar ||
                        "",
                },
                lastMessage:
                    conv.latestMessage?.content || conv.lastMessage?.content,
                lastMessageTime:
                    conv.latestMessage?.createdAt ||
                    conv.lastMessage?.createdAtFormatted,
                unreadCount: conv.unreadCount,
                isPinned: conv.isPinned,
                isMuted: conv.isMuted,
            };
        });
    }, [mockConversationListItems]);

    const activeConversation = useMemo(() => {
        if (!activeConversationId) return null;
        return (
            conversationList.find((c) => c.id === activeConversationId) || null
        );
    }, [activeConversationId, conversationList]);

    const handleSelectConversation = (id: number) => {
        setActiveConversationId(id);
        // Reset pagination state when switching conversations
        setAllMessages([]);
        setHasMore(true);
        // Mark conversation as read when selected
        // markAsReadMutate(id);
    };

    const handleSendMessage = (content: string, attachments?: File[]) => {
        if (!activeConversationId || !content.trim()) return;

        // sendMessageMutate(
        //     {
        //         conversationId: activeConversationId,
        //         data: {
        //             type:
        //                 attachments && attachments.length > 0
        //                     ? "image"
        //                     : "text",
        //             content,
        //             attachments,
        //         },
        //     },
        //     {
        //         onSuccess: () => {
        //             // refetchMessages();
        //         },
        //         onError: (error) => {
        //             handleMutationError(error, t("chat.failedToSendMessage"));
        //         },
        //     }
        // );
    };

    const handleCreateConversation = (userId: number) => {
        // createConversationMutate(
        //     { participant_id: userId },
        //     {
        //         onSuccess: (data) => {
        //             setIsNewConversationModalOpen(false);
        //             if (data?.id) {
        //                 setActiveConversationId(data.id);
        //             }
        //         },
        //         onError: (error) => {
        //             handleMutationError(
        //                 error,
        //                 t("chat.failedToCreateConversation")
        //             );
        //         },
        //     }
        // );
    };

    // if (isLoadingConversations) {
    //     return (
    //         <div className="h-[calc(100vh-150px)] flex items-center justify-center">
    //             <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="h-[calc(100vh-150px)] overflow-hidden sm:h-[calc(100vh-174px)] relative">
                <div className="flex flex-col h-full gap-6 xl:flex-row xl:gap-5">
                    <ChatSidebar
                        conversations={conversationList}
                        activeConversationId={activeConversationId}
                        onSelectConversation={handleSelectConversation}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onNewConversation={() =>
                            setIsNewConversationModalOpen(true)
                        }
                    />

                    <ChatBox
                        conversation={activeConversation}
                        messages={
                            allMessages.length > 0
                                ? allMessages
                                : mockChatMessages || []
                        }
                        onSendMessage={handleSendMessage}
                        // isLoading={isLoadingMessages}
                        // isSending={isSendingMessage}
                        currentUserId={user?.id}
                        onLoadMore={handleLoadMore}
                        hasMore={hasMore}
                        isLoadingMore={isLoadingMore}
                    />
                </div>
            </div>

            {/* New Conversation Modal */}
            <NewConversationModal
                isOpen={isNewConversationModalOpen}
                onClose={() => setIsNewConversationModalOpen(false)}
                onCreateConversation={handleCreateConversation}
                // isCreating={isCreatingConversation}
                users={mockChatUsers || []}
                // isLoadingUsers={isLoadingParticipants}
            />
        </>
    );
}
export default ChatPage;
