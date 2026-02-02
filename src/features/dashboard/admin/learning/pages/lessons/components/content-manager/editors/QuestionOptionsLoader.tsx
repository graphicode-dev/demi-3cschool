/**
 * Question Options Loader Component
 *
 * Lazy-loads options for a question when it's expanded.
 * Fetches options by question ID only when rendered.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import { useMutationHandler } from "@/shared/api";
import type { ApiError } from "@/shared/api/types";
import {
    useCreateLessonQuizOption,
    useDeleteLessonQuizOption,
    useLessonQuizOptionsByQuestion,
    useUpdateLessonQuizOption,
} from "../../../api";
import { LessonQuizOption, LessonQuizQuestion } from "../../../types";

interface QuestionOptionsLoaderProps {
    question: LessonQuizQuestion;
    questionType: string;
}

export default function QuestionOptionsLoader({
    question,
    questionType,
}: QuestionOptionsLoaderProps) {
    const { t } = useTranslation();
    const { execute } = useMutationHandler();

    // Fetch options for this question - lazy loaded when component mounts
    const { data: optionsData, isLoading: isLoadingOptions } =
        useLessonQuizOptionsByQuestion(String(question.id), { page: 1 });

    const options = optionsData?.items || [];

    // Mutations
    const { mutateAsync: createOptionAsync, isPending: isCreatingOption } =
        useCreateLessonQuizOption();
    const { mutateAsync: updateOptionAsync, isPending: isUpdatingOption } =
        useUpdateLessonQuizOption();
    const { mutateAsync: deleteOptionAsync, isPending: isDeletingOption } =
        useDeleteLessonQuizOption();

    const isSavingOption = isCreatingOption || isUpdatingOption;

    // Option editing state
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
    const [editingOptionData, setEditingOptionData] = useState<{
        optionText: string;
        isCorrect: boolean;
    } | null>(null);

    // New option form state
    const [showNewOptionForm, setShowNewOptionForm] = useState(false);
    const [newOptionData, setNewOptionData] = useState<{
        optionText: string;
        isCorrect: boolean;
    }>({
        optionText: "",
        isCorrect: false,
    });

    // Delete confirmation state
    const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null);
    const [showDeleteOptionDialog, setShowDeleteOptionDialog] = useState(false);

    const handleShowAddOptionForm = () => {
        setShowNewOptionForm(true);
        setNewOptionData({ optionText: "", isCorrect: false });
    };

    const handleCancelAddOption = () => {
        setShowNewOptionForm(false);
        setNewOptionData({ optionText: "", isCorrect: false });
    };

    const handleSubmitNewOption = () => {
        execute(
            () =>
                createOptionAsync({
                    questionId: String(question.id),
                    optionText: newOptionData.optionText,
                    isCorrect: newOptionData.isCorrect,
                    order: options.length + 1,
                }),
            {
                successMessage: t(
                    "lessons:content.quizzes.optionCreated",
                    "Option created successfully"
                ),
                onSuccess: () => {
                    setShowNewOptionForm(false);
                    setNewOptionData({ optionText: "", isCorrect: false });
                },
            }
        );
    };

    const startEditOption = (option: LessonQuizOption) => {
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
                    data: {
                        optionText: editingOptionData.optionText,
                        isCorrect: editingOptionData.isCorrect,
                    },
                }),
            {
                successMessage: t(
                    "lessons:content.quizzes.optionUpdated",
                    "Option updated successfully"
                ),
                onSuccess: () => {
                    setEditingOptionId(null);
                    setEditingOptionData(null);
                },
            }
        );
    };

    const confirmDeleteOption = (optionId: string) => {
        setDeleteOptionId(optionId);
        setShowDeleteOptionDialog(true);
    };

    const handleDeleteOption = () => {
        if (!deleteOptionId) return;

        execute(() => deleteOptionAsync(deleteOptionId), {
            successMessage: t(
                "lessons:content.quizzes.optionDeleted",
                "Option deleted successfully"
            ),
            onSuccess: () => {
                setShowDeleteOptionDialog(false);
                setDeleteOptionId(null);
            },
        });
    };

    const toggleOptionCorrect = (option: LessonQuizOption) => {
        // For single choice, only one option can be correct
        if (questionType === "single_choice" && !option.isCorrect) {
            // Set all other options to incorrect first
            options.forEach((opt) => {
                if (opt.id !== option.id && opt.isCorrect) {
                    execute(
                        () =>
                            updateOptionAsync({
                                id: String(opt.id),
                                data: { isCorrect: false },
                            }),
                        { showSuccessToast: false }
                    );
                }
            });
        }

        execute(
            () =>
                updateOptionAsync({
                    id: String(option.id),
                    data: { isCorrect: !option.isCorrect },
                }),
            { showSuccessToast: false }
        );
    };

    if (isLoadingOptions) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {t("lessons:content.quizzes.options", "Options")}:
                </p>
                <button
                    onClick={handleShowAddOptionForm}
                    disabled={isSavingOption}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors disabled:opacity-50"
                >
                    <Plus className="w-3 h-3" />
                    {t("lessons:content.quizzes.addOption", "Add Option")}
                </button>
            </div>

            {/* New Option Form */}
            {showNewOptionForm && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={newOptionData.isCorrect}
                            onChange={(e) =>
                                setNewOptionData({
                                    ...newOptionData,
                                    isCorrect: e.target.checked,
                                })
                            }
                            className="w-4 h-4 text-green-500 rounded"
                        />
                        <input
                            type="text"
                            value={newOptionData.optionText}
                            onChange={(e) =>
                                setNewOptionData({
                                    ...newOptionData,
                                    optionText: e.target.value,
                                })
                            }
                            className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={t(
                                "lessons:content.quizzes.optionPlaceholder",
                                "Enter option text..."
                            )}
                            autoFocus
                        />
                        <button
                            onClick={handleCancelAddOption}
                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSubmitNewOption}
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
                            "lessons:content.quizzes.markCorrectHint",
                            "Check the box if this is a correct answer"
                        )}
                    </p>
                </div>
            )}

            {/* Options List */}
            {options.length > 0 ? (
                <div className="space-y-2">
                    {options
                        .sort((a, b) => a.order - b.order)
                        .map((option, optIndex) => (
                            <div key={option.id}>
                                {editingOptionId === String(option.id) &&
                                editingOptionData ? (
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
                                        <input
                                            type="checkbox"
                                            checked={
                                                editingOptionData.isCorrect
                                            }
                                            onChange={(e) =>
                                                setEditingOptionData({
                                                    ...editingOptionData,
                                                    isCorrect: e.target.checked,
                                                })
                                            }
                                            className="w-4 h-4 text-green-500 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={editingOptionData.optionText}
                                            onChange={(e) =>
                                                setEditingOptionData({
                                                    ...editingOptionData,
                                                    optionText: e.target.value,
                                                })
                                            }
                                            className="flex-1 px-2 py-1 text-sm rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder={t(
                                                "lessons:content.quizzes.optionPlaceholder",
                                                "Enter option text..."
                                            )}
                                        />
                                        <button
                                            onClick={cancelEditOption}
                                            className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={saveEditOption}
                                            disabled={isSavingOption}
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
                                        className={`flex items-center gap-2 p-2 rounded-lg ${
                                            option.isCorrect
                                                ? "bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30"
                                                : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                                        }`}
                                    >
                                        <button
                                            onClick={() =>
                                                toggleOptionCorrect(option)
                                            }
                                            className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded ${
                                                option.isCorrect
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {option.isCorrect ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                String.fromCharCode(
                                                    65 + optIndex
                                                )
                                            )}
                                        </button>
                                        <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                                            {option.optionText ||
                                                t(
                                                    "lessons:content.quizzes.emptyOption",
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
                                                confirmDeleteOption(
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
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t(
                        "lessons:content.quizzes.noOptions",
                        "No options added yet"
                    )}
                </p>
            )}

            {/* Delete Option Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteOptionDialog}
                onClose={() => setShowDeleteOptionDialog(false)}
                onConfirm={handleDeleteOption}
                title={t(
                    "lessons:content.quizzes.deleteOptionTitle",
                    "Delete Option"
                )}
                message={t(
                    "lessons:content.quizzes.deleteOptionDescription",
                    "Are you sure you want to delete this option? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                variant="danger"
                loading={isDeletingOption}
            />
        </div>
    );
}
