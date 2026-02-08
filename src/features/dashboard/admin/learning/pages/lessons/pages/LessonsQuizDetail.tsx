/**
 * Learning - Lesson Quiz Detail Page
 *
 * Shows quizzes for a specific lesson with expandable quiz cards
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
    LessonQuiz,
    LessonQuizQuestion,
    LessonQuizOption,
    LessonQuizWithQuestions,
    NewLessonQuizData,
    NewLessonQuestionFormData,
    LessonQuizQuestionWithOptions,
} from "../types";
import {
    QuizCard,
    QuizForm,
    QuestionForm,
} from "@/features/dashboard/admin/groupsManagement/components";
import {
    useCreateLessonQuiz,
    useDeleteLessonQuiz,
    useUpdateLessonQuiz,
    useLessonQuizzesByLesson,
} from "../api/lesson quizzes";
import {
    useCreateLessonQuizQuestion,
    useDeleteLessonQuizQuestion,
    useUpdateLessonQuizQuestion,
    useLessonQuizQuestionsByQuiz,
} from "../api/lesson quiz questions";
import {
    useCreateLessonQuizOption,
    useLessonQuizOptionsByQuestion,
} from "../api/lesson quiz options";
import { useLesson } from "../api";
import { useMutationHandler } from "@/shared/api";

const DEFAULT_NEW_QUIZ: Omit<NewLessonQuizData, "lessonId"> = {
    timeLimit: 60,
    passingScore: 60,
    maxAttempts: 1,
    shuffleQuestions: false,
    showAnswers: true,
};

const DEFAULT_NEW_QUESTION: NewLessonQuestionFormData = {
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
    quiz: LessonQuiz,
    questions: LessonQuizQuestion[],
    options: LessonQuizOption[]
): LessonQuizWithQuestions {
    const quizIdStr = String(quiz.id);
    // Ensure questions and options are arrays
    const safeQuestions = Array.isArray(questions) ? questions : [];
    const safeOptions = Array.isArray(options) ? options : [];
    const quizQuestions = safeQuestions.filter(
        (q) => String(q.quiz.id) === quizIdStr
    );

    return {
        id: quizIdStr,
        lessonId: String(quiz.lesson.id),
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts,
        shuffleQuestions:
            quiz.shuffleQuestions === 1 || quiz.shuffleQuestions === true,
        showAnswers: quiz.showAnswers === 1 || quiz.showAnswers === true,
        questions: quizQuestions.map((q) => {
            const questionIdStr = String(q.id);
            const questionOptions = safeOptions.filter(
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
                    isCorrect: o.isCorrect === 1 || o.isCorrect === true,
                    order: o.order,
                })),
            };
        }),
    };
}

export default function LessonsQuizDetail() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const {
        data: lesson,
        isLoading: lessonLoading,
        error: lessonError,
        refetch: refetchLesson,
    } = useLesson(id);

    const {
        data: quizzesData,
        isLoading: quizzesLoading,
        refetch: refetchQuizzes,
    } = useLessonQuizzesByLesson(id);

    const { mutateAsync: createQuizAsync, isPending: isCreatingQuiz } =
        useCreateLessonQuiz();
    const { mutateAsync: deleteQuizAsync, isPending: isDeletingQuiz } =
        useDeleteLessonQuiz();
    const { mutateAsync: updateQuizAsync, isPending: isUpdatingQuiz } =
        useUpdateLessonQuiz();

    const { mutateAsync: createQuestionAsync, isPending: isCreatingQuestion } =
        useCreateLessonQuizQuestion();
    const { mutateAsync: deleteQuestionAsync, isPending: isDeletingQuestion } =
        useDeleteLessonQuizQuestion();
    const { mutateAsync: updateQuestionAsync, isPending: isUpdatingQuestion } =
        useUpdateLessonQuizQuestion();

    const { mutateAsync: createOptionAsync, isPending: isCreatingOption } =
        useCreateLessonQuizOption();
    const { execute } = useMutationHandler();

    const [expandedQuizzes, setExpandedQuizzes] = useState<string[]>([]);
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
    const [isAddingQuiz, setIsAddingQuiz] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState<string | null>(
        null
    );
    const [newQuiz, setNewQuiz] =
        useState<Omit<NewLessonQuizData, "lessonId">>(DEFAULT_NEW_QUIZ);
    const [newQuestion, setNewQuestion] =
        useState<NewLessonQuestionFormData>(DEFAULT_NEW_QUESTION);

    // Edit states
    const [editingQuiz, setEditingQuiz] =
        useState<LessonQuizWithQuestions | null>(null);
    const [editQuizData, setEditQuizData] =
        useState<Omit<NewLessonQuizData, "lessonId">>(DEFAULT_NEW_QUIZ);
    const [editingQuestion, setEditingQuestion] = useState<{
        quizId: string;
        question: LessonQuizQuestionWithOptions;
    } | null>(null);
    const [editQuestionData, setEditQuestionData] =
        useState<NewLessonQuestionFormData>(DEFAULT_NEW_QUESTION);

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

    const quizzes: LessonQuiz[] = quizzesData?.items || [];

    // Get the first expanded quiz ID for fetching questions
    const firstExpandedQuizId = expandedQuizzes[0] || null;

    // Fetch questions only for expanded quizzes
    const {
        data: questionsData,
        isLoading: questionsLoading,
        refetch: refetchQuestions,
    } = useLessonQuizQuestionsByQuiz(
        firstExpandedQuizId,
        { page: 1 },
        {
            enabled: !!firstExpandedQuizId,
        }
    );

    // Get the first expanded question ID for fetching options
    const firstExpandedQuestionId = expandedQuestions[0] || null;

    // Fetch options only for expanded questions
    const {
        data: optionsData,
        isLoading: optionsLoading,
        refetch: refetchOptions,
    } = useLessonQuizOptionsByQuestion(
        firstExpandedQuestionId,
        { page: 1 },
        {
            enabled: !!firstExpandedQuestionId,
        }
    );
    const questions = questionsData?.items || [];
    const options = optionsData?.items || [];

    const transformedQuizzes: LessonQuizWithQuestions[] = quizzes.map((quiz) =>
        transformQuizToUI(quiz, questions, options)
    );

    const toggleQuizExpand = (quizId: string) => {
        setExpandedQuizzes((prev) =>
            prev.includes(quizId)
                ? prev.filter((qid) => qid !== quizId)
                : [...prev, quizId]
        );
    };

    const toggleQuestionExpand = (questionId: string) => {
        setExpandedQuestions((prev) =>
            prev.includes(questionId)
                ? prev.filter((qid) => qid !== questionId)
                : [...prev, questionId]
        );
    };

    const resetNewQuiz = () => setNewQuiz(DEFAULT_NEW_QUIZ);
    const resetNewQuestion = () => setNewQuestion(DEFAULT_NEW_QUESTION);

    const handleCreateQuiz = () => {
        if (!id) return;

        execute(
            () =>
                createQuizAsync({
                    lessonId: id,
                    timeLimit: newQuiz.timeLimit,
                    passingScore: newQuiz.passingScore,
                    maxAttempts: newQuiz.maxAttempts,
                    shuffleQuestions: newQuiz.shuffleQuestions,
                    showAnswers: newQuiz.showAnswers,
                }),
            {
                successMessage: t(
                    "lessons:quiz.messages.createSuccess",
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
                "lessons:quiz.messages.deleteSuccess",
                "Quiz deleted successfully"
            ),
            onSuccess: () => refetchQuizzes(),
        });
        setDeleteQuizDialog({ isOpen: false, quizId: null });
    };

    const handleEditQuiz = (quiz: LessonQuizWithQuestions) => {
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
                        lessonId: id,
                        timeLimit: editQuizData.timeLimit,
                        passingScore: editQuizData.passingScore,
                        maxAttempts: editQuizData.maxAttempts,
                        shuffleQuestions: editQuizData.shuffleQuestions,
                        showAnswers: editQuizData.showAnswers,
                    },
                }),
            {
                successMessage: t(
                    "lessons:quiz.messages.updateSuccess",
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
                    "lessons:quiz.messages.questionUpdateSuccess",
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

    const handleDeleteQuestion = (quizId: string, questionId: string) => {
        setDeleteQuestionDialog({ isOpen: true, quizId, questionId });
    };

    const confirmDeleteQuestion = async () => {
        if (!deleteQuestionDialog.questionId) return;
        await execute(
            () => deleteQuestionAsync(deleteQuestionDialog.questionId!),
            {
                successMessage: t(
                    "lessons:quiz.messages.questionDeleteSuccess",
                    "Question deleted successfully"
                ),
                onSuccess: () => refetchQuestions(),
            }
        );
        setDeleteQuestionDialog({
            isOpen: false,
            quizId: null,
            questionId: null,
        });
    };

    const handleCreateQuestion = async (quizId: string) => {
        const questionPayload = {
            quizId,
            question: newQuestion.question,
            type: newQuestion.type,
            points: newQuestion.points,
            order: newQuestion.order,
            explanation: newQuestion.explanation,
            isActive: newQuestion.isActive,
        };

        execute(
            async () => {
                const createdQuestion =
                    await createQuestionAsync(questionPayload);

                if (newQuestion.options.length > 0 && createdQuestion) {
                    await createOptionAsync({
                        questionId: String(createdQuestion.id),
                        options: newQuestion.options.map((opt, idx) => ({
                            optionText: opt.text,
                            isCorrect: opt.isCorrect,
                            order: idx + 1,
                        })),
                    });
                }
            },
            {
                successMessage: t(
                    "lessons:quiz.messages.questionCreateSuccess",
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

    const isLoading =
        lessonLoading || quizzesLoading || questionsLoading || optionsLoading;

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (lessonError || !lesson) {
        return (
            <ErrorState
                message={
                    lessonError?.message ||
                    t("errors.fetchFailed", "Failed to load lesson")
                }
                onRetry={refetchLesson}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: `${lesson.title} - ${t("lessons:quiz.title", "Lesson Quiz")}`,
                backButton: true,
            }}
        >
            {/* Lesson Quiz Info Alert */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {t("lessons:quiz.lessonQuizInfo", "Lesson Quiz")}
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            {t(
                                "lessons:quiz.lessonQuizInfoDescription",
                                "These quizzes help students reinforce their understanding of the lesson content."
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Lesson Quizzes Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t("lessons:quiz.lessonQuizzes", "Lesson Quizzes")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                "lessons:quiz.quizzesCount",
                                "{{count}} Quizzes",
                                {
                                    count: transformedQuizzes.length,
                                }
                            )}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsAddingQuiz(true)}
                        disabled={isCreatingQuiz}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        {t("lessons:quiz.addLessonQuiz", "Add Lesson Quiz")}
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
                                {t("lessons:quiz.noQuizzes", "No quizzes yet")}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                {t(
                                    "lessons:quiz.addFirstQuiz",
                                    "Click 'Add Lesson Quiz' to create your first quiz"
                                )}
                            </p>
                        </div>
                    ) : (
                        transformedQuizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz as any}
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

            {/* Quiz Purpose Notice */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                    <span className="font-medium">
                        {t("lessons:quiz.quizPurpose", "Quiz Purpose")}:
                    </span>{" "}
                    {t(
                        "lessons:quiz.quizPurposeDescription",
                        "Lesson quizzes are designed to test student comprehension of specific lesson content and provide immediate feedback."
                    )}
                </p>
            </div>

            {/* Edit Quiz Modal */}
            {editingQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("lessons:quiz.editQuiz", "Edit Quiz")}
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
                title={t("lessons:quiz.deleteDialog.title", "Delete Quiz")}
                message={t(
                    "lessons:quiz.deleteDialog.message",
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
                    "lessons:quiz.deleteQuestionDialog.title",
                    "Delete Question"
                )}
                message={t(
                    "lessons:quiz.deleteQuestionDialog.message",
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
                            {t("lessons:quiz.editQuestion", "Edit Question")}
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
