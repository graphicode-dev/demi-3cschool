import { useState } from "react";
import { LoadingState } from "@/design-system";
import { LessonQuiz } from "@/features/dashboard/admin/learning/pages/lessons/types";
import { TFunction } from "i18next";
import { FileText } from "lucide-react";
import {
    useAnswerLessonQuizAttempt,
    useCompleteLessonQuizAttempt,
    useLessonQuizAttemptHistory,
    useLessonQuizOptionsByQuestion,
    useLessonQuizQuestionsByQuiz,
    useStartLessonQuizAttempt,
} from "@/features/dashboard/admin/learning/pages/lessons/api";
import LessonQuizModal from "../Lessonquizmodal";

export const LessonQuizTab = ({
    quizzes,
    isLoadingQuizzes,
    t,
}: {
    quizzes: LessonQuiz[];
    isLoadingQuizzes: boolean;
    t: TFunction<"selfStudy", undefined>;
}) => {
    const [selectedQuiz, setSelectedQuiz] = useState<LessonQuiz | null>(null);
    const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(
        null
    );

    // Fetch questions for selected quiz
    const { data: questionsData, isLoading: isLoadingQuestions } =
        useLessonQuizQuestionsByQuiz(
            selectedQuiz ? String(selectedQuiz.id) : null
        );

    // Fetch attempt history for selected quiz
    const { data: attemptHistory } = useLessonQuizAttemptHistory(
        selectedQuiz ? String(selectedQuiz.id) : null
    );

    // Mutations
    const startAttemptMutation = useStartLessonQuizAttempt();
    const answerMutation = useAnswerLessonQuizAttempt();
    const completeMutation = useCompleteLessonQuizAttempt();

    // Get current quiz attempts from history
    const getCurrentAttempts = (quizId: string | number): number => {
        if (!quizzes) return 0;
        // For now, we'll fetch from history when available
        // You can also track this separately if the API doesn't provide it
        return 0; // This will be replaced with actual attempt count from API
    };

    const handleStartQuiz = async (quiz: LessonQuiz) => {
        try {
            // Start a new quiz attempt
            const attempt = await startAttemptMutation.mutateAsync({
                lessonQuizId: quiz.id as number,
            });

            setCurrentAttemptId(String(attempt.id));
            setSelectedQuiz(quiz);
        } catch (error) {
            console.error("Error starting quiz:", error);
            // Error is handled by mutation error handler
        }
    };

    const handleQuizComplete = async (
        passed: boolean,
        answers: Array<{ questionId: string; selectedAnswer: number }>
    ) => {
        if (selectedQuiz && currentAttemptId) {
            try {
                // Submit all answers (if your API supports batch submission)
                // Otherwise, you may need to submit answers one by one during the quiz

                // Complete the quiz attempt
                await completeMutation.mutateAsync(currentAttemptId);

                console.log("Quiz completed:", {
                    quizId: selectedQuiz.id,
                    attemptId: currentAttemptId,
                    passed,
                });
            } catch (error) {
                console.error("Error completing quiz:", error);
            }
        }
    };

    const handleAnswerSubmit = async (
        questionId: number,
        optionId: number,
        textAnswer: string
    ) => {
        if (currentAttemptId) {
            try {
                await answerMutation.mutateAsync({
                    id: currentAttemptId,
                    data: {
                        lesson_quiz_question_id: questionId,
                        selected_option_id: optionId,
                        text_answer: textAnswer,
                    },
                });
            } catch (error) {
                console.error("Error submitting answer:", error);
            }
        }
    };

    const handleQuizRetry = () => {
        // Reset attempt ID to start a new attempt
        setCurrentAttemptId(null);
        console.log("Retrying quiz:", selectedQuiz?.id);
    };

    const handleCloseModal = () => {
        setSelectedQuiz(null);
        setCurrentAttemptId(null);
    };

    if (isLoadingQuizzes) return <LoadingState />;

    if (quizzes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.noLessonQuiz")}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {quizzes.map((quiz) => {
                    // Get attempts for this specific quiz from history
                    const quizAttempts =
                        attemptHistory?.filter(
                            (attempt) =>
                                String(attempt.lessonQuiz?.id) ===
                                String(quiz.id)
                        ) || [];
                    const attemptsUsed = quizAttempts.length;
                    const attemptsRemaining = quiz.maxAttempts - attemptsUsed;
                    const canTakeQuiz = attemptsRemaining > 0;

                    return (
                        <div
                            key={quiz.id}
                            className="flex items-center justify-between p-4 rounded-xl border bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-500/20"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="size-10 rounded-full flex items-center justify-center bg-warning-100 dark:bg-warning-500/20">
                                    <FileText className="size-5 text-warning-500" />
                                </div>

                                {/* Info */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {t("lesson.quiz.title")}
                                        </h4>
                                        {attemptsUsed === 0 && (
                                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-warning-100 dark:bg-warning-500/20 text-warning-600 dark:text-warning-500">
                                                {t("lesson.quiz.new")}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>
                                            {quiz.timeLimit}{" "}
                                            {t("lesson.quiz.minutes")}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {t("lesson.quiz.passingScore")}:{" "}
                                            {quiz.passingScore}%
                                        </span>
                                        {attemptsUsed > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    {t("lesson.quiz.attempts")}:{" "}
                                                    {attemptsUsed}/
                                                    {quiz.maxAttempts}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleStartQuiz(quiz)}
                                disabled={
                                    !canTakeQuiz ||
                                    startAttemptMutation.isPending
                                }
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                                    canTakeQuiz &&
                                    !startAttemptMutation.isPending
                                        ? "bg-warning-500 hover:bg-warning-600 text-white"
                                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                {startAttemptMutation.isPending
                                    ? t("lesson.quiz.starting")
                                    : attemptsUsed > 0 && canTakeQuiz
                                      ? t("lesson.quiz.retakeQuiz")
                                      : t("lesson.quiz.startQuiz")}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Quiz Modal */}
            {selectedQuiz && currentAttemptId && (
                <QuizModalWrapper
                    quiz={selectedQuiz}
                    attemptId={currentAttemptId}
                    questionsData={questionsData}
                    isLoadingQuestions={isLoadingQuestions}
                    attemptsUsed={
                        attemptHistory?.filter(
                            (attempt) =>
                                String(attempt.lessonQuiz?.id) ===
                                String(selectedQuiz.id)
                        ).length || 0
                    }
                    onComplete={handleQuizComplete}
                    onAnswerSubmit={handleAnswerSubmit}
                    onRetry={handleQuizRetry}
                    onClose={handleCloseModal}
                    t={t}
                />
            )}
        </>
    );
};

// Wrapper component to handle questions and options loading
const QuizModalWrapper = ({
    quiz,
    attemptId,
    questionsData,
    isLoadingQuestions,
    attemptsUsed,
    onComplete,
    onAnswerSubmit,
    onRetry,
    onClose,
    t,
}: {
    quiz: LessonQuiz;
    attemptId: string;
    questionsData: any;
    isLoadingQuestions: boolean;
    attemptsUsed: number;
    onComplete: (
        passed: boolean,
        answers: Array<{ questionId: string; selectedAnswer: number }>
    ) => void;
    onAnswerSubmit: (
        questionId: number,
        optionId: number,
        textAnswer: string
    ) => Promise<void>;
    onRetry: () => void;
    onClose: () => void;
    t: TFunction<"selfStudy", undefined>;
}) => {
    const questions = questionsData?.items || [];

    if (isLoadingQuestions) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4">
                    <LoadingState />
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4">
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {t("lesson.quiz.noQuestions")}
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-colors"
                        >
                            {t("lesson.close")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <QuizQuestionsLoader
            quiz={quiz}
            attemptId={attemptId}
            questions={questions}
            attemptsUsed={attemptsUsed}
            onComplete={onComplete}
            onAnswerSubmit={onAnswerSubmit}
            onRetry={onRetry}
            onClose={onClose}
            t={t}
        />
    );
};

// Component to load all question options
const QuizQuestionsLoader = ({
    quiz,
    attemptId,
    questions,
    attemptsUsed,
    onComplete,
    onAnswerSubmit,
    onRetry,
    onClose,
    t,
}: {
    quiz: LessonQuiz;
    attemptId: string;
    questions: any[];
    attemptsUsed: number;
    onComplete: (
        passed: boolean,
        answers: Array<{ questionId: string; selectedAnswer: number }>
    ) => void;
    onAnswerSubmit: (
        questionId: number,
        optionId: number,
        textAnswer: string
    ) => Promise<void>;
    onRetry: () => void;
    onClose: () => void;
    t: TFunction<"selfStudy", undefined>;
}) => {
    // Fetch options for the first question to trigger all queries
    const optionsQueries = questions.map((question) =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLessonQuizOptionsByQuestion(String(question.id))
    );

    const isLoadingOptions = optionsQueries.some((query) => query.isLoading);
    const hasErrors = optionsQueries.some((query) => query.error);

    if (isLoadingOptions) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4">
                    <LoadingState />
                </div>
            </div>
        );
    }

    if (hasErrors) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4">
                    <div className="text-center">
                        <p className="text-error-500 dark:text-error-400">
                            {t("lesson.quiz.errorLoadingOptions")}
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold text-sm transition-colors"
                        >
                            {t("lesson.close")}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Build questions with options
    const questionsWithOptions = questions.map((question, index) => {
        const options = optionsQueries[index].data?.items || [];
        const correctAnswerIndex = options.findIndex(
            (opt: any) => opt.isCorrect === 1 || opt.isCorrect === true
        );

        return {
            id: question.id,
            question: question.question,
            options: options.map((opt: any) => ({
                id: opt.id,
                text: opt.optionText,
            })),
            correctAnswer: correctAnswerIndex,
        };
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <LessonQuizModal
                    quiz={quiz}
                    attemptId={attemptId}
                    questions={questionsWithOptions}
                    attemptsUsed={attemptsUsed}
                    onComplete={onComplete}
                    onAnswerSubmit={onAnswerSubmit}
                    onRetry={onRetry}
                    onClose={onClose}
                />
            </div>
        </div>
    );
};

export default LessonQuizTab;
