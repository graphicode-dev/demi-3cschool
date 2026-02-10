import { Star, Loader2 } from "lucide-react";
import { TFunction } from "i18next";
import RatingModal from "../RatingModal";
import { useState } from "react";
import {
    useContentReview,
    useCreateContentReview,
} from "../../../api/sessionReview.queries";

interface ReviewTabProps {
    t: TFunction<"selfStudy", undefined>;
    sessionId: number;
}

export const ReviewTab = ({ t, sessionId }: ReviewTabProps) => {
    const [showRatingModal, setShowRatingModal] = useState(false);

    // Fetch existing content review
    const { data: existingReview, isLoading } = useContentReview(sessionId);

    // Mutation for creating/updating review
    const { mutate: submitReview, isPending: isSubmitting } =
        useCreateContentReview({
            onSuccess: () => {
                setShowRatingModal(false);
            },
        });

    const handleSubmitReview = (rating: number, feedback: string) => {
        submitReview({
            sessionId,
            payload: {
                rate: rating,
                comment: feedback,
            },
        });
    };

    const currentRating = existingReview?.rate ?? 0;
    const hasReview = !!existingReview;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-brand-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-6">
            {/* Stars Display */}
            <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-8 ${
                            star <= currentRating
                                ? "text-warning-400 fill-warning-400"
                                : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                ))}
            </div>

            {/* Rating Score */}
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {hasReview
                    ? `${currentRating} / 5`
                    : t("lesson.review.noRating")}
            </p>

            {/* Comment if exists */}
            {existingReview?.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 max-w-md italic">
                    "{existingReview.comment}"
                </p>
            )}

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                {hasReview
                    ? t("lesson.review.thankYou")
                    : t("lesson.review.helpUsImprove")}
            </p>

            {/* Rate Button */}
            <button
                onClick={() => setShowRatingModal(true)}
                disabled={isSubmitting}
                className="px-6 py-2.5 border-2 border-brand-500 text-brand-500 font-semibold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors disabled:opacity-50"
            >
                {hasReview
                    ? t("lesson.review.updateRating")
                    : t("lesson.review.rateThisLesson")}
            </button>

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleSubmitReview}
                initialRating={currentRating}
                initialComment={existingReview?.comment}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};
