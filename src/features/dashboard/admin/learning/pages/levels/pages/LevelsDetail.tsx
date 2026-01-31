/**
 * Learning - Level Detail Page (Final Quizzes)
 *
 * Shared component for both Standard and Professional Learning.
 * Shows Final Quizzes for a specific level with expandable quiz cards
 * and question management functionality.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { LoadingState, ErrorState } from "@/design-system";
import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { AlertTriangle, Plus } from "lucide-react";
import type {
    NewQuizData,
    LevelQuizWithQuestions,
    NewQuestionFormData,
    LevelQuiz,
    LevelQuizQuestion,
    LevelQuizOption,
} from "../types";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { useLevel } from "../api";
import { QuizCard, QuizForm } from "../components";
import {
    useCreateLevelQuiz,
    useDeleteLevelQuiz,
    useLevelQuizzesList,
} from "../api/quizzes";
import {
    useCreateLevelQuizQuestion,
    useDeleteLevelQuizQuestion,
    useLevelQuizQuestionsList,
} from "../api/quiz questions";
import {
    useCreateLevelQuizOption,
    useLevelQuizOptionsList,
} from "../api/quiz options";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

function useCurriculumType(): ProgramsCurriculum {
    const location = useLocation();
    return location.pathname.includes("professional-learning")
        ? "professional"
        : "standard";
}

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

export default function LearningLevelsDetail() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const curriculumType = useCurriculumType();
    const isStandard = curriculumType === "standard";
    const paths = isStandard
        ? learningPaths.standard
        : learningPaths.professional;

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
    } = useLevelQuizzesList();
    const {
        data: questionsData,
        isLoading: questionsLoading,
        refetch: refetchQuestions,
    } = useLevelQuizQuestionsList();
    const {
        data: optionsData,
        isLoading: optionsLoading,
        refetch: refetchOptions,
    } = useLevelQuizOptionsList();

    const { mutateAsync: createQuizAsync, isPending: isCreatingQuiz } =
        useCreateLevelQuiz();
    const { mutateAsync: deleteQuizAsync, isPending: isDeletingQuiz } =
        useDeleteLevelQuiz();

    const { mutateAsync: createQuestionAsync, isPending: isCreatingQuestion } =
        useCreateLevelQuizQuestion();
    const { mutateAsync: deleteQuestionAsync, isPending: isDeletingQuestion } =
        useDeleteLevelQuizQuestion();

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

    const quizzes = quizzesData?.items || [];
    const questions = questionsData?.items || [];
    const options = optionsData?.items || [];

    const levelQuizzes = quizzes.filter((q) => String(q.level.id) === id);

    const transformedQuizzes: LevelQuizWithQuestions[] = levelQuizzes.map(
        (quiz) => transformQuizToUI(quiz, questions, options)
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
        execute(() => deleteQuizAsync(quizId), {
            successMessage: t(
                "levels:quiz.messages.deleteSuccess",
                "Quiz deleted successfully"
            ),
            onSuccess: () => refetchQuizzes(),
        });
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
        execute(() => deleteQuestionAsync(questionId), {
            successMessage: t(
                "levels:quiz.messages.questionDeleteSuccess",
                "Question deleted successfully"
            ),
            onSuccess: () => {
                refetchQuestions();
                refetchOptions();
            },
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
        <PageWrapper
            pageHeaderProps={{
                title: `${level?.title || "Level"} - ${t("levels:levels.finalQuiz", "Final Quiz")}`,
                backButton: true,
            }}
        >
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
                                onEdit={() => {}}
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
        </PageWrapper>
    );
}
