/**
 * Learning - Level Detail Page (Final Quizzes)
 *
 * Shared component for both Standard and Professional Learning.
 * Shows Final Quizzes for a specific level with expandable quiz cards
 * and question management functionality.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
    PageWrapper,
    LoadingState,
    ErrorState,
    ConfirmDialog,
} from "@/design-system";
import { AlertTriangle, Plus } from "lucide-react";
import type {
    NewQuizData,
    LevelQuizWithQuestions,
    NewQuestionFormData,
    LevelQuiz,
    LevelQuizQuestion,
    LevelQuizOption,
    QuizQuestionWithOptions,
} from "../types";
import { QuizCard, QuizForm, QuestionForm } from "../components";
import {
    useCreateLevelQuiz,
    useDeleteLevelQuiz,
    useUpdateLevelQuiz,
    useLevelQuizzesByLevel,
} from "../api/quizzes";
import {
    useCreateLevelQuizQuestion,
    useDeleteLevelQuizQuestion,
    useUpdateLevelQuizQuestion,
    useLevelQuizQuestionsByQuiz,
} from "../api/quiz questions";
import {
    useCreateLevelQuizOption,
    useLevelQuizOptionsByQuestion,
} from "../api/quiz options";
import { useMutationHandler } from "@/shared/api";
import { useLevel } from "../../learning/pages/levels";

const DEFAULT_NEW_QUIZ: Omit<NewQuizData, "levelId"> = {
    timeLimit: 60,
    passingScore: 60,
    maxAttempts: 1,
    shuffleQuestions: false,
    showAnswers: true,
};

const DEFAULT_NEW_QUESTION: NewQuestionFormData = {
    quizId: "",
    question: "",
    type: "single_choice",
    points: 5,
    order: 1,
    explanation: "",
    isActive: true,
    options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
    ],
};

function transformQuizToUI(
    quiz: LevelQuiz,
    questions: LevelQuizQuestion[],
    options: LevelQuizOption[]
): LevelQuizWithQuestions {
    const quizIdStr = String(quiz.id);
    const quizQuestions = questions.filter(
        (q) => String(q.quiz.id) === quizIdStr
    );

    return {
        id: quizIdStr,
        levelId: String(quiz.level.id),
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts,
        shuffleQuestions: quiz.shuffleQuestions === 1,
        showAnswers: quiz.showAnswers === 1,
        questions: quizQuestions.map((q) => {
            const questionIdStr = String(q.id);
            const questionOptions = options.filter(
                (o) => String(o.question.id) === questionIdStr
            );
            return {
                id: questionIdStr,
                question: q.question,
                type: q.type,
                points: q.points,
                order: q.order,
                explanation: q.explanation,
                isActive: q.isActive,
                options: questionOptions.map((o) => ({
                    id: String(o.id),
                    text: o.optionText,
                    isCorrect: o.isCorrect === 1,
                    order: o.order,
                })),
            };
        }),
    };
}

export default function FinalLevelQuizPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const {
        data: level,
        isLoading: levelLoading,
        error: levelError,
        refetch: refetchLevel,
    } = useLevel(id);

    const {
        data: quizzesData,
        isLoading: quizzesLoading,
        refetch: refetchQuizzes,
    } = useLevelQuizzesByLevel(id);

    // Selected quiz for fetching questions
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    // Selected question for fetching options
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
        null
    );

    const {
        data: questionsData,
        isLoading: questionsLoading,
        refetch: refetchQuestions,
    } = useLevelQuizQuestionsByQuiz(selectedQuizId);
    const {
        data: optionsData,
        isLoading: optionsLoading,
        refetch: refetchOptions,
    } = useLevelQuizOptionsByQuestion(selectedQuestionId);

    const { mutateAsync: createQuizAsync, isPending: isCreatingQuiz } =
        useCreateLevelQuiz();
    const { mutateAsync: deleteQuizAsync, isPending: isDeletingQuiz } =
        useDeleteLevelQuiz();
    const { mutateAsync: updateQuizAsync, isPending: isUpdatingQuiz } =
        useUpdateLevelQuiz();

    const { mutateAsync: createQuestionAsync, isPending: isCreatingQuestion } =
        useCreateLevelQuizQuestion();
    const { mutateAsync: deleteQuestionAsync, isPending: isDeletingQuestion } =
        useDeleteLevelQuizQuestion();
    const { mutateAsync: updateQuestionAsync, isPending: isUpdatingQuestion } =
        useUpdateLevelQuizQuestion();

    const { mutateAsync: createOptionAsync, isPending: isCreatingOption } =
        useCreateLevelQuizOption();
    const { execute } = useMutationHandler();

    const [expandedQuizzes, setExpandedQuizzes] = useState<string[]>([]);
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
    const [isAddingQuiz, setIsAddingQuiz] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState<string | null>(
        null
    );
    const [newQuiz, setNewQuiz] =
        useState<Omit<NewQuizData, "levelId">>(DEFAULT_NEW_QUIZ);
    const [newQuestion, setNewQuestion] =
        useState<NewQuestionFormData>(DEFAULT_NEW_QUESTION);

    // Edit states
    const [editingQuiz, setEditingQuiz] =
        useState<LevelQuizWithQuestions | null>(null);
    const [editQuizData, setEditQuizData] =
        useState<Omit<NewQuizData, "levelId">>(DEFAULT_NEW_QUIZ);
    const [editingQuestion, setEditingQuestion] = useState<{
        quizId: string;
        question: QuizQuestionWithOptions;
    } | null>(null);
    const [editQuestionData, setEditQuestionData] =
        useState<NewQuestionFormData>(DEFAULT_NEW_QUESTION);

    // Delete confirmation dialogs
    const [deleteQuizDialog, setDeleteQuizDialog] = useState<{
        isOpen: boolean;
        quizId: string | null;
    }>({ isOpen: false, quizId: null });
    const [deleteQuestionDialog, setDeleteQuestionDialog] = useState<{
        isOpen: boolean;
        quizId: string | null;
        questionId: string | null;
    }>({ isOpen: false, quizId: null, questionId: null });

    // Extract quizzes array from paginated response
    const quizzes: LevelQuiz[] = (() => {
        if (!quizzesData) return [];
        const items = "items" in quizzesData ? quizzesData.items : quizzesData;
        return Array.isArray(items) ? items : [];
    })();
    const questions = questionsData?.items || [];
    const options = optionsData?.items || [];

    const transformedQuizzes: LevelQuizWithQuestions[] = quizzes.map((quiz) =>
        transformQuizToUI(quiz, questions, options)
    );

    const toggleQuizExpand = (quizId: string) => {
        setExpandedQuizzes((prev) => {
            const isExpanding = !prev.includes(quizId);
            if (isExpanding) {
                // Set selected quiz to fetch its questions
                setSelectedQuizId(quizId);
                return [...prev, quizId];
            } else {
                // Clear selected quiz when collapsing
                if (selectedQuizId === quizId) {
                    setSelectedQuizId(null);
                }
                return prev.filter((qid) => qid !== quizId);
            }
        });
    };

    const toggleQuestionExpand = (questionId: string) => {
        setExpandedQuestions((prev) => {
            const isExpanding = !prev.includes(questionId);
            if (isExpanding) {
                // Set selected question to fetch its options
                setSelectedQuestionId(questionId);
                return [...prev, questionId];
            } else {
                // Clear selected question when collapsing
                if (selectedQuestionId === questionId) {
                    setSelectedQuestionId(null);
                }
                return prev.filter((qid) => qid !== questionId);
            }
        });
    };

    const resetNewQuiz = () => setNewQuiz(DEFAULT_NEW_QUIZ);
    const resetNewQuestion = () => setNewQuestion(DEFAULT_NEW_QUESTION);

    const handleCreateQuiz = () => {
        if (!id) return;

        execute(
            () =>
                createQuizAsync({
                    levelId: id,
                    timeLimit: newQuiz.timeLimit,
                    passingScore: newQuiz.passingScore,
                    maxAttempts: newQuiz.maxAttempts,
                    shuffleQuestions: newQuiz.shuffleQuestions,
                    showAnswers: newQuiz.showAnswers,
                }),
            {
                successMessage: t(
                    "levels:quiz.messages.createSuccess",
                    "Quiz created successfully"
                ),
                onSuccess: () => {
                    setIsAddingQuiz(false);
                    resetNewQuiz();
                    refetchQuizzes();
                },
            }
        );
    };

    const handleDeleteQuiz = (quizId: string) => {
        setDeleteQuizDialog({ isOpen: true, quizId });
    };

    const confirmDeleteQuiz = async () => {
        if (!deleteQuizDialog.quizId) return;
        await execute(() => deleteQuizAsync(deleteQuizDialog.quizId!), {
            successMessage: t(
                "levels:quiz.messages.deleteSuccess",
                "Quiz deleted successfully"
            ),
            onSuccess: () => refetchQuizzes(),
        });
        setDeleteQuizDialog({ isOpen: false, quizId: null });
    };

    const handleEditQuiz = (quiz: LevelQuizWithQuestions) => {
        setEditingQuiz(quiz);
        setEditQuizData({
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            shuffleQuestions: quiz.shuffleQuestions,
            showAnswers: quiz.showAnswers,
        });
    };

    const handleUpdateQuiz = async () => {
        if (!editingQuiz || !id) return;

        execute(
            () =>
                updateQuizAsync({
                    id: editingQuiz.id,
                    data: {
                        levelId: id,
                        timeLimit: editQuizData.timeLimit,
                        passingScore: editQuizData.passingScore,
                        maxAttempts: editQuizData.maxAttempts,
                        shuffleQuestions: editQuizData.shuffleQuestions,
                        showAnswers: editQuizData.showAnswers,
                    },
                }),
            {
                successMessage: t(
                    "levels:quiz.messages.updateSuccess",
                    "Quiz updated successfully"
                ),
                onSuccess: () => {
                    setEditingQuiz(null);
                    setEditQuizData(DEFAULT_NEW_QUIZ);
                    refetchQuizzes();
                },
            }
        );
    };

    const handleCancelEditQuiz = () => {
        setEditingQuiz(null);
        setEditQuizData(DEFAULT_NEW_QUIZ);
    };

    const handleEditQuestion = (quizId: string, questionId: string) => {
        const quiz = transformedQuizzes.find((q) => q.id === quizId);
        const question = quiz?.questions.find((q) => q.id === questionId);
        if (!question) return;

        setEditingQuestion({ quizId, question });
        setEditQuestionData({
            quizId,
            question: question.question,
            type: question.type,
            points: question.points,
            order: question.order,
            explanation: question.explanation || "",
            isActive: Boolean(question.isActive ?? true),
            options: question.options.map((opt) => ({
                text: opt.text,
                isCorrect: opt.isCorrect ?? false,
            })),
        });
    };

    const handleUpdateQuestion = async () => {
        if (!editingQuestion) return;

        execute(
            () =>
                updateQuestionAsync({
                    id: editingQuestion.question.id,
                    data: {
                        quizId: editingQuestion.quizId,
                        question: editQuestionData.question,
                        type: editQuestionData.type,
                        points: editQuestionData.points,
                        order: editQuestionData.order,
                        explanation: editQuestionData.explanation,
                        isActive: editQuestionData.isActive,
                    },
                }),
            {
                successMessage: t(
                    "levels:quiz.messages.questionUpdateSuccess",
                    "Question updated successfully"
                ),
                onSuccess: () => {
                    setEditingQuestion(null);
                    setEditQuestionData(DEFAULT_NEW_QUESTION);
                    refetchQuestions();
                },
            }
        );
    };

    const handleCancelEditQuestion = () => {
        setEditingQuestion(null);
        setEditQuestionData(DEFAULT_NEW_QUESTION);
    };

    const handleCreateQuestion = async (quizId: string) => {
        if (!newQuestion.question.trim()) return;

        execute(
            async () => {
                const createdQuestions = await createQuestionAsync({
                    quizId,
                    question: newQuestion.question,
                    type: newQuestion.type,
                    points: newQuestion.points,
                    order: newQuestion.order,
                    explanation: newQuestion.explanation,
                    isActive: newQuestion.isActive,
                });

                if (
                    createdQuestions &&
                    createdQuestions.length > 0 &&
                    newQuestion.options.length > 0
                ) {
                    const questionId = createdQuestions[0].id;
                    await createOptionAsync({
                        question_id: questionId,
                        options: newQuestion.options.map((opt, index) => ({
                            option_text: opt.text,
                            is_correct: opt.isCorrect,
                            order: index + 1,
                        })),
                    });
                }
                return createdQuestions;
            },
            {
                successMessage: t(
                    "levels:quiz.messages.questionCreateSuccess",
                    "Question created successfully"
                ),
                onSuccess: () => {
                    setIsAddingQuestion(null);
                    resetNewQuestion();
                    refetchQuestions();
                    refetchOptions();
                },
            }
        );
    };

    const handleDeleteQuestion = (quizId: string, questionId: string) => {
        setDeleteQuestionDialog({ isOpen: true, quizId, questionId });
    };

    const confirmDeleteQuestion = async () => {
        if (!deleteQuestionDialog.questionId) return;
        await execute(
            () => deleteQuestionAsync(deleteQuestionDialog.questionId!),
            {
                successMessage: t(
                    "levels:quiz.messages.questionDeleteSuccess",
                    "Question deleted successfully"
                ),
                onSuccess: () => {
                    refetchQuestions();
                    refetchOptions();
                },
            }
        );
        setDeleteQuestionDialog({
            isOpen: false,
            quizId: null,
            questionId: null,
        });
    };

    const isLoading =
        levelLoading || quizzesLoading || questionsLoading || optionsLoading;

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (levelError) {
        return (
            <ErrorState
                message={
                    levelError.message ||
                    t("errors.fetchFailed", "Failed to load level")
                }
                onRetry={refetchLevel}
            />
        );
    }

    return (
        <PageWrapper>
            {/* Progression Gate Alert */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            {t(
                                "levels:levels.progressionGate",
                                "Progression Gate"
                            )}
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            {t(
                                "levels:levels.progressionGateDescription",
                                "Students must pass this quiz to unlock the next level. This quiz serves as a checkpoint to ensure mastery of all concepts."
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Final Quizzes Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t("levels:levels.finalQuizzes", "Final Quizzes")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t("levels:levels.examsCount", "{{count}} Exams", {
                                count: transformedQuizzes.length,
                            })}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddingQuiz(true)}
                        disabled={isCreatingQuiz}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        {t("levels:levels.addFinalQuiz", "Add Final Quiz")}
                    </button>
                </div>

                {/* Add New Quiz Form */}
                {isAddingQuiz && (
                    <QuizForm
                        quiz={newQuiz}
                        onChange={setNewQuiz}
                        onSave={handleCreateQuiz}
                        onCancel={() => {
                            setIsAddingQuiz(false);
                            resetNewQuiz();
                        }}
                        isPending={isCreatingQuiz}
                    />
                )}

                {/* Quiz Cards */}
                <div className="space-y-4">
                    {transformedQuizzes.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("levels:quiz.noQuizzes", "No quizzes yet")}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                {t(
                                    "levels:quiz.addFirstQuiz",
                                    "Click 'Add Final Quiz' to create your first quiz"
                                )}
                            </p>
                        </div>
                    ) : (
                        transformedQuizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                isExpanded={expandedQuizzes.includes(quiz.id)}
                                expandedQuestions={expandedQuestions}
                                isAddingQuestion={isAddingQuestion === quiz.id}
                                newQuestion={newQuestion}
                                onToggleExpand={() => toggleQuizExpand(quiz.id)}
                                onToggleQuestionExpand={toggleQuestionExpand}
                                onEdit={() => handleEditQuiz(quiz)}
                                onDelete={() => handleDeleteQuiz(quiz.id)}
                                onAddQuestion={() =>
                                    setIsAddingQuestion(quiz.id)
                                }
                                onCancelAddQuestion={() => {
                                    setIsAddingQuestion(null);
                                    resetNewQuestion();
                                }}
                                onNewQuestionChange={setNewQuestion}
                                onSaveQuestion={() =>
                                    handleCreateQuestion(quiz.id)
                                }
                                onEditQuestion={(questionId) =>
                                    handleEditQuestion(quiz.id, questionId)
                                }
                                onDeleteQuestion={(questionId) =>
                                    handleDeleteQuestion(quiz.id, questionId)
                                }
                                isPending={isDeletingQuiz}
                                isQuestionPending={
                                    isCreatingQuestion || isCreatingOption
                                }
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Lock Behavior Notice */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                    <span className="font-medium">
                        {t("levels:levels.lockBehavior", "Lock Behavior")}:
                    </span>{" "}
                    {t(
                        "levels:levels.lockBehaviorDescription",
                        "When students complete this quiz with a passing score (75% or higher), the next level will automatically unlock for them."
                    )}
                </p>
            </div>

            {/* Edit Quiz Modal */}
            {editingQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("levels:quiz.editQuiz", "Edit Quiz")}
                        </h3>
                        <QuizForm
                            quiz={editQuizData}
                            onChange={setEditQuizData}
                            onSave={handleUpdateQuiz}
                            onCancel={handleCancelEditQuiz}
                            isPending={isUpdatingQuiz}
                        />
                    </div>
                </div>
            )}

            {/* Delete Quiz Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteQuizDialog.isOpen}
                onClose={() =>
                    setDeleteQuizDialog({ isOpen: false, quizId: null })
                }
                variant="danger"
                title={t("levels:quiz.deleteDialog.title", "Delete Quiz")}
                message={t(
                    "levels:quiz.deleteDialog.message",
                    "Are you sure you want to delete this quiz? All questions and options will be permanently removed. This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={confirmDeleteQuiz}
                loading={isDeletingQuiz}
            />

            {/* Delete Question Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteQuestionDialog.isOpen}
                onClose={() =>
                    setDeleteQuestionDialog({
                        isOpen: false,
                        quizId: null,
                        questionId: null,
                    })
                }
                variant="danger"
                title={t(
                    "levels:quiz.deleteQuestionDialog.title",
                    "Delete Question"
                )}
                message={t(
                    "levels:quiz.deleteQuestionDialog.message",
                    "Are you sure you want to delete this question? All options will be permanently removed. This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={confirmDeleteQuestion}
                loading={isDeletingQuestion}
            />

            {/* Edit Question Modal */}
            {editingQuestion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("levels:quiz.editQuestion", "Edit Question")}
                        </h3>
                        <QuestionForm
                            question={editQuestionData}
                            onChange={setEditQuestionData}
                            onSave={handleUpdateQuestion}
                            onCancel={handleCancelEditQuestion}
                            isPending={isUpdatingQuestion}
                        />
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}
