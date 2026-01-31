/**
 * ConfirmEnrollmentModal Component
 *
 * Modal to confirm enrollment in a group.
 */

import { useTranslation } from "react-i18next";
import { Users, MapPin, CheckSquare } from "lucide-react";
import type { EnrollmentGroup } from "../types";

interface ConfirmEnrollmentModalProps {
    group: EnrollmentGroup;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmEnrollmentModal({
    group,
    isOpen,
    onClose,
    onConfirm,
}: ConfirmEnrollmentModalProps) {
    const { t } = useTranslation("enrollmentsGroup");
    const isOffline = group.sessionType === "offline";

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            isOffline
                                ? "bg-warning-100 dark:bg-warning-500/20"
                                : "bg-brand-100 dark:bg-brand-500/20"
                        }`}
                    >
                        {isOffline ? (
                            <MapPin
                                className={`size-8 ${isOffline ? "text-warning-500" : "text-brand-500"}`}
                            />
                        ) : (
                            <Users className="size-8 text-brand-500" />
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    {isOffline
                        ? t("confirmModal.titleOffline")
                        : t("confirmModal.titleOnline")}
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    {t("confirmModal.subtitle", {
                        day: t(`days.${group.day}`),
                    })}
                </p>

                {/* Details */}
                <div className="space-y-3 mb-6">
                    {isOffline && group.location && (
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t("center")}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {group.location}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("sessionType")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {isOffline ? t("offline") : t("online")}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("day")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {t(`days.${group.day}`)}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("time")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {group.startTime} - {group.endTime}
                        </span>
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-brand-50 dark:bg-brand-500/10 rounded-xl mb-6">
                    <CheckSquare className="size-5 text-brand-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {isOffline
                                ? t("confirmModal.warningOffline")
                                : t("confirmModal.warningOnline")}
                        </span>
                        <span className="text-sm font-semibold text-warning-600 dark:text-warning-400">
                            {t("confirmModal.cantChange")}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
                    >
                        {t("confirmModal.confirmButton")}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t("confirmModal.backButton")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmEnrollmentModal;
