import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, PartyPopper, ArrowRight, RotateCcw, X } from "lucide-react";
import type { VideoQuiz } from "../../types";

const MAX_ATTEMPTS = 3;

interface VideoQuizModalProps {
    quiz: VideoQuiz;
    videoTitle: string;
    attemptsUsed: number;
    onComplete: (passed: boolean) => void;
    onRetry: () => void;
    onClose: () => void;
}

export function VideoQuizModal({
    quiz,
    videoTitle,
    attemptsUsed,
    onComplete,
    onRetry,
    onClose,
}: VideoQuizModalProps) {
    const { t } = useTranslation("selfStudy");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const isPassed = correctAnswers >= quiz.passingScore;
    const attemptsRemaining = MAX_ATTEMPTS - attemptsUsed - 1;
    const canRetry = !isPassed && attemptsRemaining > 0;

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        if (isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
        } else {
            setIsCompleted(true);
            setShowResult(true);
        }
    };

    const handleContinue = () => {
        onComplete(isPassed);
        onClose();
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setCorrectAnswers(0);
        setIsCompleted(false);
        setShowResult(false);
        onRetry();
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center gap-4 p-6">
                {isPassed ? (
                    <>
                        <div className="bg-success-100 dark:bg-success-500/20 rounded-full p-4">
                            <PartyPopper className="size-12 text-success-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t("lesson.quizPassed")}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            {t("lesson.quizPassedDescription")}
                        </p>
                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 bg-success-500 hover:bg-success-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors w-full justify-center mt-4"
                        >
                            {t("lesson.continueLearning")}
                            <ArrowRight className="size-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <div className="bg-error-100 dark:bg-error-500/20 rounded-full p-4">
                            <X className="size-12 text-error-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t("lesson.quizFailed")}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            {canRetry
                                ? t("lesson.quizFailedDescription")
                                : t("lesson.noAttemptsLeft")}
                        </p>
                        {canRetry && (
                            <p className="text-xs text-warning-500 font-medium">
                                {t("lesson.attemptsRemaining", {
                                    count: attemptsRemaining,
                                })}
                            </p>
                        )}
                        <div className="flex gap-2 w-full mt-4">
                            {canRetry ? (
                                <button
                                    onClick={handleRetry}
                                    className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors w-full justify-center"
                                >
                                    <RotateCcw className="size-4" />
                                    {t("lesson.retryQuiz")}
                                </button>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors w-full justify-center"
                                >
                                    {t("lesson.close")}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Question Header */}
            <div className="flex items-center gap-2">
                <div className="bg-brand-500 rounded-full size-6 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">?</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t("lesson.questionOf", {
                        current: currentQuestionIndex + 1,
                        total: totalQuestions,
                    })}
                </span>
            </div>

            {/* Question */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedAnswer(index)}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                            ${
                                selectedAnswer === index
                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }
                        `}
                    >
                        <div
                            className={`
                                size-5 rounded-full border-2 flex items-center justify-center shrink-0
                                ${
                                    selectedAnswer === index
                                        ? "border-brand-500 bg-brand-500"
                                        : "border-gray-300 dark:border-gray-600"
                                }
                            `}
                        >
                            {selectedAnswer === index && (
                                <Check
                                    className="size-3 text-white"
                                    strokeWidth={3}
                                />
                            )}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {option}
                        </span>
                    </button>
                ))}
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className={`
                    w-full py-3 rounded-xl font-semibold text-sm transition-colors
                    ${
                        selectedAnswer !== null
                            ? "bg-brand-500 hover:bg-brand-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    }
                `}
            >
                {t("lesson.submitAnswer")}
            </button>
        </div>
    );
}

export default VideoQuizModal;
