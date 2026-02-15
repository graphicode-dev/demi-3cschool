import { useTranslation } from "react-i18next";
import { Check, Rocket, FileQuestion, Lock } from "lucide-react";
import { Tooltip } from "@/design-system";
import type { LessonVideo } from "../../types";

interface MissionPathProps {
    videos: LessonVideo[];
    currentVideoId: number;
    onVideoSelect: (videoId: number) => void;
    onQuizClick?: (videoId: number) => void;
}

export function MissionPath({
    videos,
    currentVideoId,
    onVideoSelect,
    onQuizClick,
}: MissionPathProps) {
    const { t } = useTranslation("selfStudy");

    const sortedVideos = [...videos].sort((a, b) => a.order - b.order);

    const handleVideoClick = (video: LessonVideo) => {
        if (video.status !== "locked") {
            onVideoSelect(video.id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm p-4 w-72">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Rocket className="size-5 text-brand-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t("lesson.missionPath")}
                </h3>
            </div>

            {/* Video List */}
            <div className="flex flex-col gap-2">
                {sortedVideos.map((video) => {
                    const isCompleted = video.status === "completed";
                    const isCurrent = video.id === currentVideoId;
                    const isLocked = video.status === "locked";
                    const hasQuiz = video.quiz && video.quiz.totalQuestions > 0;
                    const isVideoWatched = video.progress?.isCompleted;
                    const progressPercentage = video.progress?.progressPercentage || 0;

                    const videoButton = (
                        <button
                            key={video.id}
                            type="button"
                            onClick={() => handleVideoClick(video)}
                            disabled={isLocked}
                            className={`
                                flex flex-col p-3 rounded-xl transition-all w-full
                                ${isCurrent ? "bg-brand-50 dark:bg-brand-500/10 border border-brand-500" : ""}
                                ${isCompleted && !isCurrent ? "bg-gray-100/50 dark:bg-gray-800/50" : ""}
                                ${isLocked ? "bg-gray-100/50 dark:bg-gray-800/50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"}
                            `}
                        >
                            <div className="flex items-center justify-between w-full mb-2">
                                <div className="flex items-center gap-2">
                                    {/* Order Circle */}
                                    <div
                                        className={`
                                            flex items-center justify-center size-8 rounded-lg shadow-sm flex-shrink-0
                                            ${isCompleted ? "bg-success-500/60" : ""}
                                            ${isCurrent ? "bg-brand-500" : ""}
                                            ${isLocked ? "bg-gray-200 dark:bg-gray-700" : ""}
                                        `}
                                    >
                                        {isCompleted ? (
                                            <Check
                                                className="size-4 text-white"
                                                strokeWidth={3}
                                            />
                                        ) : (
                                            <span
                                                className={`
                                                    text-xs font-bold
                                                    ${isCurrent ? "text-white" : "text-gray-400"}
                                                `}
                                            >
                                                {video.order}
                                            </span>
                                        )}
                                    </div>

                                    {/* Video Info */}
                                    <div className="flex flex-col items-start max-w-[120px]">
                                        <span
                                            className={`
                                                text-xs font-bold text-start line-clamp-2
                                                ${isCompleted ? "text-gray-500 dark:text-gray-400" : ""}
                                                ${isCurrent ? "text-gray-900 dark:text-white" : ""}
                                                ${isLocked ? "text-gray-400 dark:text-gray-500" : ""}
                                            `}
                                        >
                                            {video.title}
                                        </span>
                                        <span
                                            className={`
                                                text-xs font-semibold
                                                ${isCompleted || isLocked ? "text-gray-400/50" : "text-gray-500"}
                                            `}
                                        >
                                            {video.duration} {t("common.min")}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div
                                    className={`
                                        flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold flex-shrink-0
                                        ${isCompleted && video.quizStatus === "passed" ? "bg-success-500 text-white" : ""}
                                        ${isCurrent && video.quizStatus === "pending" ? "bg-brand-500 text-white" : ""}
                                        ${isLocked || video.quizStatus === "locked" ? "bg-gray-200 dark:bg-gray-700 text-gray-400" : ""}
                                    `}
                                >
                                    {isCompleted &&
                                        video.quizStatus === "passed" && (
                                            <>
                                                <Check
                                                    className="size-2.5"
                                                    strokeWidth={3}
                                                />
                                                <span>{t("lesson.done")}</span>
                                            </>
                                        )}
                                    {isCurrent &&
                                        video.quizStatus === "pending" &&
                                        hasQuiz && (
                                            <Tooltip
                                                content={t(
                                                    "lesson.finishVideoFirst"
                                                )}
                                                placement="top"
                                                disabled={isVideoWatched}
                                                childClassName="w-[200px]"
                                            >
                                                <span
                                                    className={`flex items-center gap-1 ${isVideoWatched ? "cursor-pointer hover:opacity-80" : ""}`}
                                                    onClick={(e) => {
                                                        if (
                                                            isVideoWatched &&
                                                            onQuizClick
                                                        ) {
                                                            e.stopPropagation();
                                                            onQuizClick(video.id);
                                                        }
                                                    }}
                                                >
                                                    <FileQuestion className="size-2.5" />
                                                    <span>
                                                        {t("lesson.quizLabel")}
                                                    </span>
                                                </span>
                                            </Tooltip>
                                        )}
                                    {(isLocked || video.quizStatus === "locked") &&
                                        hasQuiz && (
                                            <>
                                                <Lock className="size-2.5" />
                                                <span>{t("lesson.quizLabel")}</span>
                                            </>
                                        )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            {!isLocked && progressPercentage > 0 && (
                                <div className="w-full mt-1">
                                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                isCompleted
                                                    ? "bg-success-500"
                                                    : "bg-brand-500"
                                            }`}
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </button>
                    );

                    if (isLocked) {
                        return (
                            <Tooltip
                                key={video.id}
                                content={t("lesson.passQuizToUnlock")}
                                placement="left"
                            >
                                {videoButton}
                            </Tooltip>
                        );
                    }

                    return videoButton;
                })}
            </div>
        </div>
    );
}

export default MissionPath;