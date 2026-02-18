import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, Send } from "lucide-react";
import PreExam from "./pre-exam";
import {
    AcceptanceExamQuestion,
    AcceptanceExam as StudentAcceptanceExam,
    AcceptanceExamQuestionOption,
} from "../types";
import {
    PageWrapper,
    ErrorState,
    LoadingState,
    useToast,
} from "@/design-system";
import {
    useAcceptanceExamsList,
    useAcceptanceExamAttemptResult,
    useStartAcceptanceExamAttempt,
    useAnswerAcceptanceExamQuestion,
    useCompleteAcceptanceExamAttempt,
} from "@/features/dashboard/admin/acceptanceExams/pages/exams/api";
import { acceptanceTestPaths } from "../navigation";

interface QuizData {
    id: number;
    title: string;
    questions: AcceptanceExamQuestion[];
    timeLimit?: number;
    passingScore?: number;
    maxAttempts?: number;
}

function AcceptanceExamTakePage() {
    const { t } = useTranslation("acceptanceTest");
    const navigate = useNavigate();
    const { addToast, addAlertToast } = useToast();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const submittingAnswerRef = useRef(false);

    // Fetch available exams (skip if using mock data)
    const {
        data: realExamsData,
        isLoading: realExamsLoading,
        error: realExamsError,
    } = useAcceptanceExamsList({ page: 1 });
    const realStudentExam =
        (realExamsData?.items?.[0] as unknown as StudentAcceptanceExam) ?? null;

    const {
        data: realAttemptData,
        isLoading: realAttemptLoading,
        error: realAttemptError,
    } = useAcceptanceExamAttemptResult(attemptId || undefined, {
        enabled: !!attemptId,
    });

    // Use mock data or real data based on configuration
    const studentExam = realStudentExam;
    const examsLoading = realExamsLoading;
    const examsError = realExamsError;
    const attemptData = realAttemptData;
    const attemptLoading = realAttemptLoading;
    const attemptError = realAttemptError;

    const { mutateAsync: startExamMutation } = useStartAcceptanceExamAttempt();
    const { mutateAsync: submitAnswerMutation } =
        useAnswerAcceptanceExamQuestion();
    const { mutateAsync: completeExamMutation } =
        useCompleteAcceptanceExamAttempt();

    // Map attempt data to quiz state when available
    useEffect(() => {
        if (!attemptId || !attemptData) return;

        const attempt = (attemptData as any)?.data ?? attemptData;
        const quizFromAttempt = attempt?.quiz || attempt;
        const questions =
            quizFromAttempt?.questions || attempt?.questions || [];

        if (questions.length > 0 && !quiz) {
            setQuiz({
                id: quizFromAttempt.id,
                title: quizFromAttempt.title || t("exam.title"),
                questions: questions.map((q: AcceptanceExamQuestion) => ({
                    id: q.id,
                    question: q.question,
                    options: (q.options || []).map((opt) => ({
                        id: opt.id,
                        questionId: opt.questionId,
                        optionText: opt.optionText,
                        isCorrect: opt.isCorrect,
                        order: opt.order,
                    })),
                    points: q.points || 1,
                })),
                timeLimit:
                    quizFromAttempt.time_limit || quizFromAttempt.timeLimit,
                passingScore:
                    quizFromAttempt.passing_score ||
                    quizFromAttempt.passingScore,
                maxAttempts:
                    quizFromAttempt.max_attempts || quizFromAttempt.maxAttempts,
            });
        }
    }, [attemptId, attemptData, quiz, t]);

    // Initialize timer when exam starts (attemptId is set)
    useEffect(() => {
        if (attemptId && quiz?.timeLimit) {
            setTimeLeft(quiz.timeLimit * 60);
        }
    }, [attemptId, quiz?.timeLimit]);

    // Timer countdown - does NOT auto-submit, just shows warning when time is up
    useEffect(() => {
        if (!attemptId || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Show warning toast instead of auto-submitting
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

    // Handle answer selection and submit to API
    const handleAnswerSelect = async (questionId: number, optionId: number) => {
        if (!attemptId || submittingAnswerRef.current) return;

        // Update local state
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        // Submit answer to API (skip for mock data)
        submittingAnswerRef.current = true;
        try {
            await submitAnswerMutation({
                attemptId,
                questionId: String(questionId),
                data: { selected_option_id: String(optionId) },
            });
        } catch (error: any) {
            console.error("Failed to submit answer:", error);
        } finally {
            submittingAnswerRef.current = false;
        }
    };

    // Get selected exam details
    const selectedExam = studentExam;

    // Start the exam - calls startExam API and gets quiz data from response
    const startExam = async () => {
        if (!studentExam) {
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
            const response = await startExamMutation(String(studentExam.id));
            const data = (response as any)?.data || response;
            newAttemptId = data?.id;

            if (newAttemptId) {
                setAttemptId(String(newAttemptId));

                // Use questions from availableExams since API doesn't return them in start response
                // The start exam API returns empty objects for questions
                const examFromList = studentExam;
                const questionsFromList = examFromList?.questions || [];

                // Convert questions array (handle both array and object)
                const questionsArray = Array.isArray(questionsFromList)
                    ? questionsFromList
                    : [];

                if (questionsArray.length === 0) {
                    console.warn(
                        "[AcceptanceExam] No questions found in exam!"
                    );
                }

                setQuiz({
                    id: studentExam.id,
                    title: examFromList?.title || t("exam.title"),
                    questions: questionsArray.map((q) => ({
                        id: q.id,
                        question: q.question,
                        options: q.options.map(
                            (opt: AcceptanceExamQuestionOption) => ({
                                id: opt.id,
                                questionId: opt.questionId,
                                optionText: opt.optionText,
                                isCorrect: opt.isCorrect,
                                order: opt.order,
                            })
                        ),
                        points: q.points || 1,
                        acceptanceExamId: studentExam.id,
                        type: q.type || "single_choice",
                        order: q.order || 0,
                        explanation: q.explanation || "",
                        isActive: q.isActive || false,
                    })),
                    timeLimit:
                        examFromList?.timeLimit ||
                        (examFromList as any)?.timeLimit,
                    passingScore:
                        examFromList?.passingScore ||
                        (examFromList as any)?.passingScore,
                    maxAttempts:
                        examFromList?.maxAttempts ||
                        (examFromList as any)?.maxAttempts,
                });
            } else {
                throw new Error("No attempt ID returned");
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

    // Complete the exam - calls completeExam API
    const handleCompleteExam = useCallback(async () => {
        if (!attemptId) return;

        setIsSubmitting(true);
        try {
            // Skip API call for mock data
            await completeExamMutation(attemptId);

            addToast({
                type: "success",
                title: t("exam.examSubmitted"),
                message: t("exam.waitingForResult"),
            });

            // Navigate to waiting page after submission
            navigate(acceptanceTestPaths.waiting());
        } catch (error: any) {
            addToast({
                type: "error",
                title: t("exam.submissionFailed"),
                message: error?.message || t("exam.failedToSubmit"),
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [attemptId, completeExamMutation, navigate, addToast, t]);

    const confirmSubmit = () => {
        const answeredCount = Object.keys(answers).length;
        const unansweredCount = (quiz?.questions?.length || 0) - answeredCount;

        if (unansweredCount > 0) {
            addAlertToast(
                t("exam.submitTitle"),
                t("exam.unansweredWarning", {
                    count: unansweredCount,
                }),
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

    // Loading state for fetching available exams
    if (examsLoading) return <LoadingState />;

    // Error state for fetching available exams
    if (examsError) {
        return (
            <ErrorState
                title={t("exam.failedToLoad")}
                message={(examsError as any)?.message || t("exam.unknownError")}
                onRetry={() => window.location.reload()}
            />
        );
    }

    // No exams available
    if (!studentExam) {
        return (
            <ErrorState
                title={t("exam.noExamAvailable")}
                message={t("exam.noExamForGrade")}
            />
        );
    }

    // Pre-exam screen - show when attemptId is not set (exam not started yet)
    if (!attemptId) {
        return (
            <PreExam
                startExam={startExam}
                isStarting={isStarting}
                studentExam={studentExam}
            />
        );
    }

    if (attemptLoading) return <LoadingState />;

    if (attemptError) {
        return (
            <ErrorState
                title={t("exam.failedToLoad")}
                message={
                    (attemptError as any)?.message || t("exam.unknownError")
                }
                onRetry={() => window.location.reload()}
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
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / quiz.questions.length) * 100;
    const questionsCount = quiz.questions.length;

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t("exam.title")}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("exam.questionOf", {
                                    current: currentQuestionIndex + 1,
                                    total: questionsCount,
                                })}
                            </p>
                        </div>
                        {quiz.timeLimit && (
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                                    timeLeft <= 60
                                        ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                <Clock
                                    className={`h-5 w-5 ${
                                        timeLeft <= 60
                                            ? "text-red-500 animate-pulse"
                                            : "text-brand-500"
                                    }`}
                                />
                                <span
                                    className={`text-lg font-bold tabular-nums ${
                                        timeLeft <= 60
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-900 dark:text-white"
                                    }`}
                                >
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                        {t("exam.questionsAnswered", {
                            answered: answeredCount,
                            total: questionsCount,
                        })}
                    </p>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="p-6 sm:p-8">
                        {/* Question Header */}
                        <div className="flex items-start justify-between mb-6 gap-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
                                {currentQuestion.question}
                            </h2>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 whitespace-nowrap">
                                {t("exam.points", {
                                    count: currentQuestion.points,
                                })}
                            </span>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options?.map(
                                (option: any, optIndex: number) => {
                                    const questionId =
                                        (currentQuestion as any).id || optIndex;
                                    const optionId = option.id || optIndex;
                                    const isSelected =
                                        answers[questionId] === optionId;
                                    return (
                                        <button
                                            key={optionId}
                                            onClick={() =>
                                                handleAnswerSelect(
                                                    questionId,
                                                    optionId
                                                )
                                            }
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150 text-left active:scale-[0.98] ${
                                                isSelected
                                                    ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 bg-white dark:bg-gray-800"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                                    isSelected
                                                        ? "border-brand-500 bg-brand-500"
                                                        : "border-gray-300 dark:border-gray-600"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <svg
                                                        className="h-3.5 w-3.5 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm leading-relaxed ${
                                                    isSelected
                                                        ? "text-brand-700 dark:text-brand-400 font-semibold"
                                                        : "text-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {option.optionText ||
                                                    option.text}
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* Navigation — inside the card */}
                    <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-gray-100 dark:border-gray-800">
                        <button
                            onClick={() =>
                                setCurrentQuestionIndex((prev) =>
                                    Math.max(0, prev - 1)
                                )
                            }
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.97] ${
                                currentQuestionIndex === 0
                                    ? "border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                    : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                            {t("exam.previous")}
                        </button>

                        {currentQuestionIndex === questionsCount - 1 ? (
                            <button
                                onClick={confirmSubmit}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 active:scale-[0.97] text-white text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                            >
                                <Send className="h-4 w-4" />
                                {t("exam.submitExam")}
                            </button>
                        ) : (
                            <button
                                onClick={() =>
                                    setCurrentQuestionIndex((prev) =>
                                        Math.min(questionsCount - 1, prev + 1)
                                    )
                                }
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.97] text-white text-sm font-bold transition-all shadow-sm"
                            >
                                {t("exam.next")}
                                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default AcceptanceExamTakePage;
