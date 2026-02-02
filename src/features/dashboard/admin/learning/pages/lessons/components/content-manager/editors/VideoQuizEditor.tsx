/**
 * Video Quiz Editor Component
 *
 * Form for creating/editing lesson video quizzes with questions and options management.
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
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import Pagination from "@/design-system/components/table/Pagination";
import {
    useCreateLessonVideoQuiz,
    useDeleteLessonVideoQuiz,
    useUpdateLessonVideoQuiz,
    useLessonVideoQuizzesList,
    useCreateLessonVideoQuizQuestion,
    useUpdateLessonVideoQuizQuestion,
    useDeleteLessonVideoQuizQuestion,
    useLessonVideoQuizQuestionsList,
    useCreateLessonVideoQuizOption,
    useUpdateLessonVideoQuizOption,
    useDeleteLessonVideoQuizOption,
    useLessonVideoQuizOptionsList,
} from "../../../api";
import { useMutationHandler } from "@/shared/api";
import type {
    LessonVideoQuizQuestion,
    LessonVideoQuizQuestionType,
    LessonVideoQuizOption,
} from "../../../types";

interface VideoQuizEditorProps {
    videoId: string;
    onSave: () => void;
    onCancel: () => void;
}

interface QuestionWithOptions extends LessonVideoQuizQuestion {
    options: LessonVideoQuizOption[];
}

export default function VideoQuizEditor({
    videoId,
    onSave,
    onCancel,
}: VideoQuizEditorProps) {
    const { t } = useTranslation();

    // Pagination state for quizzes
    const [quizPage, setQuizPage] = useState(1);

    // Quiz data (paginated)
    const { data: quizzesResponse, isLoading: isLoadingQuizzes } =
        useLessonVideoQuizzesList({ page: quizPage });

    const existingQuiz = useMemo(() => {
        const quizzes = quizzesResponse?.data ?? [];
        return (
            quizzes?.find(
                (q) => String(q.lessonVideo?.id) === String(videoId)
            ) ?? null
        );
    }, [quizzesResponse, videoId]);

    const quizPagination = quizzesResponse?.pagination;

    const isEditing = !!existingQuiz;

    // Questions data
    const { data: questionsResponse, isLoading: isLoadingQuestions } =
        useLessonVideoQuizQuestionsList(undefined, {
            enabled: !!existingQuiz,
        });

    // Options data
    const { data: optionsResponse, isLoading: isLoadingOptions } =
        useLessonVideoQuizOptionsList(undefined, {
            enabled: !!existingQuiz,
        });

    // Filter questions by quiz ID and merge with options
    const quizQuestions = useMemo(() => {
        if (!existingQuiz || !questionsResponse?.data) return [];

        const filteredQuestions = questionsResponse.data.filter(
            (q) => String(q.quiz?.id) === String(existingQuiz.id)
        );

        return filteredQuestions.map((question) => ({
            ...question,
            options:
                optionsResponse?.data?.filter(
                    (opt) => String(opt.question?.id) === String(question.id)
                ) || [],
        }));
    }, [existingQuiz, questionsResponse, optionsResponse]);

    // Quiz mutations
    const { mutateAsync: createMutateAsync, isPending: isCreating } =
        useCreateLessonVideoQuiz();
    const { mutateAsync: updateMutateAsync, isPending: isUpdating } =
        useUpdateLessonVideoQuiz();
    const { mutateAsync: deleteMutateAsync, isPending: isDeleting } =
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

    const { execute } = useMutationHandler();

    // Form state
    const [formData, setFormData] = useState({
        timeLimit: 60,
        passingScore: 60,
        maxAttempts: 1,
        shuffleQuestions: false,
        showAnswers: true,
    });

    const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
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
        type: LessonVideoQuizQuestionType;
        points: number;
    } | null>(null);

    // New question form state
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
    const [newQuestionData, setNewQuestionData] = useState({
        question: "",
        type: "single_choice" as LessonVideoQuizQuestionType,
        points: 10,
        explanation: "",
    });

    // Option editing state
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
    const [editingOptionData, setEditingOptionData] = useState<{
        optionText: string;
        isCorrect: boolean;
    } | null>(null);

    // New option form state
    const [addingOptionToQuestionId, setAddingOptionToQuestionId] = useState<
        string | null
    >(null);
    const [newOptionData, setNewOptionData] = useState({
        optionText: "",
        isCorrect: false,
    });

    // Delete confirmation state
    const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(
        null
    );
    const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null);
    const [showDeleteQuestionDialog, setShowDeleteQuestionDialog] =
        useState(false);
    const [showDeleteOptionDialog, setShowDeleteOptionDialog] = useState(false);

    const isSaving = isCreating || isUpdating;
    const isLoadingData = isLoadingQuestions || isLoadingOptions;
    const isSavingQuestion = isCreatingQuestion || isUpdatingQuestion;
    const isSavingOption = isCreatingOption || isUpdatingOption;

    // Update questions when data changes
    useEffect(() => {
        setQuestions(quizQuestions);
    }, [quizQuestions]);

    useEffect(() => {
        if (existingQuiz) {
            setFormData({
                timeLimit: existingQuiz.timeLimit || 60,
                passingScore: existingQuiz.passingScore || 60,
                maxAttempts: existingQuiz.maxAttempts || 1,
                shuffleQuestions:
                    existingQuiz.shuffleQuestions === 1 ||
                    existingQuiz.shuffleQuestions === true,
                showAnswers:
                    existingQuiz.showAnswers === 1 ||
                    existingQuiz.showAnswers === true,
            });
        }
    }, [existingQuiz]);

    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setIsSaved(false);
    };

    const handleSubmit = async () => {
        if (isEditing && existingQuiz) {
            execute(
                () =>
                    updateMutateAsync({
                        id: String(existingQuiz.id),
                        data: {
                            lessonVideoId: videoId,
                            timeLimit: formData.timeLimit,
                            passingScore: formData.passingScore,
                            maxAttempts: formData.maxAttempts,
                            shuffleQuestions: formData.shuffleQuestions,
                            showAnswers: formData.showAnswers,
                        },
                    }),
                {
                    successMessage: t(
                        "lessons:videoQuiz.messages.updateSuccess",
                        "Video quiz updated successfully"
                    ),
                    onSuccess: () => {
                        setIsSaved(true);
                        onSave();
                    },
                }
            );
        } else {
            execute(
                () =>
                    createMutateAsync({
                        lessonVideoId: videoId,
                        timeLimit: formData.timeLimit,
                        passingScore: formData.passingScore,
                        maxAttempts: formData.maxAttempts,
                        shuffleQuestions: formData.shuffleQuestions,
                        showAnswers: formData.showAnswers,
                    }),
                {
                    successMessage: t(
                        "lessons:videoQuiz.messages.createSuccess",
                        "Video quiz created successfully"
                    ),
                    onSuccess: () => {
                        setIsSaved(true);
                        onSave();
                    },
                }
            );
        }
    };

    const handleDelete = () => {
        if (!existingQuiz) return;
        execute(() => deleteMutateAsync(String(existingQuiz.id)), {
            successMessage: t(
                "lessons:videoQuiz.messages.deleteSuccess",
                "Video quiz deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteDialog(false);
                onCancel();
            },
        });
    };

    // Question handlers
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
        if (!existingQuiz) return;
        execute(
            () =>
                createQuestionAsync({
                    quizId: String(existingQuiz.id),
                    question: newQuestionData.question,
                    type: newQuestionData.type,
                    points: newQuestionData.points,
                    order: questions.length + 1,
                    explanation: newQuestionData.explanation || "-",
                    isActive: true,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.questionAdded",
                    "Question added successfully"
                ),
                onSuccess: () => handleCancelAddQuestion(),
            }
        );
    };

    const confirmDeleteQuestion = (id: string) => {
        setDeleteQuestionId(id);
        setShowDeleteQuestionDialog(true);
    };

    const handleDeleteQuestion = () => {
        if (!deleteQuestionId) return;
        execute(() => deleteQuestionAsync(deleteQuestionId), {
            successMessage: t(
                "lessons:videoQuiz.messages.questionDeleted",
                "Question deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteQuestionDialog(false);
                setDeleteQuestionId(null);
            },
        });
    };

    const startEditQuestion = (question: QuestionWithOptions) => {
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
                    "lessons:videoQuiz.messages.questionUpdated",
                    "Question updated successfully"
                ),
                onSuccess: () => cancelEditQuestion(),
            }
        );
    };

    const toggleQuestionExpand = (id: string) => {
        setExpandedQuestions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const isQuestionExpanded = (id: string) => expandedQuestions.has(id);

    // Option handlers
    const handleShowAddOptionForm = (questionId: string) => {
        setAddingOptionToQuestionId(questionId);
        setNewOptionData({ optionText: "", isCorrect: false });
    };

    const handleCancelAddOption = () => {
        setAddingOptionToQuestionId(null);
        setNewOptionData({ optionText: "", isCorrect: false });
    };

    const handleSubmitNewOption = () => {
        if (!addingOptionToQuestionId) return;
        const question = questions.find(
            (q) => String(q.id) === addingOptionToQuestionId
        );
        const optionCount = question?.options?.length || 0;
        execute(
            () =>
                createOptionAsync({
                    questionId: addingOptionToQuestionId,
                    optionText: newOptionData.optionText,
                    isCorrect: newOptionData.isCorrect,
                    order: optionCount + 1,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.optionAdded",
                    "Option added successfully"
                ),
                onSuccess: () => handleCancelAddOption(),
            }
        );
    };

    const confirmDeleteOption = (id: string) => {
        setDeleteOptionId(id);
        setShowDeleteOptionDialog(true);
    };

    const handleDeleteOption = () => {
        if (!deleteOptionId) return;
        execute(() => deleteOptionAsync(deleteOptionId), {
            successMessage: t(
                "lessons:videoQuiz.messages.optionDeleted",
                "Option deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteOptionDialog(false);
                setDeleteOptionId(null);
            },
        });
    };

    const startEditOption = (option: LessonVideoQuizOption) => {
        setEditingOptionId(String(option.id));
        setEditingOptionData({
            optionText: option.optionText,
            isCorrect: Boolean(option.isCorrect),
        });
    };

    const cancelEditOption = () => {
        setEditingOptionId(null);
        setEditingOptionData(null);
    };

    const saveEditOption = () => {
        if (!editingOptionId || !editingOptionData) return;
        execute(
            () =>
                updateOptionAsync({
                    id: editingOptionId,
                    data: editingOptionData,
                }),
            {
                successMessage: t(
                    "lessons:videoQuiz.messages.optionUpdated",
                    "Option updated successfully"
                ),
                onSuccess: () => cancelEditOption(),
            }
        );
    };

    const toggleOptionCorrect = async (
        option: LessonVideoQuizOption,
        question: QuestionWithOptions
    ) => {
        if (
            question.type === "single_choice" ||
            question.type === "true_false"
        ) {
            if (option.isCorrect) return;
            const otherOptions =
                question.options?.filter(
                    (opt) =>
                        String(opt.id) !== String(option.id) && opt.isCorrect
                ) || [];
            execute(async () => {
                for (const otherOpt of otherOptions) {
                    await updateOptionAsync({
                        id: String(otherOpt.id),
                        data: { isCorrect: false },
                    });
                }
                await updateOptionAsync({
                    id: String(option.id),
                    data: { isCorrect: true },
                });
            }, {});
        } else {
            execute(
                () =>
                    updateOptionAsync({
                        id: String(option.id),
                        data: { isCorrect: !option.isCorrect },
                    }),
                {}
            );
        }
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

    if (isLoadingQuizzes) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    // Show pagination when there are multiple pages
    const showQuizPagination = quizPagination && quizPagination.lastPage > 1;

    return (
        <div className="space-y-6">
            {/* Quiz Pagination */}
            {showQuizPagination && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Pagination
                        currentPage={quizPagination.currentPage}
                        totalPages={quizPagination.lastPage}
                        goToNextPage={() =>
                            setQuizPage((prev) =>
                                Math.min(prev + 1, quizPagination.lastPage)
                            )
                        }
                        goToPreviousPage={() =>
                            setQuizPage((prev) => Math.max(prev - 1, 1))
                        }
                        setPage={setQuizPage}
                        itemsPerPage={quizPagination.perPage}
                        totalItems={quizPagination.total}
                    />
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing
                        ? t("lessons:videoQuiz.editTitle", "Edit Video Quiz")
                        : t(
                              "lessons:videoQuiz.createTitle",
                              "Create Video Quiz"
                          )}
                </h3>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => setShowDeleteDialog(true)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title={t("common.delete", "Delete")}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "lessons:videoQuiz.timeLimit",
                            "Time Limit (minutes)"
                        )}
                    </label>
                    <input
                        type="number"
                        value={formData.timeLimit}
                        onChange={(e) =>
                            handleChange(
                                "timeLimit",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "lessons:videoQuiz.passingScore",
                            "Passing Score (%)"
                        )}
                    </label>
                    <input
                        type="number"
                        value={formData.passingScore}
                        onChange={(e) =>
                            handleChange(
                                "passingScore",
                                parseInt(e.target.value) || 0
                            )
                        }
                        min={0}
                        max={100}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("lessons:videoQuiz.maxAttempts", "Max Attempts")}
                    </label>
                    <input
                        type="number"
                        value={formData.maxAttempts}
                        onChange={(e) =>
                            handleChange(
                                "maxAttempts",
                                parseInt(e.target.value) || 1
                            )
                        }
                        min={1}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.shuffleQuestions}
                        onChange={(e) =>
                            handleChange("shuffleQuestions", e.target.checked)
                        }
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t(
                            "lessons:videoQuiz.shuffleQuestions",
                            "Shuffle Questions"
                        )}
                    </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.showAnswers}
                        onChange={(e) =>
                            handleChange("showAnswers", e.target.checked)
                        }
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {t(
                            "lessons:videoQuiz.showAnswers",
                            "Show Answers After Submission"
                        )}
                    </span>
                </label>
            </div>

            {/* Quiz Questions Section - Only show when editing */}
            {isEditing && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {t("lessons:videoQuiz.questions", "Quiz Questions")}{" "}
                            ({questions.length})
                        </h4>
                        <button
                            onClick={handleShowAddQuestionForm}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            {t("lessons:videoQuiz.addQuestion", "Add Question")}
                        </button>
                    </div>

                    {/* New Question Form */}
                    {showNewQuestionForm && (
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                                {t(
                                    "lessons:videoQuiz.newQuestion",
                                    "New Question"
                                )}
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
                                        value={newQuestionData.question}
                                        onChange={(e) =>
                                            setNewQuestionData({
                                                ...newQuestionData,
                                                question: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder={t(
                                            "lessons:videoQuiz.questionPlaceholder",
                                            "Enter question..."
                                        )}
                                        autoFocus
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
                                            value={newQuestionData.type}
                                            onChange={(e) =>
                                                setNewQuestionData({
                                                    ...newQuestionData,
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
                                            value={newQuestionData.points}
                                            onChange={(e) =>
                                                setNewQuestionData({
                                                    ...newQuestionData,
                                                    points: Number(
                                                        e.target.value
                                                    ),
                                                })
                                            }
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t(
                                            "lessons:videoQuiz.explanation",
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
                                            "lessons:videoQuiz.explanationPlaceholder",
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
                                            "lessons:videoQuiz.addQuestion",
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
                                    "lessons:videoQuiz.noQuestions",
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
                                    {editingQuestionId ===
                                        String(question.id) &&
                                        editingQuestionData && (
                                            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border-t border-blue-200 dark:border-blue-500/30">
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
                                                            value={
                                                                editingQuestionData.question
                                                            }
                                                            onChange={(e) =>
                                                                setEditingQuestionData(
                                                                    {
                                                                        ...editingQuestionData,
                                                                        question:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                                                                value={
                                                                    editingQuestionData.type
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingQuestionData(
                                                                        {
                                                                            ...editingQuestionData,
                                                                            type: e
                                                                                .target
                                                                                .value as LessonVideoQuizQuestionType,
                                                                        }
                                                                    )
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

                                    {/* Question Options */}
                                    {isQuestionExpanded(
                                        String(question.id)
                                    ) && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    {t(
                                                        "lessons:videoQuiz.options",
                                                        "Options"
                                                    )}
                                                    :
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        handleShowAddOptionForm(
                                                            String(question.id)
                                                        )
                                                    }
                                                    disabled={isSavingOption}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                    {t(
                                                        "lessons:videoQuiz.addOption",
                                                        "Add Option"
                                                    )}
                                                </button>
                                            </div>

                                            {/* New Option Form */}
                                            {addingOptionToQuestionId ===
                                                String(question.id) && (
                                                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                newOptionData.isCorrect
                                                            }
                                                            onChange={(e) =>
                                                                setNewOptionData(
                                                                    {
                                                                        ...newOptionData,
                                                                        isCorrect:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    }
                                                                )
                                                            }
                                                            className="w-4 h-4 text-green-500 rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={
                                                                newOptionData.optionText
                                                            }
                                                            onChange={(e) =>
                                                                setNewOptionData(
                                                                    {
                                                                        ...newOptionData,
                                                                        optionText:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                            className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            placeholder={t(
                                                                "lessons:videoQuiz.optionPlaceholder",
                                                                "Enter option text..."
                                                            )}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={
                                                                handleCancelAddOption
                                                            }
                                                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleSubmitNewOption
                                                            }
                                                            disabled={
                                                                isSavingOption ||
                                                                !newOptionData.optionText.trim()
                                                            }
                                                            className="p-1 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded disabled:opacity-50"
                                                        >
                                                            {isSavingOption ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Plus className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                                                        {t(
                                                            "lessons:videoQuiz.markCorrectHint",
                                                            "Check the box if this is a correct answer"
                                                        )}
                                                    </p>
                                                </div>
                                            )}

                                            {question.options &&
                                            question.options.length > 0 ? (
                                                <div className="space-y-2">
                                                    {question.options
                                                        .sort(
                                                            (a, b) =>
                                                                a.order -
                                                                b.order
                                                        )
                                                        .map(
                                                            (
                                                                option,
                                                                optIndex
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        option.id
                                                                    }
                                                                >
                                                                    {editingOptionId ===
                                                                        String(
                                                                            option.id
                                                                        ) &&
                                                                    editingOptionData ? (
                                                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={
                                                                                    editingOptionData.isCorrect
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setEditingOptionData(
                                                                                        {
                                                                                            ...editingOptionData,
                                                                                            isCorrect:
                                                                                                e
                                                                                                    .target
                                                                                                    .checked,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="w-4 h-4 text-green-500 rounded"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    editingOptionData.optionText
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setEditingOptionData(
                                                                                        {
                                                                                            ...editingOptionData,
                                                                                            optionText:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                                            />
                                                                            <button
                                                                                onClick={
                                                                                    cancelEditOption
                                                                                }
                                                                                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                                                            >
                                                                                <X className="w-4 h-4" />
                                                                            </button>
                                                                            <button
                                                                                onClick={
                                                                                    saveEditOption
                                                                                }
                                                                                disabled={
                                                                                    isSavingOption
                                                                                }
                                                                                className="p-1 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded disabled:opacity-50"
                                                                            >
                                                                                {isSavingOption ? (
                                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                                ) : (
                                                                                    <Save className="w-4 h-4" />
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className={`flex items-center gap-2 p-2 rounded-lg ${option.isCorrect ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30" : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"}`}
                                                                        >
                                                                            <button
                                                                                onClick={() =>
                                                                                    toggleOptionCorrect(
                                                                                        option,
                                                                                        question
                                                                                    )
                                                                                }
                                                                                className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded ${option.isCorrect ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"}`}
                                                                            >
                                                                                {option.isCorrect ? (
                                                                                    <Check className="w-4 h-4" />
                                                                                ) : (
                                                                                    String.fromCharCode(
                                                                                        65 +
                                                                                            optIndex
                                                                                    )
                                                                                )}
                                                                            </button>
                                                                            <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                                                                                {option.optionText ||
                                                                                    t(
                                                                                        "lessons:videoQuiz.emptyOption",
                                                                                        "(empty)"
                                                                                    )}
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    startEditOption(
                                                                                        option
                                                                                    )
                                                                                }
                                                                                className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                                                            >
                                                                                <Edit2 className="w-3 h-3" />
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    confirmDeleteOption(
                                                                                        String(
                                                                                            option.id
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t(
                                                        "lessons:videoQuiz.noOptions",
                                                        "No options added yet"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                    {t("common.cancel", "Cancel")}
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSaved ? (
                        <Check className="w-4 h-4" />
                    ) : null}
                    {isEditing
                        ? t("common.save", "Save")
                        : t("common.create", "Create")}
                </button>
            </div>

            {/* Delete Quiz Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
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
                onConfirm={handleDelete}
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
                isOpen={showDeleteOptionDialog}
                onClose={() => {
                    setShowDeleteOptionDialog(false);
                    setDeleteOptionId(null);
                }}
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
