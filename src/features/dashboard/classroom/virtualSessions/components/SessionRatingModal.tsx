import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Star, MessageSquare, Send } from "lucide-react";

interface SessionRatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, feedback: string) => void;
    initialRating?: number;
    initialComment?: string;
    isSubmitting?: boolean;
}

export function SessionRatingModal({
    isOpen,
    onClose,
    onSubmit,
    initialRating = 0,
    initialComment = "",
    isSubmitting = false,
}: SessionRatingModalProps) {
    const { t } = useTranslation("virtualSessions");
    const [rating, setRating] = useState(initialRating);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState(initialComment);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, feedback);
            setRating(0);
            setFeedback("");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in duration-200">
                {/* Star Icon */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center size-16 rounded-full bg-brand-100 dark:bg-brand-500/20">
                        <Star className="size-8 text-brand-500 fill-brand-500" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-1">
                    {t("rating.modal.title")}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                    {t("rating.modal.subtitle")}
                </p>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`size-10 transition-colors ${
                                    star <= (hoveredRating || rating)
                                        ? "text-warning-400 fill-warning-400"
                                        : "text-gray-300 dark:text-gray-600"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Feedback Input */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="size-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {t("rating.modal.feedbackLabel")}
                        </span>
                    </div>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={t("rating.modal.feedbackPlaceholder")}
                        className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="size-4" />
                    {isSubmitting
                        ? t("rating.modal.submitting")
                        : t("rating.modal.submit")}
                </button>
            </div>
        </div>
    );
}

export default SessionRatingModal;
