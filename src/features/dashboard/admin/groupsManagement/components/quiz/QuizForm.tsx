/**
 * QuizForm Component
 * Form for creating/editing a quiz
 */

import { useTranslation } from "react-i18next";
import { Save, X } from "lucide-react";
import type { NewQuizData } from "../../types";

interface QuizFormProps {
    quiz: Omit<NewQuizData, "levelId">;
    onChange: (quiz: Omit<NewQuizData, "levelId">) => void;
    onSave: () => void;
    onCancel: () => void;
    isDisabled?: boolean;
    isPending?: boolean;
}

export function QuizForm({
    quiz,
    onChange,
    onSave,
    onCancel,
    isDisabled = false,
    isPending = false,
}: QuizFormProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t("groupsManagement:quiz.createNew", "Create New Quiz")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "groupsManagement:quiz.timeLimit",
                            "Time Limit (minutes)"
                        )}
                    </label>
                    <input
                        type="number"
                        value={quiz.timeLimit}
                        onChange={(e) =>
                            onChange({
                                ...quiz,
                                timeLimit: parseInt(e.target.value) || 0,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t(
                            "groupsManagement:quiz.passingScore",
                            "Passing Score (%)"
                        )}
                    </label>
                    <input
                        type="number"
                        value={quiz.passingScore}
                        onChange={(e) =>
                            onChange({
                                ...quiz,
                                passingScore: parseInt(e.target.value) || 0,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        min="0"
                        max="100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("groupsManagement:quiz.maxAttempts", "Max Attempts")}
                    </label>
                    <input
                        type="number"
                        value={quiz.maxAttempts}
                        onChange={(e) =>
                            onChange({
                                ...quiz,
                                maxAttempts: parseInt(e.target.value) || 1,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        min="1"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={quiz.shuffleQuestions}
                            onChange={(e) =>
                                onChange({
                                    ...quiz,
                                    shuffleQuestions: e.target.checked,
                                })
                            }
                            className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {t(
                                "groupsManagement:quiz.shuffleQuestions",
                                "Shuffle Questions"
                            )}
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={quiz.showAnswers}
                            onChange={(e) =>
                                onChange({
                                    ...quiz,
                                    showAnswers: e.target.checked,
                                })
                            }
                            className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {t(
                                "groupsManagement:quiz.showAnswers",
                                "Show Answers"
                            )}
                        </span>
                    </label>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                    <X className="w-4 h-4 inline-block me-1" />
                    {t("common.cancel", "Cancel")}
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={isDisabled || isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Save className="w-4 h-4 inline-block me-1" />
                    {isPending
                        ? t("common.saving", "Saving...")
                        : t("common.save", "Save")}
                </button>
            </div>
        </div>
    );
}

export default QuizForm;
