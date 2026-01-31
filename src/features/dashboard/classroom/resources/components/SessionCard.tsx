/**
 * Session Card Component
 *
 * Displays a session card with title and resource count.
 */

import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { Session } from "../types";

interface SessionCardProps {
    session: Session;
    onClick: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
    const { t } = useTranslation("resources");

    return (
        <button
            onClick={onClick}
            className="relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow text-left group overflow-hidden"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-brand-500" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-2">
                        {session.title}
                    </h3>
                    <p className="text-xs text-brand-500 mt-1">
                        {session.resourceCount}{" "}
                        {t("resources.resourceCount", "Resources")}
                    </p>
                </div>

                {/* Decorative blob */}
                <div className="absolute -bottom-5 -right-5 w-15 h-15 rounded-full bg-brand-100 dark:bg-brand-900 opacity-50 shrink-0" />
            </div>
        </button>
    );
}

export default SessionCard;
