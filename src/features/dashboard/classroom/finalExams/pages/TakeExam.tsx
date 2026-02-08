import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import PreExam from "./PreExam";
import { ExamSuccessModal } from "../components";
import type { FinalExamQuestion } from "../types";
import {
    PageWrapper,
    ErrorState,
    LoadingState,
    useToast,
} from "@/design-system";
import {
    useExam,
    useStartExam,
    useSubmitAnswer,
    useCompleteExam,
} from "../api";
import { finalExamsPaths } from "../navigation";
import {
    USE_MOCK_DATA,
    MOCK_EXAM_WITH_QUESTIONS,
    MOCK_ATTEMPT,
} from "../mocks";

interface QuizData {
    id: number;
    title: string;
    questions: FinalExamQuestion[];
    timeLimit?: number;
}

export function TakeExamPage() {
    const { t } = useTranslation("finalExams");
    const navigate = useNavigate();
    const { examId } = useParams<{ examId: string }>();
    const { addToast, addAlertToast } = useToast();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const submittingAnswerRef = useRef(false);

    // Fetch exam data
    const {
        data: realExam,
        isLoading: examLoading,
        error: examError,
    } = useExam(examId ?? "", { enabled: !!examId && !USE_MOCK_DATA });

    const exam = USE_MOCK_DATA ? MOCK_EXAM_WITH_QUESTIONS : realExam;

    const { mutateAsync: startExamMutation } = useStartExam();
    const { mutateAsync: submitAnswerMutation } = useSubmitAnswer();
    const { mutateAsync: completeExamMutation } = useCompleteExam();

    // Initialize timer when exam starts
    useEffect(() => {
        if (attemptId && quiz?.timeLimit) {
            setTimeLeft(quiz.timeLimit * 60);
        }
    }, [attemptId, quiz?.timeLimit]);

    // Timer countdown
    useEffect(() => {
        if (!attemptId || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    addToast({
                        type: "warning",
                        title: t("exam.timeUp"),
                        message: t("exam.timeUpMessage"),
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [attemptId, timeLeft, addToast, t]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Handle answer selection
    const handleAnswerSelect = async (questionId: number, optionId: number) => {
        if (!attemptId || submittingAnswerRef.current) return;

        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        if (!USE_MOCK_DATA) {
            submittingAnswerRef.current = true;
            try {
                await submitAnswerMutation({
                    attemptId,
                    questionId: String(questionId),
                    data: { selectedOptionId: optionId },
                });
            } catch (error) {
                console.error("Failed to submit answer:", error);
            } finally {
                submittingAnswerRef.current = false;
            }
        }
    };

    // Start the exam
    const startExam = async () => {
        if (!exam) {
            addToast({
                type: "error",
                title: t("exam.error"),
                message: t("exam.noExamAvailable"),
            });
            return;
        }

        setIsStarting(true);
        try {
            let newAttemptId: string;

            if (USE_MOCK_DATA) {
                newAttemptId = String(MOCK_ATTEMPT.id);
            } else {
                const response = await startExamMutation(String(exam.id));
                newAttemptId = String(response.id);
            }

            if (newAttemptId) {
                setAttemptId(newAttemptId);
                setQuiz({
                    id: exam.id,
                    title: exam.title,
                    questions: exam.questions || [],
                    timeLimit: exam.duration,
                });
            }
        } catch (error: any) {
            addToast({
                type: "error",
                title: t("exam.startFailed"),
                message: error?.message || t("exam.failedToStart"),
            });
        } finally {
            setIsStarting(false);
        }
    };

    // Complete the exam
    const handleCompleteExam = useCallback(async () => {
        if (!attemptId) return;

        setIsSubmitting(true);
        try {
            if (!USE_MOCK_DATA) {
                await completeExamMutation(attemptId);
            }

            setShowSuccessModal(true);
        } catch (error: any) {
            addToast({
                type: "error",
                title: t("exam.submissionFailed"),
                message: error?.message || t("exam.failedToSubmit"),
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [attemptId, completeExamMutation, addToast, t]);

    const confirmSubmit = () => {
        const answeredCount = Object.keys(answers).length;
        const unansweredCount = (quiz?.questions?.length || 0) - answeredCount;

        if (unansweredCount > 0) {
            addAlertToast(
                t("exam.submitTitle"),
                t("exam.unansweredWarning", { count: unansweredCount }),
                [
                    {
                        text: t("exam.cancel"),
                        onClick: () => {},
                        variant: "secondary",
                    },
                    {
                        text: t("exam.submitAnyway"),
                        onClick: handleCompleteExam,
                        variant: "danger",
                    },
                ]
            );
        } else {
            addAlertToast(t("exam.submitTitle"), t("exam.submitConfirmation"), [
                {
                    text: t("exam.cancel"),
                    onClick: () => {},
                    variant: "secondary",
                },
                {
                    text: t("exam.submit"),
                    onClick: handleCompleteExam,
                    variant: "primary",
                },
            ]);
        }
    };

    const handleBackToExams = () => {
        setShowSuccessModal(false);
        navigate(finalExamsPaths.list());
    };

    // Loading state
    if (examLoading) return <LoadingState />;

    // Error state
    if (examError) {
        return (
            <ErrorState
                title={t("exam.failedToLoad")}
                message={(examError as any)?.message || t("exam.unknownError")}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // No exam available
    if (!exam) {
        return (
            <ErrorState
                title={t("exam.noExamAvailable")}
                message={t("exam.examNotFound")}
            />
        );
    }

    // Pre-exam screen
    if (!attemptId) {
        return (
            <PreExam
                exam={exam}
                onStartExam={startExam}
                isStarting={isStarting}
                isAgreed={isAgreed}
                onAgreeChange={setIsAgreed}
            />
        );
    }

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <ErrorState
                title={t("exam.failedToLoad")}
                message={t("exam.noQuestions")}
                onRetry={() => window.location.reload()}
            />
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const questionsCount = quiz.questions.length;
    const isLastQuestion = currentQuestionIndex === questionsCount - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
        <PageWrapper>
            {/* Success Modal */}
            <ExamSuccessModal
                isOpen={showSuccessModal}
                onClose={handleBackToExams}
            />

            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        {quiz.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("exam.questionOf", {
                            current: currentQuestionIndex + 1,
                            total: questionsCount,
                        })}
                    </p>
                </div>

                {/* Timer */}
                {quiz.timeLimit && (
                    <div className="flex justify-center mb-6">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                                timeLeft <= 60
                                    ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400"
                                    : "bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400"
                            }`}
                        >
                            <Clock className="size-4" />
                            <span className="font-semibold">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Question Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border-l-4 border-brand-500 shadow-sm p-6 mb-6">
                    <p className="text-xs font-semibold text-brand-500 uppercase tracking-wide mb-3">
                        {t("exam.question")} {currentQuestionIndex + 1}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentQuestion.question}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 italic">
                        * {t("exam.questionPlaceholder")} *
                    </p>
                </div>

                {/* Answer Options */}
                <div className="flex gap-3 mb-6">
                    {currentQuestion.options?.map((option) => {
                        const isSelected =
                            answers[currentQuestion.id] === option.id;
                        return (
                            <button
                                key={option.id}
                                onClick={() =>
                                    handleAnswerSelect(
                                        currentQuestion.id,
                                        option.id
                                    )
                                }
                                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all ${
                                    isSelected
                                        ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                            >
                                {option.optionText}
                            </button>
                        );
                    })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() =>
                            setCurrentQuestionIndex((prev) =>
                                Math.max(0, prev - 1)
                            )
                        }
                        disabled={isFirstQuestion}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                            isFirstQuestion
                                ? "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                    >
                        <ChevronLeft className="size-4 rtl:rotate-180" />
                        {t("exam.previous")}
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={confirmSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors disabled:opacity-50"
                        >
                            {t("exam.submitExam")}
                            <Flag className="size-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                setCurrentQuestionIndex((prev) =>
                                    Math.min(questionsCount - 1, prev + 1)
                                )
                            }
                            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
                        >
                            {t("exam.next")}
                            <ChevronRight className="size-4 rtl:rotate-180" />
                        </button>
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}

export default TakeExamPage;
