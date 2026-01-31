/**
 * Content List Component
 *
 * Generic draggable list wrapper for content items.
 * Uses @dnd-kit for smooth drag-and-drop with visual feedback.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    restrictToVerticalAxis,
    restrictToParentElement,
} from "@dnd-kit/modifiers";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";

interface ContentListProps {
    title: string;
    count: number;
    children: ReactNode;
    itemIds: string[];
    onReorder?: (activeId: string, overId: string) => void;
    onAddItem?: () => void;
    isLoading?: boolean;
    renderDragOverlay?: (activeId: string) => ReactNode;
}

export default function ContentList({
    title,
    count,
    children,
    itemIds,
    onReorder,
    onAddItem,
    isLoading = false,
    renderDragOverlay,
}: ContentListProps) {
    const { t } = useTranslation();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id && onReorder) {
            onReorder(active.id as string, over.id as string);
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <div className="w-full md:w-1/3 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                {/* Header */}
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {title} ({count}{" "}
                    {count === 1
                        ? t("lessons:content.itemSingular", "item")
                        : t("lessons:content.itemPlural", "items")}
                    )
                </h3>

                {/* Content List */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[
                            restrictToVerticalAxis,
                            restrictToParentElement,
                        ]}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={itemIds}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">{children}</div>
                        </SortableContext>
                        <DragOverlay>
                            {activeId && renderDragOverlay
                                ? renderDragOverlay(activeId)
                                : null}
                        </DragOverlay>
                    </DndContext>
                )}

                {/* Add Item Button */}
                {onAddItem && (
                    <button
                        onClick={onAddItem}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("lessons:content.addItem", "Add Item")}
                    </button>
                )}
            </div>
        </div>
    );
}
