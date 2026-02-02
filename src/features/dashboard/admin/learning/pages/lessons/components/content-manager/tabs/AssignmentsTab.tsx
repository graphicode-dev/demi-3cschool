/**
 * Assignments Tab Component
 *
 * Displays assignment list and assignment editor for a lesson.
 * Integrates with lesson assignments API.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { arrayMove } from "@dnd-kit/sortable";
import ContentList from "../ContentList";
import ContentListItem from "../ContentListItem";
import EmptyState from "../EmptyState";
import AssignmentEditor from "../editors/AssignmentEditor";
import { useLessonAssignmentsByLesson } from "../../../api";
import { LessonAssignment } from "../../../types/lesson-assignments.types";

interface AssignmentsTabProps {
    lessonId: string;
}

export default function AssignmentsTab({ lessonId }: AssignmentsTabProps) {
    const { t } = useTranslation();
    const [selectedAssignment, setSelectedAssignment] =
        useState<LessonAssignment | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: assignmentsData, isLoading } = useLessonAssignmentsByLesson(
        lessonId,
        { page: currentPage }
    );

    const [assignments, setAssignments] = useState<LessonAssignment[]>([]);

    useEffect(() => {
        setAssignments(assignmentsData?.items || []);
    }, [assignmentsData]);

    const handleAddAssignment = () => {
        setSelectedAssignment(null);
        setIsCreating(true);
    };

    const handleSelectAssignment = (assignment: LessonAssignment) => {
        setSelectedAssignment(assignment);
        setIsCreating(false);
    };

    const handleReorder = (activeId: string, overId: string) => {
        setAssignments((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const renderDragOverlay = (activeId: string) => {
        const assignment = assignments.find((a) => a.id === activeId);
        if (!assignment) return null;
        return (
            <ContentListItem
                id={assignment.id}
                title={assignment.title}
                type="assignment"
                isPublished={true}
            />
        );
    };

    const handleSave = () => {
        setIsCreating(false);
    };

    const handleCancel = () => {
        setSelectedAssignment(null);
        setIsCreating(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Assignment List */}
            <ContentList
                title={t(
                    "lessons:content.assignments.listTitle",
                    "Assignment List"
                )}
                count={assignmentsData?.items?.length || 0}
                itemIds={assignments.map((a) => a.id)}
                onReorder={handleReorder}
                onAddItem={handleAddAssignment}
                isLoading={isLoading}
                renderDragOverlay={renderDragOverlay}
                currentPage={assignmentsData?.currentPage}
                lastPage={assignmentsData?.lastPage}
                onPageChange={setCurrentPage}
            >
                {assignments.map((assignment) => (
                    <ContentListItem
                        key={assignment.id}
                        id={assignment.id}
                        title={assignment.title}
                        type="assignment"
                        isPublished={true}
                        isSelected={selectedAssignment?.id === assignment.id}
                        onClick={() => handleSelectAssignment(assignment)}
                    />
                ))}
            </ContentList>

            {/* Assignment Editor */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                {selectedAssignment || isCreating ? (
                    <AssignmentEditor
                        lessonId={lessonId}
                        assignment={selectedAssignment}
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
