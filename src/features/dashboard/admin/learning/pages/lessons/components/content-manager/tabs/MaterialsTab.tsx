/**
 * Materials Tab Component
 *
 * Displays material list and material editor for a lesson.
 * Integrates with lesson materials API.
 */

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { arrayMove } from "@dnd-kit/sortable";
import ContentList from "../ContentList";
import ContentListItem from "../ContentListItem";
import EmptyState from "../EmptyState";
import MaterialEditor from "../editors/MaterialEditor";
import { useLessonMaterialsByLesson } from "../../../api";
import { LessonMaterial } from "../../../types";

interface MaterialsTabProps {
    lessonId: string;
}

export default function MaterialsTab({ lessonId }: MaterialsTabProps) {
    const { t } = useTranslation();
    const [selectedMaterial, setSelectedMaterial] =
        useState<LessonMaterial | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: materialsData, isLoading } = useLessonMaterialsByLesson(
        lessonId,
        { page: currentPage }
    );

    const [materials, setMaterials] = useState<LessonMaterial[]>([]);

    useEffect(() => {
        setMaterials(materialsData?.items || []);
    }, [materialsData]);

    const handleAddMaterial = () => {
        setSelectedMaterial(null);
        setIsCreating(true);
    };

    const handleSelectMaterial = (material: LessonMaterial) => {
        setSelectedMaterial(material);
        setIsCreating(false);
    };

    const handleReorder = (activeId: string, overId: string) => {
        setMaterials((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    const renderDragOverlay = (activeId: string) => {
        const material = materials.find((m) => m.id === activeId);
        if (!material) return null;
        return (
            <ContentListItem
                id={material.id}
                title={material.title}
                type="material"
                isPublished={true}
            />
        );
    };

    const handleSave = () => {
        setIsCreating(false);
    };

    const handleCancel = () => {
        setSelectedMaterial(null);
        setIsCreating(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Material List */}
            <ContentList
                title={t(
                    "learning:lessons.content.materials.listTitle",
                    "Material List"
                )}
                count={materialsData?.items?.length || 0}
                itemIds={materials.map((m) => m.id)}
                onReorder={handleReorder}
                onAddItem={handleAddMaterial}
                isLoading={isLoading}
                renderDragOverlay={renderDragOverlay}
                currentPage={materialsData?.currentPage}
                lastPage={materialsData?.lastPage}
                onPageChange={setCurrentPage}
            >
                {materials.map((material) => (
                    <ContentListItem
                        key={material.id}
                        id={material.id}
                        title={material.title}
                        type="material"
                        isPublished={true}
                        isSelected={selectedMaterial?.id === material.id}
                        onClick={() => handleSelectMaterial(material)}
                    />
                ))}
            </ContentList>

            {/* Material Editor */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                {selectedMaterial || isCreating ? (
                    <MaterialEditor
                        lessonId={lessonId}
                        material={selectedMaterial}
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
