/**
 * QuestionCard Component
 * Displays a single question with expandable options
 */

import { useTranslation } from "react-i18next";
import {
    Trash2,
    Edit3,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    Circle,
} from "lucide-react";
import type { QuizQuestionWithOptions } from "../../types";

interface QuestionCardProps {
    question: QuizQuestionWithOptions;
    index: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onEdit: () => void;
    onDelete: () => void;
    isPending?: boolean;
}

export function QuestionCard({
    question,
    index,
    isExpanded,
    onToggleExpand,
    onEdit,
    onDelete,
}: QuestionCardProps) {
    const { t } = useTranslation();

    const getQuestionTypeLabel = (type: string) => {
        switch (type) {
            case "single_choice":
                return t(
                    "groupsManagement:quiz.questionTypes.singleChoice",
                    "Single Choice"
                );
            case "multiple_choice":
                return t(
                    "groupsManagement:quiz.questionTypes.multipleChoice",
                    "Multiple Choice"
                );
            case "true_false":
                return t(
                    "groupsManagement:quiz.questionTypes.trueFalse",
                    "True/False"
                );
            case "short_answer":
                return t(
                    "groupsManagement:quiz.questionTypes.shortAnswer",
                    "Short Answer"
                );
            default:
                return type;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-medium flex items-center justify-center">
                            {index + 1}
                        </span>
                        <div>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {question.question}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                    {getQuestionTypeLabel(question.type)}
                                </span>
                                <span>
                                    {question.points}{" "}
                                    {t("groupsManagement:quiz.pts", "pts")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors"
                            title={t("common.edit", "Edit")}
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Question - Options */}
            {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-850">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("groupsManagement:quiz.options", "Options")}:
                    </p>
                    <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                            <div
                                key={oIndex}
                                className={`flex items-center gap-2 p-2 rounded-lg ${
                                    option.isCorrect
                                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                {option.isCorrect ? (
                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                ) : (
                                    <Circle className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
                                )}
                                <span
                                    className={`text-sm ${
                                        option.isCorrect
                                            ? "text-green-700 dark:text-green-300 font-medium"
                                            : "text-gray-700 dark:text-gray-300"
                                    }`}
                                >
                                    {option.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    {question.explanation && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                                {t(
                                    "groupsManagement:quiz.explanation",
                                    "Explanation"
                                )}
                                :
                            </p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                                {question.explanation}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default QuestionCard;
