import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
    useCreateAcceptanceExam,
    useUpdateAcceptanceExam,
    useDeleteAcceptanceExam,
    useAcceptanceExamsList,
    useAcceptanceExam,
    useCreateAcceptanceExamQuestion,
    useUpdateAcceptanceExamQuestion,
    useDeleteAcceptanceExamQuestion,
    useAcceptanceExamQuestionsByExam,
    useCreateAcceptanceExamOption,
    useUpdateAcceptanceExamOption,
    useDeleteAcceptanceExamOption,
    useAcceptanceExamOptionsByQuestion,
} from "../api";
import { useMutationHandler } from "@/shared/api";
import { useState } from "react";
import {
    AcceptanceExam,
    AcceptanceExamOption,
    AcceptanceExamQuestion,
    AcceptanceExamQuestionWithOptions,
    AcceptanceExamWithQuestions,
    NewAcceptanceExamData,
    NewAcceptanceExamQuestionFormData,
} from "../../../types";
import { ConfirmDialog, ErrorState, PageWrapper } from "@/design-system";
import Pagination from "@/design-system/components/table/Pagination";
import { AlertTriangle, Plus } from "lucide-react";
import {
    AcceptanceExamCard,
    AcceptanceExamForm,
    QuestionForm,
} from "../../../components/quiz";
import { SkeletonList } from "@/design-system/hooks/useSkeleton";

const DEFAULT_NEW_QUIZ: NewAcceptanceExamData = {
    gradeId: "",
    title: "",
    description: "",
    timeLimit: 60,
    passingScore: 60,
    maxAttempts: 1,
    shuffleQuestions: false,
    showAnswers: true,
};

const DEFAULT_NEW_QUESTION: NewAcceptanceExamQuestionFormData = {
    quizId: "", // legacy UI field
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

function transformAcceptanceExamToUI(
    quiz: AcceptanceExam,
    questions: AcceptanceExamQuestion[],
    options: AcceptanceExamOption[]
): AcceptanceExamWithQuestions {
    const quizIdStr = String(quiz.id);
    // Ensure questions and options are arrays
    const safeQuestions = Array.isArray(questions) ? questions : [];
    const safeOptions = Array.isArray(options) ? options : [];
    const quizQuestions = safeQuestions.filter(
        (q) => String(q.acceptanceExamId) === quizIdStr
    );

    return {
        id: quizIdStr,
        levelId: String(quiz.grade.id),
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts,
        shuffleQuestions: quiz.shuffleQuestions,
        showAnswers: quiz.showAnswers,
        questions: quizQuestions.map((q) => {
            const questionIdStr = String(q.id);
            const questionOptions = safeOptions.filter(
                (o) => String(o.questionId) === questionIdStr
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
                    isCorrect: o.isCorrect,
                    order: o.order,
                })),
            };
        }),
    };
}

