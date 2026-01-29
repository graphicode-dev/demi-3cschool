import type { ConversationListItem } from "../types";

interface ChatListItemProps {
    conversation: ConversationListItem;
    isActive: boolean;
    onClick: () => void;
}

export default function ChatListItem({
    conversation,
    isActive,
    onClick,
}: ChatListItemProps) {
    const { user, lastMessage, lastMessageTime, unreadCount } = conversation;

    return (
        <div
            onClick={onClick}
            className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-white/5 ${
                isActive ? "bg-gray-100 dark:bg-white/5" : ""
            }`}
        >
            <div className="relative h-12 w-full max-w-[48px] rounded-full">
                <img
                    src={(user as any)?.image || user.avatar || "/images/user/default-avatar.png"}
                    alt={user.name}
                    className="object-cover object-center w-full h-full overflow-hidden rounded-full"
                />
            </div>
            <div className="w-full">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                            {user.name}
                        </h5>
                        <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.role}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-gray-400 text-theme-xs whitespace-nowrap">
                            {lastMessageTime}
                        </span>
                        {unreadCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white rounded-full bg-brand-500">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
