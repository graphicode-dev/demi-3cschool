import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Check, PartyPopper, ArrowRight, RotateCcw, X } from "lucide-react";
import { LessonQuiz } from "@/features/dashboard/admin/learning/pages/lessons/types";

interface QuizOption {
    id: string | number;
    text: string;
}

interface QuizQuestion {
    id: string | number;
    question: string;
    options: QuizOption[];
    correctAnswer: number;
}

interface QuizAnswer {
    questionId: string;
    selectedAnswer: number;
    optionId: string;
}

interface LessonQuizModalProps {
    quiz: LessonQuiz;
    attemptId: string;
    questions: QuizQuestion[];
    attemptsUsed: number;
    onComplete: (passed: boolean, answers: QuizAnswer[]) => void;
    onAnswerSubmit: (
        questionId: number,
        optionId: number,
        textAnswer: string
    ) => Promise<void>;
    onRetry: () => void;
    onClose: () => void;
}

export function LessonQuizModal({
    quiz,
    attemptId,
    questions,
    attemptsUsed,
    onComplete,
    onAnswerSubmit,
    onRetry,
    onClose,
}: LessonQuizModalProps) {
    const { t } = useTranslation("selfStudy");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60); // Convert minutes to seconds
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = scorePercentage >= quiz.passingScore;
    const attemptsRemaining = quiz.maxAttempts - attemptsUsed - 1;
    const canRetry = !isPassed && attemptsRemaining > 0;

    // Timer effect
    useEffect(() => {
        if (isCompleted || showResult) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    // Time's up - auto-submit quiz
                    setIsCompleted(true);
                    setShowResult(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isCompleted, showResult]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSubmitAnswer = async () => {
        if (selectedAnswer === null || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
            const selectedOption = currentQuestion.options[selectedAnswer];

            // Submit answer to API
            await onAnswerSubmit(
                currentQuestion.id as number,
                selectedOption.id as number,
                ""
            );

            // Track answer
            const answer: QuizAnswer = {
                questionId: String(currentQuestion.id),
                selectedAnswer,
                optionId: String(selectedOption.id),
            };
            setAnswers((prev) => [...prev, answer]);

            if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
            }

            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedAnswer(null);
            } else {
                setIsCompleted(true);
                setShowResult(true);
                // Call onComplete with all answers
                onComplete(scorePercentage >= quiz.passingScore, [
                    ...answers,
                    answer,
                ]);
            }
        } catch (error) {
            console.error("Error submitting answer:", error);
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = () => {
        onClose();
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setCorrectAnswers(0);
        setAnswers([]);
        setIsCompleted(false);
        setShowResult(false);
        setTimeRemaining(quiz.timeLimit * 60);
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
                        <div className="text-center">
                            <p className="text-3xl font-bold text-success-500 mb-2">
                                {scorePercentage}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("lesson.quizPassedDescription")}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {correctAnswers} {t("lesson.quiz.outOf")}{" "}
                                {totalQuestions} {t("lesson.quiz.correct")}
                            </p>
                        </div>
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
                        <div className="text-center">
                            <p className="text-3xl font-bold text-error-500 mb-2">
                                {scorePercentage}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {canRetry
                                    ? t("lesson.quizFailedDescription")
                                    : t("lesson.noAttemptsLeft")}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {t("lesson.quiz.requiredScore")}:{" "}
                                {quiz.passingScore}%
                            </p>
                        </div>
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
            {/* Header with Timer and Progress */}
            <div className="flex items-center justify-between">
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

                {/* Timer */}
                <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                        timeRemaining <= 60
                            ? "bg-error-100 dark:bg-error-500/20"
                            : "bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                    <span
                        className={`text-sm font-semibold ${
                            timeRemaining <= 60
                                ? "text-error-500"
                                : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                    className="bg-brand-500 h-1.5 rounded-full transition-all duration-300"
                    style={{
                        width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                    }}
                />
            </div>

            {/* Question */}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                {currentQuestion.question}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedAnswer(index)}
                        disabled={isSubmitting}
                        className={`
                            flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                            ${
                                selectedAnswer === index
                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                            }
                            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
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
                            {option.text}
                        </span>
                    </button>
                ))}
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null || isSubmitting}
                className={`
                    w-full py-3 rounded-xl font-semibold text-sm transition-colors
                    ${
                        selectedAnswer !== null && !isSubmitting
                            ? "bg-brand-500 hover:bg-brand-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    }
                `}
            >
                {isSubmitting
                    ? t("lesson.quiz.submitting")
                    : currentQuestionIndex < totalQuestions - 1
                      ? t("lesson.submitAnswer")
                      : t("lesson.quiz.finishQuiz")}
            </button>
        </div>
    );
}

export default LessonQuizModal;
