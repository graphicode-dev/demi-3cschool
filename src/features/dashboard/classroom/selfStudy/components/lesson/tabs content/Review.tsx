import { Star } from "lucide-react";
import { TFunction } from "i18next";
import RatingModal from "../RatingModal";
import { useState } from "react";

export const ReviewTab = ({ t }: { t: TFunction<"selfStudy", undefined> }) => {
    const [showRatingModal, setShowRatingModal] = useState(false);

    return (
        <div className="flex flex-col items-center py-6">
            {/* Stars Display */}
            <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`size-8 ${
                            star <= 4
                                ? "text-warning-400 fill-warning-400"
                                : "text-warning-400 fill-warning-400"
                        }`}
                    />
                ))}
            </div>

            {/* Rating Score */}
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                4.8 / 5
            </p>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                {t("lesson.review.helpUsImprove")}
            </p>

            {/* Rate Button */}
            <button
                onClick={() => setShowRatingModal(true)}
                className="px-6 py-2.5 border-2 border-brand-500 text-brand-500 font-semibold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
            >
                {t("lesson.review.rateThisLesson")}
            </button>

            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={(rating: number, feedback: string) => {
                    console.log("Rating:", rating, "Feedback:", feedback);
                    setShowRatingModal(false);
                }}
            />
        </div>
    );
};
