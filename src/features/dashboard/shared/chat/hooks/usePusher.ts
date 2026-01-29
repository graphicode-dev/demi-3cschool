import { useEffect, useRef, useCallback } from "react";
import { getToken } from "@/utils";

// Declare global Pusher from CDN
declare global {
    interface Window {
        Pusher: any;
    }
}

// Pusher configuration
const PUSHER_KEY =
    import.meta.env.VITE_PUSHER_APP_KEY || "35c4f5e21f814dbb9e0e";
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_APP_CLUSTER || "eu";

// Event data structures from Laravel backend
export interface MessageSentEvent {
    id: number;
    conversation_id: number;
    sender_id: number;
    sender: {
        id: number;
        name: string;
    };
    type: string;
    content: string;
    reply_to_id: number | null;
    created_at: string;
}

export interface UserTypingEvent {
    conversation_id: number;
    user_id: number;
    user_name: string;
    is_typing: boolean;
}

export interface MessageReadEvent {
    conversation_id: number;
    message_id: number;
    user_id: number;
}

interface UsePusherOptions {
    conversationId: number | null;
    onMessageSent?: (data: MessageSentEvent) => void;
    onUserTyping?: (data: UserTypingEvent) => void;
    onMessageRead?: (data: MessageReadEvent) => void;
    enabled?: boolean;
}

export const usePusher = ({
    conversationId,
    onMessageSent,
    onUserTyping,
    onMessageRead,
    enabled = true,
}: UsePusherOptions) => {
    const pusherRef = useRef<any>(null);
    const channelRef = useRef<any>(null);

    const getAuthToken = useCallback(() => {
        return getToken() || "";
    }, []);

    useEffect(() => {
        if (!enabled || !conversationId || !window.Pusher) {
            return;
        }

        // Initialize Pusher
        if (!pusherRef.current) {
            // Enable logging in development
            if (import.meta.env.DEV) {
                window.Pusher.logToConsole = true;
            }

            pusherRef.current = new window.Pusher(PUSHER_KEY, {
                cluster: PUSHER_CLUSTER,
                authEndpoint: `${import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000"}/broadcasting/auth`,
                auth: {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                        Accept: "application/json",
                    },
                },
            });
        }

        // Subscribe to private conversation channel
        const channelName = `private-conversation.${conversationId}`;
        channelRef.current = pusherRef.current.subscribe(channelName);

        // Bind to message.sent event
        if (onMessageSent) {
            channelRef.current.bind(
                "message.sent",
                (data: MessageSentEvent) => {
                    onMessageSent(data);
                }
            );
        }

        // Bind to user.typing event
        if (onUserTyping) {
            channelRef.current.bind("user.typing", (data: UserTypingEvent) => {
                onUserTyping(data);
            });
        }

        // Bind to message.read event
        if (onMessageRead) {
            channelRef.current.bind(
                "message.read",
                (data: MessageReadEvent) => {
                    onMessageRead(data);
                }
            );
        }

        // Cleanup on unmount or conversation change
        return () => {
            if (channelRef.current) {
                channelRef.current.unbind_all();
                pusherRef.current?.unsubscribe(channelName);
                channelRef.current = null;
            }
        };
    }, [
        conversationId,
        enabled,
        onMessageSent,
        onUserTyping,
        onMessageRead,
        getAuthToken,
    ]);

    // Cleanup Pusher on unmount
    useEffect(() => {
        return () => {
            if (pusherRef.current) {
                pusherRef.current.disconnect();
                pusherRef.current = null;
            }
        };
    }, []);

    return {
        pusher: pusherRef.current,
        channel: channelRef.current,
    };
};

export default usePusher;