function ExamsPage() {
    const { t } = useTranslation("acceptanceExams");
    const { id, levelId } = useParams<{ id?: string; levelId?: string }>();
    const resolvedId = id || levelId;

    // Pagination states
    const [examsPage, setExamsPage] = useState(1);
    const [questionsPage, setQuestionsPage] = useState(1);
    const [optionsPage, setOptionsPage] = useState(1);

    const {
        data: level,
        isLoading: levelLoading,
        error: levelError,
        refetch: refetchLevel,
    } = useAcceptanceExam(resolvedId);

    const {
        data: quizzesData,
        isLoading: quizzesLoading,
        refetch: refetchQuizzes,
    } = useAcceptanceExamsList({ page: examsPage });

    const { mutateAsync: createQuizAsync, isPending: isCreatingQuiz } =
        useCreateAcceptanceExam();
    const { mutateAsync: deleteQuizAsync, isPending: isDeletingQuiz } =
        useDeleteAcceptanceExam();
    const { mutateAsync: updateQuizAsync, isPending: isUpdatingQuiz } =
        useUpdateAcceptanceExam();

    const { mutateAsync: createQuestionAsync, isPending: isCreatingQuestion } =
        useCreateAcceptanceExamQuestion();
    const { mutateAsync: deleteQuestionAsync, isPending: isDeletingQuestion } =
        useDeleteAcceptanceExamQuestion();
    const { mutateAsync: updateQuestionAsync, isPending: isUpdatingQuestion } =
        useUpdateAcceptanceExamQuestion();

    const { mutateAsync: createOptionAsync, isPending: isCreatingOption } =
        useCreateAcceptanceExamOption();
    const { mutateAsync: updateOptionAsync, isPending: isUpdatingOption } =
        useUpdateAcceptanceExamOption();
    const { mutateAsync: deleteOptionAsync, isPending: isDeletingOption } =
        useDeleteAcceptanceExamOption();
    const { execute } = useMutationHandler();

    const [expandedQuizzes, setExpandedQuizzes] = useState<string[]>([]);
    const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
    // Selected quiz for fetching questions
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    // Selected question for fetching options
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
        null
    );
    const [isAddingQuiz, setIsAddingQuiz] = useState(false);
    const [isAddingQuestion, setIsAddingQuestion] = useState<string | null>(
        null
    );
    const [newQuiz, setNewQuiz] =
        useState<NewAcceptanceExamData>(DEFAULT_NEW_QUIZ);
    const [newQuestion, setNewQuestion] =
        useState<NewAcceptanceExamQuestionFormData>(DEFAULT_NEW_QUESTION);

    // Edit states
    const [editingQuiz, setEditingQuiz] =
        useState<AcceptanceExamWithQuestions | null>(null);
    const [editQuizData, setEditQuizData] =
        useState<NewAcceptanceExamData>(DEFAULT_NEW_QUIZ);
    const [editingQuestion, setEditingQuestion] = useState<{
        quizId: string;
        question: AcceptanceExamQuestionWithOptions;
    } | null>(null);
    const [editQuestionData, setEditQuestionData] =
        useState<NewAcceptanceExamQuestionFormData>(DEFAULT_NEW_QUESTION);

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
    const [deleteOptionDialog, setDeleteOptionDialog] = useState<{
        isOpen: boolean;
        questionId: string | null;
        optionId: string | null;
    }>({ isOpen: false, questionId: null, optionId: null });

    // Option edit states
    const [editingOption, setEditingOption] = useState<{
        questionId: string;
        optionId: string;
    } | null>(null);
    const [editOptionData, setEditOptionData] = useState<{
        option_text?: string;
        is_correct?: boolean;
        order?: number;
    }>({ option_text: "", is_correct: false, order: 0 });

    const quizzes = quizzesData?.items || [];
    const quizzesPagination = quizzesData
        ? {
              currentPage: quizzesData.currentPage,
              lastPage: quizzesData.lastPage,
              perPage: quizzesData.perPage,
              total: quizzesData.lastPage * quizzesData.perPage,
          }
        : null;

    // Fetch questions only for selected quiz
    const {
        data: questionsData,
        isLoading: questionsLoading,
        refetch: refetchQuestions,
    } = useAcceptanceExamQuestionsByExam(
        selectedQuizId,
        { page: questionsPage },
        {
            enabled: !!selectedQuizId,
        }
    );

    // Fetch options only for selected question
    const {
        data: optionsData,
        isLoading: optionsLoading,
        refetch: refetchOptions,
    } = useAcceptanceExamOptionsByQuestion(
        selectedQuestionId,
        { page: optionsPage },
        {
            enabled: !!selectedQuestionId,
        }
    );

    const questions = questionsData?.items || [];
    const questionsPagination = questionsData
        ? {
              currentPage: questionsData.currentPage,
              lastPage: questionsData.lastPage,
              perPage: questionsData.perPage,
              total: questionsData.lastPage * questionsData.perPage,
          }
        : null;
    const options = optionsData?.items || [];
    const optionsPagination = optionsData
        ? {
              currentPage: optionsData.currentPage,
              lastPage: optionsData.lastPage,
              perPage: optionsData.perPage,
              total: optionsData.lastPage * optionsData.perPage,
          }
        : null;

    const transformedQuizzes: AcceptanceExamWithQuestions[] = quizzes.map(
        (quiz) => transformAcceptanceExamToUI(quiz, questions, options)
    );

    const toggleQuizExpand = (quizId: string) => {
        setExpandedQuizzes((prev) => {
            const isExpanding = !prev.includes(quizId);
            if (isExpanding) {
                // Set selected quiz to fetch its questions
                setSelectedQuizId(quizId);
                return [...prev, quizId];
            } else {
                // Clear selected quiz when collapsing
                if (selectedQuizId === quizId) {
                    setSelectedQuizId(null);
                }
                return prev.filter((qid) => qid !== quizId);
            }
        });
    };

    const toggleQuestionExpand = (questionId: string) => {
        setExpandedQuestions((prev) => {
            const isExpanding = !prev.includes(questionId);
            if (isExpanding) {
                // Set selected question to fetch its options
                setSelectedQuestionId(questionId);
                return [...prev, questionId];
            } else {
                // Clear selected question when collapsing
                if (selectedQuestionId === questionId) {
                    setSelectedQuestionId(null);
                }
                return prev.filter((qid) => qid !== questionId);
            }
        });
    };

    const resetNewQuiz = () => setNewQuiz(DEFAULT_NEW_QUIZ);
    const resetNewQuestion = () => setNewQuestion(DEFAULT_NEW_QUESTION);

    const handleCreateQuiz = () => {
        if (!newQuiz.gradeId || !newQuiz.title) return;

        execute(
            () =>
                createQuizAsync({
                    gradeId: newQuiz.gradeId,
                    title: newQuiz.title,
                    description: newQuiz.description,
                    timeLimit: String(newQuiz.timeLimit),
                    passingScore: String(newQuiz.passingScore),
                    maxAttempts: String(newQuiz.maxAttempts),
                    shuffleQuestions: newQuiz.shuffleQuestions,
                    showAnswers: newQuiz.showAnswers,
                }),
            {
                successMessage: t(
                    "levels.quiz.messages.createSuccess",
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
                "levels.quiz.messages.deleteSuccess",
                "Quiz deleted successfully"
            ),
            onSuccess: () => refetchQuizzes(),
        });
        setDeleteQuizDialog({ isOpen: false, quizId: null });
    };

    const handleEditQuiz = (quiz: AcceptanceExamWithQuestions) => {
        setEditingQuiz(quiz);
        setEditQuizData({
            gradeId: quiz.levelId,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            maxAttempts: quiz.maxAttempts,
            shuffleQuestions: quiz.shuffleQuestions,
            showAnswers: quiz.showAnswers,
        });
    };

    const handleUpdateQuiz = async () => {
        if (!editingQuiz) return;

        execute(
            () =>
                updateQuizAsync({
                    id: editingQuiz.id,
                    data: {
                        gradeId: editQuizData.gradeId,
                        title: editQuizData.title,
                        description: editQuizData.description,
                        timeLimit: String(editQuizData.timeLimit),
                        passingScore: String(editQuizData.passingScore),
                        maxAttempts: String(editQuizData.maxAttempts),
                        shuffleQuestions: editQuizData.shuffleQuestions,
                        showAnswers: editQuizData.showAnswers,
                    },
                }),
            {
                successMessage: t(
                    "levels.quiz.messages.updateSuccess",
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
                    "levels.quiz.messages.questionUpdateSuccess",
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

    const handleCreateQuestion = async (quizId: string) => {
        if (!newQuestion.question.trim()) return;

        execute(
            async () => {
                const createdQuestion = await createQuestionAsync({
                    acceptanceExamId: Number(quizId),
                    question: newQuestion.question,
                    type: newQuestion.type,
                    points: newQuestion.points,
                    order: newQuestion.order,
                    explanation: newQuestion.explanation,
                    isActive: newQuestion.isActive,
                });

                if (createdQuestion && newQuestion.options.length > 0) {
                    const questionId = Number(createdQuestion.id);
                    await createOptionAsync({
                        questionId,
                        options: newQuestion.options.map((opt, index) => ({
                            option_text: opt.text,
                            is_correct: opt.isCorrect,
                            order: index + 1,
                        })),
                    });
                }
                return createdQuestion;
            },
            {
                successMessage: t(
                    "levels.quiz.messages.questionCreateSuccess",
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
        setDeleteQuestionDialog({ isOpen: true, quizId, questionId });
    };

    const confirmDeleteQuestion = async () => {
        if (!deleteQuestionDialog.questionId) return;
        await execute(
            () => deleteQuestionAsync(deleteQuestionDialog.questionId!),
            {
                successMessage: t(
                    "levels.quiz.messages.questionDeleteSuccess",
                    "Question deleted successfully"
                ),
                onSuccess: () => {
                    refetchQuestions();
                    refetchOptions();
                },
            }
        );
        setDeleteQuestionDialog({
            isOpen: false,
            quizId: null,
            questionId: null,
        });
    };

    const handleDeleteOption = (questionId: string, optionId: string) => {
        setDeleteOptionDialog({ isOpen: true, questionId, optionId });
    };

    const confirmDeleteOption = async () => {
        if (!deleteOptionDialog.optionId) return;
        await execute(() => deleteOptionAsync(deleteOptionDialog.optionId!), {
            successMessage: t(
                "levels.quiz.messages.optionDeleteSuccess",
                "Option deleted successfully"
            ),
            onSuccess: () => {
                refetchOptions();
            },
        });
        setDeleteOptionDialog({
            isOpen: false,
            questionId: null,
            optionId: null,
        });
    };

    const handleEditOption = (questionId: string, optionId: string) => {
        // Find the option from the transformed data
        const quiz = transformedQuizzes.find((q) =>
            q.questions.some((question) => question.id === questionId)
        );
        const question = quiz?.questions.find((q) => q.id === questionId);
        const option = question?.options.find((o) => o.id === optionId);
        if (!option) return;

        setEditingOption({ questionId, optionId });
        setEditOptionData({
            option_text: option.text,
            is_correct: option.isCorrect,
            order: option.order,
        });
    };

    const handleUpdateOption = async () => {
        if (!editingOption) return;

        execute(
            () =>
                updateOptionAsync({
                    id: editingOption.optionId,
                    data: editOptionData,
                }),
            {
                successMessage: t(
                    "levels.quiz.messages.optionUpdateSuccess",
                    "Option updated successfully"
                ),
                onSuccess: () => {
                    setEditingOption(null);
                    setEditOptionData({
                        option_text: "",
                        is_correct: false,
                        order: 0,
                    });
                    refetchOptions();
                },
            }
        );
    };

    const handleCancelEditOption = () => {
        setEditingOption(null);
        setEditOptionData({ option_text: "", is_correct: false, order: 0 });
    };

    const isLoading =
        levelLoading || quizzesLoading || questionsLoading || optionsLoading;

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
            isLoading={isLoading}
            pageHeaderProps={{
                title: `${t("acceptanceExams:title", "Acceptance Exam")}`,
            }}
        >
            {/* Progression Gate Alert */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            {t("levels.progressionGate", "Progression Gate")}
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            {t(
                                "levels.progressionGateDescription",
                                "Students must pass this quiz to unlock the next level. This quiz serves as a checkpoint to ensure mastery of all concepts."
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Level Quizzes Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t("levels.levelQuizzes", "Level Quizzes")}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t("levels.examsCount", "{{count}} Exams", {
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
                        {t("levels.addLevelQuiz", "Add Level Quiz")}
                    </button>
                </div>

                {/* Add New Quiz Form */}
                {isAddingQuiz && (
                    <AcceptanceExamForm
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
                    {!isLoading && transformedQuizzes.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("levels.quiz.noQuizzes", "No quizzes yet")}
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                {t(
                                    "levels.quiz.addFirstQuiz",
                                    "Click 'Add Level Quiz' to create your first quiz"
                                )}
                            </p>
                        </div>
                    ) : (
                        <SkeletonList
                            data={transformedQuizzes}
                            type="acceptance-exam-card"
                            renderItem={(quiz) => (
                                <AcceptanceExamCard
                                    key={quiz.id}
                                    quiz={quiz}
                                    isExpanded={expandedQuizzes.includes(
                                        quiz.id
                                    )}
                                    expandedQuestions={expandedQuestions}
                                    isAddingQuestion={
                                        isAddingQuestion === quiz.id
                                    }
                                    newQuestion={newQuestion}
                                    onToggleExpand={() =>
                                        toggleQuizExpand(quiz.id)
                                    }
                                    onToggleQuestionExpand={
                                        toggleQuestionExpand
                                    }
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
                                        handleDeleteQuestion(
                                            quiz.id,
                                            questionId
                                        )
                                    }
                                    onEditOption={handleEditOption}
                                    onDeleteOption={handleDeleteOption}
                                    questionsPagination={questionsPagination}
                                    onQuestionsPageChange={setQuestionsPage}
                                    optionsPagination={optionsPagination}
                                    onOptionsPageChange={setOptionsPage}
                                    isPending={isDeletingQuiz}
                                    isQuestionPending={
                                        isCreatingQuestion || isCreatingOption
                                    }
                                />
                            )}
                        />
                    )}
                </div>

                {/* Exams Pagination */}
                {quizzesPagination && quizzesPagination.lastPage > 1 && (
                    <Pagination
                        currentPage={quizzesPagination.currentPage}
                        totalPages={quizzesPagination.lastPage}
                        goToNextPage={() =>
                            setExamsPage((p) =>
                                Math.min(p + 1, quizzesPagination.lastPage)
                            )
                        }
                        goToPreviousPage={() =>
                            setExamsPage((p) => Math.max(p - 1, 1))
                        }
                        setPage={setExamsPage}
                        itemsPerPage={quizzesPagination.perPage}
                        totalItems={quizzesPagination.total}
                    />
                )}
            </div>

            {/* Lock Behavior Notice */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                    <span className="font-medium">
                        {t("levels.lockBehavior", "Lock Behavior")}:
                    </span>{" "}
                    {t(
                        "levels.lockBehaviorDescription",
                        "When students complete this quiz with a passing score (75% or higher), the next level will automatically unlock for them."
                    )}
                </p>
            </div>

            {/* Edit Quiz Modal */}
            {editingQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("levels.quiz.editQuiz", "Edit Quiz")}
                        </h3>
                        <AcceptanceExamForm
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
                title={t("levels.quiz.deleteDialog.title", "Delete Quiz")}
                message={t(
                    "levels.quiz.deleteDialog.message",
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
                    "levels.quiz.deleteQuestionDialog.title",
                    "Delete Question"
                )}
                message={t(
                    "levels.quiz.deleteQuestionDialog.message",
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
                            {t("levels.quiz.editQuestion", "Edit Question")}
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

            {/* Delete Option Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteOptionDialog.isOpen}
                onClose={() =>
                    setDeleteOptionDialog({
                        isOpen: false,
                        questionId: null,
                        optionId: null,
                    })
                }
                variant="danger"
                title={t(
                    "levels.quiz.deleteOptionDialog.title",
                    "Delete Option"
                )}
                message={t(
                    "levels.quiz.deleteOptionDialog.message",
                    "Are you sure you want to delete this option? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={confirmDeleteOption}
                loading={isDeletingOption}
            />

            {/* Edit Option Modal */}
            {editingOption && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t("levels.quiz.editOption", "Edit Option")}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("levels.quiz.optionText", "Option Text")}
                                </label>
                                <input
                                    type="text"
                                    value={editOptionData.option_text || ""}
                                    onChange={(e) =>
                                        setEditOptionData({
                                            ...editOptionData,
                                            option_text: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("levels.quiz.order", "Order")}
                                </label>
                                <input
                                    type="number"
                                    value={editOptionData.order || 0}
                                    onChange={(e) =>
                                        setEditOptionData({
                                            ...editOptionData,
                                            order:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={editOptionData.is_correct || false}
                                    onChange={(e) =>
                                        setEditOptionData({
                                            ...editOptionData,
                                            is_correct: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {t(
                                        "levels.quiz.isCorrect",
                                        "Correct Answer"
                                    )}
                                </span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={handleCancelEditOption}
                                disabled={isUpdatingOption}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                {t("common.cancel", "Cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateOption}
                                disabled={isUpdatingOption}
                                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isUpdatingOption
                                    ? t("common.saving", "Saving...")
                                    : t("common.save", "Save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}

export default ExamsPage;
