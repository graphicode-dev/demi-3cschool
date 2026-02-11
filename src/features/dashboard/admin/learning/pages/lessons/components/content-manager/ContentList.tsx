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
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
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
    // Pagination props
    currentPage?: number;
    lastPage?: number;
    onPageChange?: (page: number) => void;
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
    currentPage,
    lastPage,
    onPageChange,
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
                        ? t("learning:lessons.content.itemSingular", "item")
                        : t("learning:lessons.content.itemPlural", "items")}
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

                {/* Pagination */}
                {currentPage && lastPage && onPageChange && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                            {t("common:pagination.previous", "Previous")}
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {currentPage} / {lastPage}
                        </span>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= lastPage}
                            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t("common:pagination.next", "Next")}
                            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                    </div>
                )}

                {/* Add Item Button */}
                {onAddItem && (
                    <button
                        onClick={onAddItem}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-brand-500 hover:text-brand-500 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("learning:lessons.content.addItem", "Add Item")}
                    </button>
                )}
            </div>
        </div>
    );
}
