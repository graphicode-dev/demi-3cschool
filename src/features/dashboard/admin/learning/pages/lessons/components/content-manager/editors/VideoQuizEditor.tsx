/**
 * Video Quiz Editor Component
 *
 * 3-level navigation for video quizzes:
 * 1. Quizzes list - paginated list of quizzes for the video
 * 2. Questions list - when clicking a quiz, show its questions with back button
 * 3. Options list - when clicking a question, show its options with back button
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Check,
    Plus,
    Trash2,
    Loader2,
    Edit2,
    Save,
    X,
    ArrowLeft,
    ChevronRight,
} from "lucide-react";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import {
    useCreateLessonVideoQuiz,
    useDeleteLessonVideoQuiz,
    useUpdateLessonVideoQuiz,
    useLessonVideoQuizzesByVideo,
    useCreateLessonVideoQuizQuestion,
    useUpdateLessonVideoQuizQuestion,
    useDeleteLessonVideoQuizQuestion,
    useLessonVideoQuizQuestionsByQuiz,
    useCreateLessonVideoQuizOption,
    useUpdateLessonVideoQuizOption,
    useDeleteLessonVideoQuizOption,
    useLessonVideoQuizOptionsByQuestion,
} from "../../../api";
import { useMutationHandler } from "@/shared/api";
import type {
    LessonVideoQuiz,
    LessonVideoQuizQuestion,
    LessonVideoQuizQuestionType,
    LessonVideoQuizOption,
} from "../../../types";

interface VideoQuizEditorProps {
    videoId: string;
    onSave: () => void;
    onCancel: () => void;
}

type ViewMode = "quizzes" | "questions" | "options";

export default function VideoQuizEditor({
    videoId,
    onSave,
    onCancel,
}: VideoQuizEditorProps) {
    const { t } = useTranslation();
    const { execute } = useMutationHandler();

    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode>("quizzes");
    const [selectedQuiz, setSelectedQuiz] = useState<LessonVideoQuiz | null>(
        null
    );
    const [selectedQuestion, setSelectedQuestion] =
        useState<LessonVideoQuizQuestion | null>(null);

    // Pagination state
    const [quizPage, setQuizPage] = useState(1);
    const [questionsPage, setQuestionsPage] = useState(1);
    const [optionsPage, setOptionsPage] = useState(1);

    // Quiz data - fetch by video ID
    const { data: quizzesData, isLoading: isLoadingQuizzes } =
        useLessonVideoQuizzesByVideo(videoId, { page: quizPage });

    // Questions data - fetch by quiz ID
    const { data: questionsData, isLoading: isLoadingQuestions } =
        useLessonVideoQuizQuestionsByQuiz(
            selectedQuiz ? String(selectedQuiz.id) : null,
            { page: questionsPage }
        );

    // Options data - fetch by question ID
    const { data: optionsData, isLoading: isLoadingOptions } =
        useLessonVideoQuizOptionsByQuestion(
            selectedQuestion ? String(selectedQuestion.id) : null,
            { page: optionsPage }
        );

    // Quiz mutations
    const { mutateAsync: createQuizAsync, isPending: isCreatingQuiz } =
        useCreateLessonVideoQuiz();
    const { mutateAsync: updateQuizAsync, isPending: isUpdatingQuiz } =
        useUpdateLessonVideoQuiz();
    const { mutateAsync: deleteQuizAsync, isPending: isDeletingQuiz } =
        useDeleteLessonVideoQuiz();

    // Question mutations
    const { mutateAsync: createQuestionAsync, isPending: isCreatingQuestion } =
        useCreateLessonVideoQuizQuestion();
    const { mutateAsync: updateQuestionAsync, isPending: isUpdatingQuestion } =
        useUpdateLessonVideoQuizQuestion();
    const { mutateAsync: deleteQuestionAsync, isPending: isDeletingQuestion } =
        useDeleteLessonVideoQuizQuestion();

    // Option mutations
    const { mutateAsync: createOptionAsync, isPending: isCreatingOption } =
        useCreateLessonVideoQuizOption();
    const { mutateAsync: updateOptionAsync, isPending: isUpdatingOption } =
        useUpdateLessonVideoQuizOption();
    const { mutateAsync: deleteOptionAsync, isPending: isDeletingOption } =
        useDeleteLessonVideoQuizOption();

    // Edit states
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
        null
    );
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

    // Form data for editing
    const [quizFormData, setQuizFormData] = useState({
        timeLimit: 60,
        passingScore: 60,
        maxAttempts: 1,
        shuffleQuestions: false,
        showAnswers: true,
    });

    const [questionFormData, setQuestionFormData] = useState({
        question: "",
        type: "single_choice" as LessonVideoQuizQuestionType,
        points: 10,
        explanation: "",
    });

    const [optionFormData, setOptionFormData] = useState({
        optionText: "",
        isCorrect: false,
    });

    // New item forms
    const [showNewQuizForm, setShowNewQuizForm] = useState(false);
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
    const [showNewOptionForm, setShowNewOptionForm] = useState(false);

    // Delete confirmation
    const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);
    const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(
        null
    );
    const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null);

    // Navigation handlers
    const handleQuizClick = (quiz: LessonVideoQuiz) => {
        setSelectedQuiz(quiz);
        setQuestionsPage(1);
        setViewMode("questions");
    };

    const handleQuestionClick = (question: LessonVideoQuizQuestion) => {
        setSelectedQuestion(question);
        setOptionsPage(1);
        setViewMode("options");
    };

    const handleBackToQuizzes = () => {
        setSelectedQuiz(null);
        setSelectedQuestion(null);
        setViewMode("quizzes");
    };

    const handleBackToQuestions = () => {
        setSelectedQuestion(null);
        setViewMode("questions");
    };

    // Quiz CRUD
    const handleCreateQuiz = () => {
        execute(
            () =>
                createQuizAsync({
                    lessonVideoId: videoId,
                    timeLimit: quizFormData.timeLimit,
                    passingScore: quizFormData.passingScore,
                    maxAttempts: quizFormData.maxAttempts,
                    shuffleQuestions: quizFormData.shuffleQuestions,
                    showAnswers: quizFormData.showAnswers,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.createSuccess",
                    "Quiz created successfully"
                ),
                onSuccess: () => {
                    setShowNewQuizForm(false);
                    setQuizFormData({
                        timeLimit: 60,
                        passingScore: 60,
                        maxAttempts: 1,
                        shuffleQuestions: false,
                        showAnswers: true,
                    });
                },
            }
        );
    };

    const handleUpdateQuiz = (quizId: string) => {
        execute(
            () =>
                updateQuizAsync({
                    id: quizId,
                    data: {
                        timeLimit: quizFormData.timeLimit,
                        passingScore: quizFormData.passingScore,
                        maxAttempts: quizFormData.maxAttempts,
                        shuffleQuestions: quizFormData.shuffleQuestions,
                        showAnswers: quizFormData.showAnswers,
                    },
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.updateSuccess",
                    "Quiz updated successfully"
                ),
                onSuccess: () => setEditingQuizId(null),
            }
        );
    };

    const handleDeleteQuiz = () => {
        if (!deleteQuizId) return;
        execute(() => deleteQuizAsync(deleteQuizId), {
            successMessage: t(
                "lessons:videoQuiz.messages.deleteSuccess",
                "Quiz deleted successfully"
            ),
            onSuccess: () => setDeleteQuizId(null),
        });
    };

    const startEditQuiz = (quiz: LessonVideoQuiz) => {
        setEditingQuizId(String(quiz.id));
        setQuizFormData({
            timeLimit: quiz.timeLimit || 60,
            passingScore: quiz.passingScore || 60,
            maxAttempts: quiz.maxAttempts || 1,
            shuffleQuestions:
                quiz.shuffleQuestions === 1 || quiz.shuffleQuestions === true,
            showAnswers: quiz.showAnswers === 1 || quiz.showAnswers === true,
        });
    };

    // Question CRUD
    const handleCreateQuestion = () => {
        if (!selectedQuiz) return;
        execute(
            () =>
                createQuestionAsync({
                    quizId: String(selectedQuiz.id),
                    question: questionFormData.question,
                    type: questionFormData.type,
                    points: questionFormData.points,
                    order: (questionsData?.items?.length || 0) + 1,
                    explanation: questionFormData.explanation || "-",
                    isActive: true,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.questionAdded",
                    "Question added successfully"
                ),
                onSuccess: () => {
                    setShowNewQuestionForm(false);
                    setQuestionFormData({
                        question: "",
                        type: "single_choice",
                        points: 10,
                        explanation: "",
                    });
                },
            }
        );
    };

    const handleUpdateQuestion = (questionId: string) => {
        execute(
            () =>
                updateQuestionAsync({
                    id: questionId,
                    data: questionFormData,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.questionUpdated",
                    "Question updated successfully"
                ),
                onSuccess: () => setEditingQuestionId(null),
            }
        );
    };

    const handleDeleteQuestion = () => {
        if (!deleteQuestionId) return;
        execute(() => deleteQuestionAsync(deleteQuestionId), {
            successMessage: t(
                "lessons:videoQuiz.messages.questionDeleted",
                "Question deleted successfully"
            ),
            onSuccess: () => setDeleteQuestionId(null),
        });
    };

    const startEditQuestion = (question: LessonVideoQuizQuestion) => {
        setEditingQuestionId(String(question.id));
        setQuestionFormData({
            question: question.question,
            type: question.type,
            points: question.points,
            explanation: question.explanation || "",
        });
    };

    // Option CRUD
    const handleCreateOption = () => {
        if (!selectedQuestion) return;
        execute(
            () =>
                createOptionAsync({
                    questionId: String(selectedQuestion.id),
                    optionText: optionFormData.optionText,
                    isCorrect: optionFormData.isCorrect,
                    order: (optionsData?.items?.length || 0) + 1,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.optionAdded",
                    "Option added successfully"
                ),
                onSuccess: () => {
                    setShowNewOptionForm(false);
                    setOptionFormData({ optionText: "", isCorrect: false });
                },
            }
        );
    };

    const handleUpdateOption = (optionId: string) => {
        execute(
            () =>
                updateOptionAsync({
                    id: optionId,
                    data: optionFormData,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.optionUpdated",
                    "Option updated successfully"
                ),
                onSuccess: () => setEditingOptionId(null),
            }
        );
    };

    const handleDeleteOption = () => {
        if (!deleteOptionId) return;
        execute(() => deleteOptionAsync(deleteOptionId), {
            successMessage: t(
                "lessons:videoQuiz.messages.optionDeleted",
                "Option deleted successfully"
            ),
            onSuccess: () => setDeleteOptionId(null),
        });
    };

    const startEditOption = (option: LessonVideoQuizOption) => {
        setEditingOptionId(String(option.id));
        setOptionFormData({
            optionText: option.optionText,
            isCorrect: Boolean(option.isCorrect),
        });
    };

    const getQuestionTypeLabel = (type: LessonVideoQuizQuestionType) => {
        switch (type) {
            case "single_choice":
                return t(
                    "lessons:content.quizzes.questionTypes.singleChoice",
                    "Single Choice"
                );
            case "multiple_choice":
                return t(
                    "lessons:content.quizzes.questionTypes.multipleChoice",
                    "Multiple Choice"
                );
            case "true_false":
                return t(
                    "lessons:content.quizzes.questionTypes.trueFalse",
                    "True/False"
                );
            case "short_answer":
                return t(
                    "lessons:content.quizzes.questionTypes.shortAnswer",
                    "Short Answer"
                );
            default:
                return type;
        }
    };

    // Render Quizzes List View
    const renderQuizzesView = () => {
        const quizzes = quizzesData?.items || [];
        const pagination = quizzesData;

        return (
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("lessons:videoQuiz.quizzesList", "Video Quizzes")}
                    </h3>
                    <button
                        onClick={() => setShowNewQuizForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("lessons:videoQuiz.addQuiz", "Add Quiz")}
                    </button>
                </div>

                {/* New Quiz Form */}
                {showNewQuizForm && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                            {t("lessons:videoQuiz.newQuiz", "New Quiz")}
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t(
                                        "lessons:videoQuiz.timeLimit",
                                        "Time Limit (min)"
                                    )}
                                </label>
                                <input
                                    type="number"
                                    value={quizFormData.timeLimit}
                                    onChange={(e) =>
                                        setQuizFormData({
                                            ...quizFormData,
                                            timeLimit: Number(e.target.value),
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t(
                                        "lessons:videoQuiz.passingScore",
                                        "Passing Score (%)"
                                    )}
                                </label>
                                <input
                                    type="number"
                                    value={quizFormData.passingScore}
                                    onChange={(e) =>
                                        setQuizFormData({
                                            ...quizFormData,
                                            passingScore: Number(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t(
                                        "lessons:videoQuiz.maxAttempts",
                                        "Max Attempts"
                                    )}
                                </label>
                                <input
                                    type="number"
                                    value={quizFormData.maxAttempts}
                                    onChange={(e) =>
                                        setQuizFormData({
                                            ...quizFormData,
                                            maxAttempts: Number(e.target.value),
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => setShowNewQuizForm(false)}
                                className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                {t("common.cancel", "Cancel")}
                            </button>
                            <button
                                onClick={handleCreateQuiz}
                                disabled={isCreatingQuiz}
                                className="px-3 py-1.5 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {isCreatingQuiz && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                {t("common.create", "Create")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {isLoadingQuizzes && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                )}

                {/* Quizzes List */}
                {!isLoadingQuizzes && quizzes.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        {t(
                            "lessons:videoQuiz.noQuizzes",
                            "No quizzes yet. Click 'Add Quiz' to create one."
                        )}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                            >
                                {editingQuizId === String(quiz.id) ? (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10">
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t(
                                                        "lessons:videoQuiz.timeLimit",
                                                        "Time Limit"
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        quizFormData.timeLimit
                                                    }
                                                    onChange={(e) =>
                                                        setQuizFormData({
                                                            ...quizFormData,
                                                            timeLimit: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t(
                                                        "lessons:videoQuiz.passingScore",
                                                        "Passing %"
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        quizFormData.passingScore
                                                    }
                                                    onChange={(e) =>
                                                        setQuizFormData({
                                                            ...quizFormData,
                                                            passingScore:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        })
                                                    }
                                                    className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t(
                                                        "lessons:videoQuiz.maxAttempts",
                                                        "Attempts"
                                                    )}
                                                </label>
                                                <input
                                                    type="number"
                                                    value={
                                                        quizFormData.maxAttempts
                                                    }
                                                    onChange={(e) =>
                                                        setQuizFormData({
                                                            ...quizFormData,
                                                            maxAttempts: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="w-full px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    setEditingQuizId(null)
                                                }
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleUpdateQuiz(
                                                        String(quiz.id)
                                                    )
                                                }
                                                disabled={isUpdatingQuiz}
                                                className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded disabled:opacity-50"
                                            >
                                                {isUpdatingQuiz ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        onClick={() => handleQuizClick(quiz)}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {t(
                                                    "lessons:videoQuiz.quizTitle",
                                                    "Quiz"
                                                )}{" "}
                                                #{quiz.id}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t(
                                                    "lessons:videoQuiz.timeLimit",
                                                    "Time"
                                                )}
                                                : {quiz.timeLimit}min •{" "}
                                                {t(
                                                    "lessons:videoQuiz.passingScore",
                                                    "Pass"
                                                )}
                                                : {quiz.passingScore}% •{" "}
                                                {t(
                                                    "lessons:videoQuiz.maxAttempts",
                                                    "Attempts"
                                                )}
                                                : {quiz.maxAttempts}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditQuiz(quiz);
                                                }}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteQuizId(
                                                        String(quiz.id)
                                                    );
                                                }}
                                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() =>
                                setQuizPage((p) => Math.max(1, p - 1))
                            }
                            disabled={quizPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                        >
                            {t("common.previous", "Previous")}
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {quizPage} / {pagination.lastPage}
                        </span>
                        <button
                            onClick={() =>
                                setQuizPage((p) =>
                                    Math.min(pagination.lastPage, p + 1)
                                )
                            }
                            disabled={quizPage === pagination.lastPage}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                        >
                            {t("common.next", "Next")}
                        </button>
                    </div>
                )}

                {/* Cancel Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t("common.close", "Close")}
                    </button>
                </div>
            </div>
        );
    };

    // Render Questions List View
    const renderQuestionsView = () => {
        const questions = questionsData?.items || [];
        const pagination = questionsData;

        return (
            <div className="space-y-4">
                {/* Header with Back Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBackToQuizzes}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("lessons:videoQuiz.questions", "Questions")}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("lessons:videoQuiz.quizTitle", "Quiz")} #
                            {selectedQuiz?.id}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewQuestionForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("lessons:videoQuiz.addQuestion", "Add Question")}
                    </button>
                </div>

                {/* New Question Form */}
                {showNewQuestionForm && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                            {t("lessons:videoQuiz.newQuestion", "New Question")}
                        </h5>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t(
                                        "lessons:videoQuiz.questionText",
                                        "Question Text"
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={questionFormData.question}
                                    onChange={(e) =>
                                        setQuestionFormData({
                                            ...questionFormData,
                                            question: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    placeholder={t(
                                        "lessons:videoQuiz.questionPlaceholder",
                                        "Enter question..."
                                    )}
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t(
                                            "lessons:videoQuiz.questionType",
                                            "Type"
                                        )}
                                    </label>
                                    <select
                                        value={questionFormData.type}
                                        onChange={(e) =>
                                            setQuestionFormData({
                                                ...questionFormData,
                                                type: e.target
                                                    .value as LessonVideoQuizQuestionType,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="single_choice">
                                            {t(
                                                "lessons:content.quizzes.questionTypes.singleChoice",
                                                "Single Choice"
                                            )}
                                        </option>
                                        <option value="multiple_choice">
                                            {t(
                                                "lessons:content.quizzes.questionTypes.multipleChoice",
                                                "Multiple Choice"
                                            )}
                                        </option>
                                        <option value="true_false">
                                            {t(
                                                "lessons:content.quizzes.questionTypes.trueFalse",
                                                "True/False"
                                            )}
                                        </option>
                                        <option value="short_answer">
                                            {t(
                                                "lessons:content.quizzes.questionTypes.shortAnswer",
                                                "Short Answer"
                                            )}
                                        </option>
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t(
                                            "lessons:videoQuiz.points",
                                            "Points"
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        value={questionFormData.points}
                                        onChange={(e) =>
                                            setQuestionFormData({
                                                ...questionFormData,
                                                points: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() =>
                                        setShowNewQuestionForm(false)
                                    }
                                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    {t("common.cancel", "Cancel")}
                                </button>
                                <button
                                    onClick={handleCreateQuestion}
                                    disabled={
                                        isCreatingQuestion ||
                                        !questionFormData.question.trim()
                                    }
                                    className="px-3 py-1.5 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isCreatingQuestion && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    {t("common.create", "Create")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {isLoadingQuestions && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                )}

                {/* Questions List */}
                {!isLoadingQuestions && questions.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        {t(
                            "lessons:videoQuiz.noQuestions",
                            "No questions yet. Click 'Add Question' to create one."
                        )}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                            >
                                {editingQuestionId === String(question.id) ? (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10">
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={
                                                    questionFormData.question
                                                }
                                                onChange={(e) =>
                                                    setQuestionFormData({
                                                        ...questionFormData,
                                                        question:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                            />
                                            <div className="flex gap-3">
                                                <select
                                                    value={
                                                        questionFormData.type
                                                    }
                                                    onChange={(e) =>
                                                        setQuestionFormData({
                                                            ...questionFormData,
                                                            type: e.target
                                                                .value as LessonVideoQuizQuestionType,
                                                        })
                                                    }
                                                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                >
                                                    <option value="single_choice">
                                                        Single Choice
                                                    </option>
                                                    <option value="multiple_choice">
                                                        Multiple Choice
                                                    </option>
                                                    <option value="true_false">
                                                        True/False
                                                    </option>
                                                    <option value="short_answer">
                                                        Short Answer
                                                    </option>
                                                </select>
                                                <input
                                                    type="number"
                                                    value={
                                                        questionFormData.points
                                                    }
                                                    onChange={(e) =>
                                                        setQuestionFormData({
                                                            ...questionFormData,
                                                            points: Number(
                                                                e.target.value
                                                            ),
                                                        })
                                                    }
                                                    className="w-20 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setEditingQuestionId(
                                                            null
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuestion(
                                                            String(question.id)
                                                        )
                                                    }
                                                    disabled={
                                                        isUpdatingQuestion
                                                    }
                                                    className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded disabled:opacity-50"
                                                >
                                                    {isUpdatingQuestion ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Save className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        onClick={() =>
                                            handleQuestionClick(question)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                Q{index + 1}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {question.question ||
                                                        t(
                                                            "lessons:videoQuiz.newQuestion",
                                                            "New Question"
                                                        )}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {getQuestionTypeLabel(
                                                        question.type
                                                    )}{" "}
                                                    • {question.points}{" "}
                                                    {t(
                                                        "lessons:videoQuiz.points",
                                                        "points"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEditQuestion(question);
                                                }}
                                                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteQuestionId(
                                                        String(question.id)
                                                    );
                                                }}
                                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() =>
                                setQuestionsPage((p) => Math.max(1, p - 1))
                            }
                            disabled={questionsPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                        >
                            {t("common.previous", "Previous")}
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {questionsPage} / {pagination.lastPage}
                        </span>
                        <button
                            onClick={() =>
                                setQuestionsPage((p) =>
                                    Math.min(pagination.lastPage, p + 1)
                                )
                            }
                            disabled={questionsPage === pagination.lastPage}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                        >
                            {t("common.next", "Next")}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Render Options List View
    const renderOptionsView = () => {
        const options = optionsData?.items || [];
        const pagination = optionsData;

        return (
            <div className="space-y-4">
                {/* Header with Back Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBackToQuestions}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("lessons:videoQuiz.options", "Options")}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {selectedQuestion?.question}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNewOptionForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("lessons:videoQuiz.addOption", "Add Option")}
                    </button>
                </div>

                {/* New Option Form */}
                {showNewOptionForm && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={optionFormData.isCorrect}
                                onChange={(e) =>
                                    setOptionFormData({
                                        ...optionFormData,
                                        isCorrect: e.target.checked,
                                    })
                                }
                                className="w-4 h-4 text-green-500 rounded"
                            />
                            <input
                                type="text"
                                value={optionFormData.optionText}
                                onChange={(e) =>
                                    setOptionFormData({
                                        ...optionFormData,
                                        optionText: e.target.value,
                                    })
                                }
                                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder={t(
                                    "lessons:videoQuiz.optionPlaceholder",
                                    "Enter option text..."
                                )}
                            />
                            <button
                                onClick={() => setShowNewOptionForm(false)}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleCreateOption}
                                disabled={
                                    isCreatingOption ||
                                    !optionFormData.optionText.trim()
                                }
                                className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded disabled:opacity-50"
                            >
                                {isCreatingOption ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
                            {t(
                                "lessons:videoQuiz.markCorrectHint",
                                "Check the box if this is a correct answer"
                            )}
                        </p>
                    </div>
                )}

                {/* Loading */}
                {isLoadingOptions && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                )}

                {/* Options List */}
                {!isLoadingOptions && options.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        {t(
                            "lessons:videoQuiz.noOptions",
                            "No options yet. Click 'Add Option' to create one."
                        )}
                    </p>
                ) : (
                    <div className="space-y-2">
                        {options.map((option, index) => (
                            <div key={option.id}>
                                {editingOptionId === String(option.id) ? (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                                        <input
                                            type="checkbox"
                                            checked={optionFormData.isCorrect}
                                            onChange={(e) =>
                                                setOptionFormData({
                                                    ...optionFormData,
                                                    isCorrect: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4 text-green-500 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={optionFormData.optionText}
                                            onChange={(e) =>
                                                setOptionFormData({
                                                    ...optionFormData,
                                                    optionText: e.target.value,
                                                })
                                            }
                                            className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                        <button
                                            onClick={() =>
                                                setEditingOptionId(null)
                                            }
                                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleUpdateOption(
                                                    String(option.id)
                                                )
                                            }
                                            disabled={isUpdatingOption}
                                            className="p-1 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded disabled:opacity-50"
                                        >
                                            {isUpdatingOption ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={`flex items-center gap-2 p-3 rounded-lg ${
                                            option.isCorrect
                                                ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30"
                                                : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                        }`}
                                    >
                                        <span
                                            className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded ${
                                                option.isCorrect
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {option.isCorrect ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                String.fromCharCode(65 + index)
                                            )}
                                        </span>
                                        <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                                            {option.optionText ||
                                                t(
                                                    "lessons:videoQuiz.emptyOption",
                                                    "(empty)"
                                                )}
                                        </span>
                                        <button
                                            onClick={() =>
                                                startEditOption(option)
                                            }
                                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeleteOptionId(
                                                    String(option.id)
                                                )
                                            }
                                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() =>
                                setOptionsPage((p) => Math.max(1, p - 1))
                            }
                            disabled={optionsPage === 1}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                        >
                            {t("common.previous", "Previous")}
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {optionsPage} / {pagination.lastPage}
                        </span>
                        <button
                            onClick={() =>
                                setOptionsPage((p) =>
                                    Math.min(pagination.lastPage, p + 1)
                                )
                            }
                            disabled={optionsPage === pagination.lastPage}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
                        >
                            {t("common.next", "Next")}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {viewMode === "quizzes" && renderQuizzesView()}
            {viewMode === "questions" && renderQuestionsView()}
            {viewMode === "options" && renderOptionsView()}

            {/* Delete Quiz Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteQuizId}
                onClose={() => setDeleteQuizId(null)}
                variant="danger"
                title={t(
                    "lessons:videoQuiz.deleteDialog.title",
                    "Delete Video Quiz"
                )}
                message={t(
                    "lessons:videoQuiz.deleteDialog.message",
                    "Are you sure you want to delete this video quiz? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDeleteQuiz}
                loading={isDeletingQuiz}
            />

            {/* Delete Question Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteQuestionId}
                onClose={() => setDeleteQuestionId(null)}
                variant="danger"
                title={t(
                    "lessons:videoQuiz.deleteQuestionDialog.title",
                    "Delete Question"
                )}
                message={t(
                    "lessons:videoQuiz.deleteQuestionDialog.message",
                    "Are you sure you want to delete this question? All options will also be deleted."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDeleteQuestion}
                loading={isDeletingQuestion}
            />

            {/* Delete Option Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteOptionId}
                onClose={() => setDeleteOptionId(null)}
                variant="danger"
                title={t(
                    "lessons:videoQuiz.deleteOptionDialog.title",
                    "Delete Option"
                )}
                message={t(
                    "lessons:videoQuiz.deleteOptionDialog.message",
                    "Are you sure you want to delete this option?"
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDeleteOption}
                loading={isDeletingOption}
            />
        </div>
    );
}
