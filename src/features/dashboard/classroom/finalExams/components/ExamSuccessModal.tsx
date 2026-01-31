import { useTranslation } from "react-i18next";
import { CheckCircle, PartyPopper } from "lucide-react";

interface ExamSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ExamSuccessModal({ isOpen, onClose }: ExamSuccessModalProps) {
    const { t } = useTranslation("finalExams");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center size-16 rounded-full bg-success-100 dark:bg-success-500/20">
                        <CheckCircle className="size-10 text-success-500" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                    {t("successModal.title")}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
                    {t("successModal.subtitle")}
                </p>

                {/* Success Message Box */}
                <div className="bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <PartyPopper className="size-5 text-success-600 dark:text-success-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-success-700 dark:text-success-400 text-sm">
                                {t("successModal.congratulations")}
                            </p>
                            <p className="text-success-600 dark:text-success-500 text-xs mt-1">
                                {t("successModal.viewResultsLater")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                >
                    {t("successModal.backToExams")}
                </button>
            </div>
        </div>
    );
}

export default ExamSuccessModal;
