import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Search, Loader2 } from "lucide-react";
import { ChatUser } from "../types";

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateConversation: (userId: number) => void;
    isCreating?: boolean;
    users?: ChatUser[];
    isLoadingUsers?: boolean;
}

export default function NewConversationModal({
    isOpen,
    onClose,
    onCreateConversation,
    isCreating,
    users = [],
    isLoadingUsers,
}: NewConversationModalProps) {
    const { t } = useTranslation("chat");
    const [searchQuery, setSearchQuery] = useState("");

    if (!isOpen) return null;

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("chat.newConversation")}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t("chat.searchUsers")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Users List */}
                <div className="max-h-80 overflow-y-auto p-2">
                    {isLoadingUsers ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {searchQuery
                                    ? t("chat.noUsersFound")
                                    : t("chat.noUsersAvailable")}
                            </p>
                        </div>
                    ) : (
                        filteredUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => onCreateConversation(user.id)}
                                disabled={isCreating}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            user.avatar ||
                                            "/images/user/default-avatar.png"
                                        }
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {user.status === "online" && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.name}
                                    </p>
                                    {user.role && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {typeof user.role === "object"
                                                ? (user.role as any)?.name
                                                : user.role}
                                        </p>
                                    )}
                                </div>
                                {isCreating && (
                                    <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
