/**
 * Quiz Editor Component
 *
 * Form for creating/editing lesson quizzes with questions management.
 * Matches the design from the provided images.
 */

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Check,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Loader2,
    Edit2,
    Save,
    X,
} from "lucide-react";
import { ConfirmDialog } from "@/design-system";
import { useMutationHandler } from "@/shared/api";
import type { ApiError } from "@/shared/api/types";
import {
    useCreateLessonQuiz,
    useCreateLessonQuizQuestion,
    useDeleteLessonQuiz,
    useDeleteLessonQuizQuestion,
    useLessonQuizQuestionsByQuiz,
    useUpdateLessonQuiz,
    useUpdateLessonQuizQuestion,
} from "../../../api";
import {
    LessonQuestionType,
    LessonQuiz,
    LessonQuizOption,
    LessonQuizQuestion,
} from "../../../types";
import QuestionOptionsLoader from "./QuestionOptionsLoader";

interface QuizEditorProps {
    lessonId: string;
    quiz: LessonQuiz | null;
    onSave: () => void;
    onCancel: () => void;
    onDelete?: () => void;
}

interface QuizQuestionWithOptions extends LessonQuizQuestion {
    isExpanded: boolean;
    options: LessonQuizOption[];
}

export default function QuizEditor({
    lessonId,
    quiz,
    onSave,
    onCancel,
    onDelete,
}: QuizEditorProps) {
    const { t } = useTranslation();
    const isEditing = !!quiz;
    const { execute } = useMutationHandler();

    const { mutateAsync: createQuizAsync, isPending: isCreatingQuiz } =
        useCreateLessonQuiz();
    const { mutateAsync: updateQuizAsync, isPending: isUpdatingQuiz } =
        useUpdateLessonQuiz();
    const { mutateAsync: deleteQuizAsync, isPending: isDeletingQuiz } =
        useDeleteLessonQuiz();
    const { mutateAsync: createQuestionAsync, isPending: isCreatingQuestion } =
        useCreateLessonQuizQuestion();
    const { mutateAsync: updateQuestionAsync, isPending: isUpdatingQuestion } =
        useUpdateLessonQuizQuestion();
    const { mutateAsync: deleteQuestionAsync, isPending: isDeletingQuestion } =
        useDeleteLessonQuizQuestion();

    // Fetch questions for the selected quiz - lazy loaded when quiz is selected
    const { data: questionsData, isLoading: isLoadingQuestions } =
        useLessonQuizQuestionsByQuiz(quiz?.id ? String(quiz.id) : null, {
            page: 1,
        });

    // Transform questions data - options will be loaded lazily when expanded
    const quizQuestions = useMemo(() => {
        if (!quiz || !questionsData?.items) return [];

        return questionsData.items.map((question) => ({
            ...question,
            isExpanded: false,
            options: [] as LessonQuizOption[], // Options loaded lazily when expanded
        }));
    }, [quiz, questionsData]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        timeLimit: "30",
        passingScore: "60",
        maxAttempts: "3",
        shuffleQuestions: false,
        showAnswers: false,
    });

    const [questions, setQuestions] = useState<QuizQuestionWithOptions[]>([]);
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
        new Set()
    );
    const [isSaved, setIsSaved] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Question editing state
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
        null
    );
    const [editingQuestionData, setEditingQuestionData] = useState<{
        question: string;
        type: LessonQuestionType;
        points: number;
    } | null>(null);

    // New question form state
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
    const [newQuestionData, setNewQuestionData] = useState<{
        question: string;
        type: LessonQuestionType;
        points: number;
        explanation: string;
    }>({
        question: "",
        type: "single_choice",
        points: 10,
        explanation: "",
    });

    // Delete confirmation state
    const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(
        null
    );
    const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] =
        useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const isSaving = isCreatingQuiz || isUpdatingQuiz;
    const isDeleting = isDeletingQuiz;
    const isLoadingData = isLoadingQuestions;
    const isSavingQuestion = isCreatingQuestion || isUpdatingQuestion;

    // Update questions when data changes
    useEffect(() => {
        setQuestions(quizQuestions);
    }, [quizQuestions]);

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.lesson?.title || "",
                description: "",
                timeLimit: String(quiz.timeLimit) || "30",
                passingScore: String(quiz.passingScore) || "60",
                maxAttempts: String(quiz.maxAttempts) || "3",
                shuffleQuestions: Boolean(quiz.shuffleQuestions),
                showAnswers: Boolean(quiz.showAnswers),
            });
        }
    }, [quiz]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setIsSaved(false);
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleValidationError = (error: ApiError) => {
        if (error?.validationErrors) {
            const errors: Record<string, string> = {};
            Object.entries(error.validationErrors).forEach(
                ([field, messages]) => {
                    errors[field] = Array.isArray(messages)
                        ? messages[0]
                        : messages;
                }
            );
            setFieldErrors(errors);
        }
    };

    const handleShowAddQuestionForm = () => {
        setShowNewQuestionForm(true);
        setNewQuestionData({
            question: "",
            type: "single_choice",
            points: 10,
            explanation: "",
        });
    };

    const handleCancelAddQuestion = () => {
        setShowNewQuestionForm(false);
        setNewQuestionData({
            question: "",
            type: "single_choice",
            points: 10,
            explanation: "",
        });
    };

    const handleSubmitNewQuestion = () => {
        if (!quiz) return;

        execute(
            () =>
                createQuestionAsync({
                    quizId: String(quiz.id),
                    question: newQuestionData.question,
                    type: newQuestionData.type,
                    points: newQuestionData.points,
                    order: questions.length + 1,
                    explanation: newQuestionData.explanation || "-",
                    isActive: true,
                }),
            {
                successMessage: t(
                    "learning:lessons.content.quizzes.toast.questionAddedMessage",
                    "New question has been added"
                ),
                onSuccess: () => handleCancelAddQuestion(),
            }
        );
    };

    const handleDeleteQuestion = () => {
        if (!deleteQuestionId) return;

        // Skip temp questions (not yet saved)
        if (deleteQuestionId.startsWith("temp-")) {
            setQuestions((prev) =>
                prev.filter((q) => String(q.id) !== deleteQuestionId)
            );
            setShowDeleteQuestionDialog(false);
            setDeleteQuestionId(null);
            return;
        }

        execute(() => deleteQuestionAsync(deleteQuestionId), {
            successMessage: t(
                "learning:lessons.content.quizzes.toast.questionDeletedMessage",
                "Question has been deleted"
            ),
            onSuccess: () => {
                setShowDeleteQuestionDialog(false);
                setDeleteQuestionId(null);
            },
        });
    };

    const confirmDeleteQuestion = (id: string) => {
        setDeleteQuestionId(id);
        setShowDeleteQuestionDialog(true);
    };

    // Edit question handlers
    const startEditQuestion = (question: QuizQuestionWithOptions) => {
        setEditingQuestionId(String(question.id));
        setEditingQuestionData({
            question: question.question,
            type: question.type,
            points: question.points,
        });
    };

    const cancelEditQuestion = () => {
        setEditingQuestionId(null);
        setEditingQuestionData(null);
    };

    const saveEditQuestion = () => {
        if (!editingQuestionId || !editingQuestionData) return;

        execute(
            () =>
                updateQuestionAsync({
                    id: editingQuestionId,
                    data: editingQuestionData,
                }),
            {
                successMessage: t(
                    "learning:lessons.content.quizzes.toast.questionUpdatedMessage",
                    "Question has been updated"
                ),
                onSuccess: () => cancelEditQuestion(),
            }
        );
    };

    const toggleQuestionExpand = (id: string) => {
        setExpandedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const isQuestionExpanded = (id: string) => expandedQuestions.has(id);

    const handleSaveChanges = async () => {
        await handleSave();
    };

    const handleSave = () => {
        const payload = {
            lessonId: lessonId,
            timeLimit: Number(formData.timeLimit) || 30,
            passingScore: Number(formData.passingScore) || 60,
            maxAttempts: Number(formData.maxAttempts) || 3,
            shuffleQuestions: formData.shuffleQuestions,
            showAnswers: formData.showAnswers,
        };

        setFieldErrors({});

        if (isEditing && quiz) {
            execute(
                () => updateQuizAsync({ id: String(quiz.id), data: payload }),
                {
                    successMessage: t(
                        "learning:lessons.content.quizzes.toast.updateSuccessMessage",
                        "Quiz has been updated successfully"
                    ),
                    onSuccess: () => {
                        setIsSaved(true);
                        onSave();
                    },
                    onError: handleValidationError,
                }
            );
        } else {
            execute(() => createQuizAsync(payload), {
                successMessage: t(
                    "learning:lessons.content.quizzes.toast.createSuccessMessage",
                    "Quiz has been created successfully"
                ),
                onSuccess: () => {
                    setIsSaved(true);
                    onSave();
                },
                onError: handleValidationError,
            });
        }
    };

    const handleDeleteQuiz = () => {
        if (!quiz) return;

        execute(() => deleteQuizAsync(String(quiz.id)), {
            successMessage: t(
                "learning:lessons.content.quizzes.toast.deleteSuccessMessage",
                "Quiz has been deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteDialog(false);
                onDelete?.();
            },
        });
    };

    const getQuestionTypeLabel = (type: LessonQuestionType) => {
        switch (type) {
            case "single_choice":
                return t(
                    "learning:lessons.content.quizzes.questionTypes.singleChoice",
                    "Single Choice"
                );
            case "multiple_choice":
                return t(
                    "learning:lessons.content.quizzes.questionTypes.multipleChoice",
                    "Multiple Choice"
                );
            case "true_false":
                return t(
                    "learning:lessons.content.quizzes.questionTypes.trueFalse",
                    "True/False"
                );
            default:
                return type;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {t(
                            "learning:lessons.content.quizzes.editor.title",
                            "Quiz Editor"
                        )}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "learning:lessons.content.quizzes.editor.subtitle",
                            "Configure content details and settings"
                        )}
                    </p>
                </div>
                {isSaved && (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        {t("common.saved", "Saved")}
                    </span>
                )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("learning:lessons.content.fields.title", "Title")} *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder={t(
                            "learning:lessons.content.quizzes.titlePlaceholder",
                            "Enter quiz title..."
                        )}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none ${fieldErrors.title ? "border-red-500" : "border-gray-200 dark:border-gray-600"}`}
                    />
                    {fieldErrors.title && (
                        <p className="mt-1 text-sm text-red-500">
                            {fieldErrors.title}
                        </p>
                    )}
                </div>

                {/* Description / Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "learning:lessons.content.quizzes.instructions",
                            "Description / Instructions"
                        )}
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        placeholder={t(
                            "learning:lessons.content.quizzes.instructionsPlaceholder",
                            "Provide quiz instructions..."
                        )}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
                    />
                </div>

                {/* Time Limit, Passing Score, Attempts */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t(
                                "learning:lessons.content.quizzes.timeLimit",
                                "Time Limit (minutes)"
                            )}
                        </label>
                        <input
                            type="number"
                            value={formData.timeLimit}
                            onChange={(e) =>
                                handleChange("timeLimit", e.target.value)
                            }
                            placeholder="30"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t(
                                "learning:lessons.content.quizzes.passingScore",
                                "Passing Score (%)"
                            )}
                        </label>
                        <input
                            type="number"
                            value={formData.passingScore}
                            onChange={(e) =>
                                handleChange("passingScore", e.target.value)
                            }
                            placeholder="60"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t(
                                "learning:lessons.content.quizzes.attemptsAllowed",
                                "Attempts Allowed"
                            )}
                        </label>
                        <input
                            type="number"
                            value={formData.maxAttempts}
                            onChange={(e) =>
                                handleChange("maxAttempts", e.target.value)
                            }
                            placeholder="3"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Quiz Questions Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {t(
                            "learning:lessons.content.quizzes.questions",
                            "Quiz Questions"
                        )}{" "}
                        ({questions.length})
                    </h4>
                    <button
                        onClick={handleShowAddQuestionForm}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t(
                            "learning:lessons.content.quizzes.addQuestion",
                            "Add Question"
                        )}
                    </button>
                </div>

                {/* New Question Form */}
                {showNewQuestionForm && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                            {t(
                                "learning:lessons.content.quizzes.newQuestion",
                                "New Question"
                            )}
                        </h5>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t(
                                        "learning:lessons.content.quizzes.questionText",
                                        "Question Text"
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={newQuestionData.question}
                                    onChange={(e) =>
                                        setNewQuestionData({
                                            ...newQuestionData,
                                            question: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    placeholder={t(
                                        "learning:lessons.content.quizzes.questionPlaceholder",
                                        "Enter question..."
                                    )}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t(
                                            "learning:lessons.content.quizzes.questionType",
                                            "Type"
                                        )}
                                    </label>
                                    <select
                                        value={newQuestionData.type}
                                        onChange={(e) =>
                                            setNewQuestionData({
                                                ...newQuestionData,
                                                type: e.target
                                                    .value as LessonQuestionType,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="single_choice">
                                            {t(
                                                "learning:lessons.content.quizzes.questionTypes.singleChoice",
                                                "Single Choice"
                                            )}
                                        </option>
                                        <option value="multiple_choice">
                                            {t(
                                                "learning:lessons.content.quizzes.questionTypes.multipleChoice",
                                                "Multiple Choice"
                                            )}
                                        </option>
                                        <option value="true_false">
                                            {t(
                                                "learning:lessons.content.quizzes.questionTypes.trueFalse",
                                                "True/False"
                                            )}
                                        </option>
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t(
                                            "learning:lessons.content.quizzes.points",
                                            "Points"
                                        )}
                                    </label>
                                    <input
                                        type="number"
                                        value={newQuestionData.points}
                                        onChange={(e) =>
                                            setNewQuestionData({
                                                ...newQuestionData,
                                                points: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t(
                                        "learning:lessons.content.quizzes.explanation",
                                        "Explanation"
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={newQuestionData.explanation}
                                    onChange={(e) =>
                                        setNewQuestionData({
                                            ...newQuestionData,
                                            explanation: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    placeholder={t(
                                        "learning:lessons.content.quizzes.explanationPlaceholder",
                                        "Explanation shown after answering..."
                                    )}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancelAddQuestion}
                                    className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    {t("common.cancel", "Cancel")}
                                </button>
                                <button
                                    onClick={handleSubmitNewQuestion}
                                    disabled={
                                        isSavingQuestion ||
                                        !newQuestionData.question.trim()
                                    }
                                    className="px-3 py-1.5 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSavingQuestion ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    {t(
                                        "learning:lessons.content.quizzes.addQuestion",
                                        "Add Question"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Questions List */}
                <div className="space-y-3">
                    {isLoadingData ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : questions.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                            {t(
                                "learning:lessons.content.quizzes.noQuestions",
                                "No questions yet. Click 'Add Question' to create one."
                            )}
                        </p>
                    ) : (
                        questions.map((question, index) => (
                            <div
                                key={question.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                            >
                                <div
                                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    onClick={() =>
                                        toggleQuestionExpand(
                                            String(question.id)
                                        )
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
                                                        "learning:lessons.content.quizzes.newQuestion",
                                                        "New Question"
                                                    )}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {getQuestionTypeLabel(
                                                    question.type
                                                )}{" "}
                                                • {question.points}{" "}
                                                {t(
                                                    "learning:lessons.content.quizzes.points",
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
                                                confirmDeleteQuestion(
                                                    String(question.id)
                                                );
                                            }}
                                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {isQuestionExpanded(
                                            String(question.id)
                                        ) ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Question Edit Form */}
                                {editingQuestionId === String(question.id) &&
                                    editingQuestionData && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border-t border-blue-200 dark:border-blue-500/30">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        {t(
                                                            "learning:lessons.content.quizzes.questionText",
                                                            "Question Text"
                                                        )}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            editingQuestionData.question
                                                        }
                                                        onChange={(e) =>
                                                            setEditingQuestionData(
                                                                {
                                                                    ...editingQuestionData,
                                                                    question:
                                                                        e.target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        placeholder={t(
                                                            "learning:lessons.content.quizzes.questionPlaceholder",
                                                            "Enter question..."
                                                        )}
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="flex-1">
                                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            {t(
                                                                "learning:lessons.content.quizzes.questionType",
                                                                "Type"
                                                            )}
                                                        </label>
                                                        <select
                                                            value={
                                                                editingQuestionData.type
                                                            }
                                                            onChange={(e) =>
                                                                setEditingQuestionData(
                                                                    {
                                                                        ...editingQuestionData,
                                                                        type: e
                                                                            .target
                                                                            .value as LessonQuestionType,
                                                                    }
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        >
                                                            <option value="single_choice">
                                                                {t(
                                                                    "learning:lessons.content.quizzes.questionTypes.singleChoice",
                                                                    "Single Choice"
                                                                )}
                                                            </option>
                                                            <option value="multiple_choice">
                                                                {t(
                                                                    "learning:lessons.content.quizzes.questionTypes.multipleChoice",
                                                                    "Multiple Choice"
                                                                )}
                                                            </option>
                                                            <option value="true_false">
                                                                {t(
                                                                    "learning:lessons.content.quizzes.questionTypes.trueFalse",
                                                                    "True/False"
                                                                )}
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div className="w-24">
                                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            {t(
                                                                "learning:lessons.content.quizzes.points",
                                                                "Points"
                                                            )}
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={
                                                                editingQuestionData.points
                                                            }
                                                            onChange={(e) =>
                                                                setEditingQuestionData(
                                                                    {
                                                                        ...editingQuestionData,
                                                                        points: Number(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ),
                                                                    }
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={
                                                            cancelEditQuestion
                                                        }
                                                        className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={
                                                            saveEditQuestion
                                                        }
                                                        disabled={
                                                            isSavingQuestion
                                                        }
                                                        className="px-3 py-1.5 text-sm text-white bg-brand-500 hover:bg-brand-600 rounded-lg disabled:opacity-50"
                                                    >
                                                        {isSavingQuestion ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Save className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {/* Question Options - Lazy loaded when expanded */}
                                {isQuestionExpanded(String(question.id)) && (
                                    <QuestionOptionsLoader
                                        question={question}
                                        questionType={question.type}
                                    />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isSaving || isDeleting}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    {isEditing && (
                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isSaving || isDeleting}
                            className="flex items-center gap-1 text-sm text-error-500 hover:text-error-600 disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            {t("common.delete", "Delete")}
                        </button>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSaveChanges}
                        disabled={isSaving || isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("common.saving", "Saving...")}
                            </span>
                        ) : (
                            t("common.saveChanges", "Save Changes")
                        )}
                    </button>
                </div>
            </div>

            {/* Delete Quiz Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                variant="danger"
                title={t(
                    "learning:lessons.content.quizzes.deleteDialog.title",
                    "Delete Quiz"
                )}
                message={t(
                    "learning:lessons.content.quizzes.deleteDialog.message",
                    "Are you sure you want to delete this quiz? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDeleteQuiz}
                loading={isDeleting}
            />

            {/* Delete Question Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteQuestionDialog}
                onClose={() => {
                    setShowDeleteQuestionDialog(false);
                    setDeleteQuestionId(null);
                }}
                variant="danger"
                title={t(
                    "learning:lessons.content.quizzes.deleteQuestionDialog.title",
                    "Delete Question"
                )}
                message={t(
                    "learning:lessons.content.quizzes.deleteQuestionDialog.message",
                    "Are you sure you want to delete this question? All options will also be deleted."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleDeleteQuestion}
                loading={isDeletingQuestion}
            />
        </div>
    );
}
