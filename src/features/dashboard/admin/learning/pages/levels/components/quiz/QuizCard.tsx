/**
 * QuizCard Component
 * Displays a single quiz with expandable questions section
 */

import { useTranslation } from "react-i18next";
import {
    Clock,
    Target,
    RefreshCw,
    Shuffle,
    Eye,
    Plus,
    Trash2,
    Edit3,
    ChevronDown,
    ChevronUp,
    ClipboardList,
} from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import { QuestionForm } from "./QuestionForm";
import { LevelQuizWithQuestions, NewQuestionFormData } from "../../types";

interface QuizCardProps {
    quiz: LevelQuizWithQuestions;
    isExpanded: boolean;
    expandedQuestions: string[];
    isAddingQuestion: boolean;
    newQuestion: NewQuestionFormData;
    onToggleExpand: () => void;
    onToggleQuestionExpand: (questionId: string) => void;
    onEdit: () => void;
    onDelete: () => void;
    onAddQuestion: () => void;
    onCancelAddQuestion: () => void;
    onNewQuestionChange: (question: NewQuestionFormData) => void;
    onSaveQuestion: () => void;
    onDeleteQuestion: (questionId: string) => void;
    isPending?: boolean;
    isQuestionPending?: boolean;
}

export function QuizCard({
    quiz,
    isExpanded,
    expandedQuestions,
    isAddingQuestion,
    newQuestion,
    onToggleExpand,
    onToggleQuestionExpand,
    onEdit,
    onDelete,
    onAddQuestion,
    onCancelAddQuestion,
    onNewQuestionChange,
    onSaveQuestion,
    onDeleteQuestion,
    isPending = false,
    isQuestionPending = false,
}: QuizCardProps) {
    const { t } = useTranslation("learning");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Quiz Header */}
            <div
                className="p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-brand-500" />
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                                {t("levels.quiz.quizTitle", "Quiz #{{id}}", {
                                    id: quiz.id,
                                })}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {quiz.timeLimit}{" "}
                                    {t("levels.quiz.min", "min")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Target className="w-4 h-4" />
                                    {quiz.passingScore}%
                                </span>
                                <span className="flex items-center gap-1">
                                    <RefreshCw className="w-4 h-4" />
                                    {quiz.maxAttempts}{" "}
                                    {t("levels.quiz.attempts", "attempts")}
                                </span>
                                <span>
                                    {quiz.questions.length}{" "}
                                    {t("levels.quiz.questions", "questions")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {quiz.shuffleQuestions && (
                            <span
                                className="p-1.5 text-gray-400"
                                title={t(
                                    "levels.quiz.shuffleEnabled",
                                    "Shuffle enabled"
                                )}
                            >
                                <Shuffle className="w-4 h-4" />
                            </span>
                        )}
                        {quiz.showAnswers && (
                            <span
                                className="p-1.5 text-gray-400"
                                title={t(
                                    "levels.quiz.resultsVisible",
                                    "Results visible"
                                )}
                            >
                                <Eye className="w-4 h-4" />
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                            className="p-2 text-gray-400 hover:text-brand-500 transition-colors"
                            title={t("common.edit", "Edit")}
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title={t("common.delete", "Delete")}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Quiz Content - Questions */}
            {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-850">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                            {t("levels.quiz.questionsTitle", "Questions")}
                        </h4>
                        <button
                            type="button"
                            onClick={onAddQuestion}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            {t("levels.quiz.addQuestion", "Add Question")}
                        </button>
                    </div>

                    {/* Add Question Form */}
                    {isAddingQuestion && (
                        <QuestionForm
                            question={newQuestion}
                            onChange={onNewQuestionChange}
                            onSave={onSaveQuestion}
                            onCancel={onCancelAddQuestion}
                            isPending={isQuestionPending}
                        />
                    )}

                    {/* Questions List */}
                    {quiz.questions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>
                                {t(
                                    "levels.quiz.noQuestions",
                                    "No questions yet"
                                )}
                            </p>
                            <p className="text-sm mt-1">
                                {t(
                                    "levels.quiz.addFirstQuestion",
                                    "Click 'Add Question' to create your first question"
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {quiz.questions.map((question, qIndex) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    index={qIndex}
                                    isExpanded={expandedQuestions.includes(
                                        question.id
                                    )}
                                    onToggleExpand={() =>
                                        onToggleQuestionExpand(question.id)
                                    }
                                    onDelete={() =>
                                        onDeleteQuestion(question.id)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default QuizCard;
