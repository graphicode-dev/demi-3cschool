/**
 * QuestionForm Component
 * Form for creating/editing a question
 */

import { useTranslation } from "react-i18next";
import { CheckCircle, Circle, MinusCircle } from "lucide-react";
import type { NewQuestionFormData, QuestionOptionUI } from "../../types";

interface QuestionFormProps {
    question: NewQuestionFormData;
    onChange: (question: NewQuestionFormData) => void;
    onSave: () => void;
    onCancel: () => void;
    isDisabled?: boolean;
    isPending?: boolean;
}

export function QuestionForm({
    question,
    onChange,
    onSave,
    onCancel,
    isDisabled = false,
    isPending = false,
}: QuestionFormProps) {
    const { t } = useTranslation();

    const handleAddOption = () => {
        onChange({
            ...question,
            options: [...question.options, { text: "", isCorrect: false }],
        });
    };

    const handleRemoveOption = (index: number) => {
        if (question.options.length <= 2) return;
        onChange({
            ...question,
            options: question.options.filter((_, i) => i !== index),
        });
    };

    const handleOptionChange = (
        index: number,
        field: keyof QuestionOptionUI,
        value: string | boolean
    ) => {
        onChange({
            ...question,
            options: question.options.map((opt, i) =>
                i === index ? { ...opt, [field]: value } : opt
            ),
        });
    };

    const handleSetCorrectOption = (index: number) => {
        if (
            question.type === "single_choice" ||
            question.type === "true_false"
        ) {
            onChange({
                ...question,
                options: question.options.map((opt, i) => ({
                    ...opt,
                    isCorrect: i === index,
                })),
            });
        } else {
            onChange({
                ...question,
                options: question.options.map((opt, i) =>
                    i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt
                ),
            });
        }
    };

    const handleTypeChange = (newType: NewQuestionFormData["type"]) => {
        onChange({
            ...question,
            type: newType,
            options:
                newType === "true_false"
                    ? [
                          { text: "True", isCorrect: false },
                          { text: "False", isCorrect: false },
                      ]
                    : question.options,
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                {t("levels:quiz.newQuestion", "New Question")}
            </h5>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("levels:quiz.questionText", "Question")}
                    </label>
                    <textarea
                        value={question.question}
                        onChange={(e) =>
                            onChange({ ...question, question: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                        rows={2}
                        placeholder={t(
                            "levels:quiz.questionPlaceholder",
                            "Enter your question"
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("levels:quiz.questionType", "Type")}
                        </label>
                        <select
                            value={question.type}
                            onChange={(e) =>
                                handleTypeChange(
                                    e.target
                                        .value as NewQuestionFormData["type"]
                                )
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                            <option value="single_choice">
                                {t(
                                    "levels:quiz.questionTypes.singleChoice",
                                    "Single Choice"
                                )}
                            </option>
                            <option value="multiple_choice">
                                {t(
                                    "levels:quiz.questionTypes.multipleChoice",
                                    "Multiple Choice"
                                )}
                            </option>
                            <option value="true_false">
                                {t(
                                    "levels:quiz.questionTypes.trueFalse",
                                    "True/False"
                                )}
                            </option>
                            <option value="short_answer">
                                {t(
                                    "levels:quiz.questionTypes.shortAnswer",
                                    "Short Answer"
                                )}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("levels:quiz.points", "Points")}
                        </label>
                        <input
                            type="number"
                            value={question.points}
                            onChange={(e) =>
                                onChange({
                                    ...question,
                                    points: parseInt(e.target.value) || 0,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("levels:quiz.order", "Order")}
                        </label>
                        <input
                            type="number"
                            value={question.order}
                            onChange={(e) =>
                                onChange({
                                    ...question,
                                    order: parseInt(e.target.value) || 1,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            min="1"
                        />
                    </div>
                </div>

                {/* Options */}
                {question.type !== "short_answer" && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("levels:quiz.options", "Options")}
                            </label>
                            {question.type !== "true_false" && (
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="text-sm text-brand-500 hover:text-brand-600"
                                >
                                    + {t("levels:quiz.addOption", "Add Option")}
                                </button>
                            )}
                        </div>
                        <div className="space-y-2">
                            {question.options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSetCorrectOption(index)
                                        }
                                        className={`shrink-0 ${
                                            option.isCorrect
                                                ? "text-green-500"
                                                : "text-gray-300 dark:text-gray-600"
                                        }`}
                                    >
                                        {option.isCorrect ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                "text",
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            question.type === "true_false"
                                        }
                                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800"
                                        placeholder={t(
                                            "levels:quiz.optionPlaceholder",
                                            "Option text"
                                        )}
                                    />
                                    {question.type !== "true_false" &&
                                        question.options.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveOption(index)
                                                }
                                                className="shrink-0 p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <MinusCircle className="w-5 h-5" />
                                            </button>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Explanation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t("levels:quiz.explanation", "Explanation")}
                    </label>
                    <textarea
                        value={question.explanation}
                        onChange={(e) =>
                            onChange({
                                ...question,
                                explanation: e.target.value,
                            })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                        rows={2}
                        placeholder={t(
                            "levels:quiz.explanationPlaceholder",
                            "Explain the correct answer"
                        )}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                    {t("common.cancel", "Cancel")}
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={
                        isDisabled || isPending || !question.question.trim()
                    }
                    className="px-3 py-1.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isPending
                        ? t("common.saving", "Saving...")
                        : t("levels:quiz.saveQuestion", "Save Question")}
                </button>
            </div>
        </div>
    );
}

export default QuestionForm;
