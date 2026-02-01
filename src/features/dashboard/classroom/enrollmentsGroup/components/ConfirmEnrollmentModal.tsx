/**
 * ConfirmEnrollmentModal Component
 *
 * Modal to confirm enrollment in a group.
 * Different designs for online (users icon, blue theme) vs offline (location icon, orange theme).
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
                <div className="flex justify-center mb-5">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            isOffline
                                ? "bg-warning-100 dark:bg-warning-500/20"
                                : "bg-warning-100 dark:bg-warning-500/20"
                        }`}
                    >
                        {isOffline ? (
                            <MapPin className="size-8 text-warning-500" />
                        ) : (
                            <Users className="size-8 text-warning-500" />
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    {isOffline
                        ? t(
                              "confirmModal.titleOffline",
                              "Confirm your offline session"
                          )
                        : t("confirmModal.titleOnline", "Confirm your group")}
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    {isOffline
                        ? t("confirmModal.subtitleOffline", {
                              day: t(`days.${group.day}`),
                              defaultValue: `You Are About To Join The ${t(`days.${group.day}`)} Offline Session.`,
                          })
                        : t("confirmModal.subtitleOnline", {
                              day: t(`days.${group.day}`),
                              defaultValue: `You Are About To Join The ${t(`days.${group.day}`)} Group.`,
                          })}
                </p>

                {/* Details */}
                <div className="space-y-0 mb-6">
                    {isOffline && group.location && (
                        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t("center", "Center")}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {group.location}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("sessionType", "Session Type")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {isOffline
                                ? t("offline", "Offline")
                                : t("online", "Online")}
                        </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("day", "Day")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {t(`days.${group.day}`)}
                        </span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {t("time", "Time")}
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
                                ? t(
                                      "confirmModal.warningOffline",
                                      "Please arrive 10 minutes early at the center. Bring your laptop and charger!"
                                  )
                                : t(
                                      "confirmModal.warningOnline",
                                      "Please make sure this time works for you."
                                  )}
                        </span>
                        <span className="text-sm font-semibold text-warning-600 dark:text-warning-400">
                            {t(
                                "confirmModal.cantChange",
                                "You can't change your group after joining."
                            )}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
                    >
                        {t("confirmModal.confirmButton", "Confirm & Join")}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t("confirmModal.backButton", "Back")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmEnrollmentModal;
