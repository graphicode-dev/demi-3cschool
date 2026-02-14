import { useTranslation } from "react-i18next";
import { X, Star, User } from "lucide-react";
import { StudentReview } from "../types";

interface ReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    reviews: StudentReview[];
    sessionTopic: string;
}

export function ReviewsModal({
    isOpen,
    onClose,
    reviews,
    sessionTopic,
}: ReviewsModalProps) {
    const { t } = useTranslation("virtualSessions");

    if (!isOpen) return null;

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {t("reviews.title")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {sessionTopic}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* Average Rating */}
                <div className="flex items-center justify-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`size-5 ${
                                        star <= Math.round(averageRating)
                                            ? "text-warning-400 fill-warning-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {averageRating.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("reviews.totalReviews", { count: reviews.length })}
                    </span>
                </div>

                {/* Reviews List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <Star className="size-12 mb-2 text-gray-300 dark:text-gray-600" />
                            <p>{t("reviews.noReviews")}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                {review.studentAvatar ? (
                                                    <img
                                                        src={
                                                            review.studentAvatar
                                                        }
                                                        alt={review.studentName}
                                                        className="size-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="size-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {review.studentName}
                                                </p>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className={`size-3.5 ${
                                                                    star <=
                                                                    review.rating
                                                                        ? "text-warning-400 fill-warning-400"
                                                                        : "text-gray-300 dark:text-gray-600"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                            "{review.comment}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                    >
                        {t("reviews.close")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReviewsModal;
