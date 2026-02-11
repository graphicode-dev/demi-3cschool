/**
 * Quizzes Tab Component
 *
 * Displays quiz list and quiz editor for a lesson.
 * Integrates with lesson quizzes API.
 */

import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { arrayMove } from "@dnd-kit/sortable";
import ContentList from "../ContentList";
import ContentListItem from "../ContentListItem";
import EmptyState from "../EmptyState";
import QuizEditor from "../editors/QuizEditor";
import { useLessonQuizzesByLesson } from "../../../api";
import { LessonQuiz } from "../../../types";

interface QuizzesTabProps {
    lessonId: string;
}

export default function QuizzesTab({ lessonId }: QuizzesTabProps) {
    const { t } = useTranslation();
    const [selectedQuiz, setSelectedQuiz] = useState<LessonQuiz | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: quizzesData, isLoading } = useLessonQuizzesByLesson(
        lessonId,
        { page: currentPage }
    );

    const [quizzes, setQuizzes] = useState<LessonQuiz[]>([]);

    useEffect(() => {
        setQuizzes(quizzesData?.items || []);
    }, [quizzesData]);

    const handleAddQuiz = () => {
        setSelectedQuiz(null);
        setIsCreating(true);
    };

    const handleSelectQuiz = (quiz: LessonQuiz) => {
        setSelectedQuiz(quiz);
        setIsCreating(false);
    };

    const handleReorder = (activeId: string, overId: string) => {
        setQuizzes((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const renderDragOverlay = (activeId: string) => {
        const quiz = quizzes.find((q) => String(q.id) === activeId);
        if (!quiz) return null;
        return (
            <ContentListItem
                id={String(quiz.id)}
                title={quiz.lesson?.title || `Quiz ${quiz.id}`}
                type="quiz"
                duration={quiz.timeLimit}
                isPublished={true}
            />
        );
    };

    const handleSave = () => {
        setIsCreating(false);
    };

    const handleCancel = () => {
        setSelectedQuiz(null);
        setIsCreating(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Quiz List */}
            <ContentList
                title={t(
                    "learning:lessons.content.quizzes.listTitle",
                    "Quiz List"
                )}
                count={quizzesData?.items?.length || 0}
                itemIds={quizzes.map((q) => String(q.id))}
                onReorder={handleReorder}
                onAddItem={handleAddQuiz}
                isLoading={isLoading}
                renderDragOverlay={renderDragOverlay}
                currentPage={quizzesData?.currentPage}
                lastPage={quizzesData?.lastPage}
                onPageChange={setCurrentPage}
            >
                {quizzes.map((quiz) => (
                    <ContentListItem
                        key={quiz.id}
                        id={String(quiz.id)}
                        title={quiz.lesson?.title || `Quiz ${quiz.id}`}
                        type="quiz"
                        duration={quiz.timeLimit}
                        isPublished={true}
                        isSelected={selectedQuiz?.id === quiz.id}
                        onClick={() => handleSelectQuiz(quiz)}
                    />
                ))}
            </ContentList>

            {/* Quiz Editor */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                {selectedQuiz || isCreating ? (
                    <QuizEditor
                        lessonId={lessonId}
                        quiz={selectedQuiz}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onDelete={handleCancel}
                    />
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}
