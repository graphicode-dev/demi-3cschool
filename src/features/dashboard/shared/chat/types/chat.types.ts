// Chat Types

export type UserStatus = "online" | "offline" | "away" | "busy";
export type MessageType =
    | "text"
    | "image"
    | "file"
    | "audio"
    | "video"
    | "system";

export interface ChatUser {
    id: number;
    name: string;
    role?: string;
    avatar: string;
    status?: UserStatus;
    lastSeen?: string;
}

export interface ChatAttachment {
    id: number;
    name: string;
    url: string;
    type: "image" | "file" | "audio" | "video";
    size?: number;
    mimeType?: string;
}

export interface ChatMessage {
    id: number;
    conversationId: number;
    senderId: number;
    sender: ChatUser;
    type: MessageType;
    content: string;
    attachments?: ChatAttachment[];
    replyTo?: ChatMessage;
    isRead: boolean;
    isEdited: boolean;
    isDeleted: boolean;
    editedAt?: string;
    createdAt: string;
    createdAtFormatted?: string;
}

export interface ConversationParticipant {
    id: number;
    userId: number;
    user: ChatUser;
    joinedAt: string;
    lastReadAt?: string;
}

export interface Conversation {
    id: number;
    type: "private" | "group";
    name?: string;
    participants: ConversationParticipant[];
    lastMessage?: ChatMessage;
    unreadCount: number;
    isPinned: boolean;
    isMuted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ConversationListItem {
    id: number;
    type: "private" | "group";
    name: string;
    user: ChatUser;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount: number;
    isPinned: boolean;
    isMuted: boolean;
}

// Payload types for API requests
export interface CreateConversationPayload {
    participant_id: number;
}

export interface SendMessagePayload {
    type: MessageType;
    content: string;
    reply_to_id?: number;
    attachments?: File[];
}

export interface EditMessagePayload {
    content: string;
}

// API Response types
export interface ConversationApiResponse {
    success: boolean;
    message: string;
    data: Conversation;
}

export interface ConversationListApiResponse {
    success: boolean;
    message: string;
    data: Conversation[];
}

export interface MessageApiResponse {
    success: boolean;
    message: string;
    data: ChatMessage;
}

export interface MessageListApiResponse {
    success: boolean;
    message: string;
    data: ChatMessage[];
}

// WebSocket Event types
export interface MessageSentEvent {
    id: number;
    conversation_id: number;
    sender_id: number;
    sender: ChatUser;
    type: MessageType;
    content: string;
    created_at: string;
}

export interface MessageReadEvent {
    conversation_id: number;
    user_id: number;
    message_ids: number[];
    read_at: string;
}

export interface UserTypingEvent {
    conversation_id: number;
    user_id: number;
    user_name: string;
    is_typing: boolean;
}
