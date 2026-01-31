/**
 * CardGrid Component
 *
 * A responsive grid layout for navigation cards.
 */

import { ReactNode } from "react";

interface CardGridProps {
    /** Grid items */
    children: ReactNode;
    /** Number of columns */
    columns?: 1 | 2 | 3 | 4;
    /** Additional class names */
    className?: string;
    /** Test ID for testing */
    testId?: string;
}

const COLUMN_CLASSES = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

/**
 * Responsive card grid component
 */
export function CardGrid({
    children,
    columns = 3,
    className = "",
    testId,
}: CardGridProps) {
    return (
        <div
            className={`grid ${COLUMN_CLASSES[columns]} gap-6 ${className}`}
            data-testid={testId}
        >
            {children}
        </div>
    );
}

export default CardGrid;
