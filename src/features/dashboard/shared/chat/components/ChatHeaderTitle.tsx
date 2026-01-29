import { useTranslation } from "react-i18next";

export default function ChatHeaderTitle() {
    const { t } = useTranslation("chat");
    return (
        <div className="flex items-start justify-between">
            <div>
                <h3 className="font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                    {t("chat.chats")}
                </h3>
            </div>
        </div>
    );
}
