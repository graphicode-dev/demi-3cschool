/**
 * LevelGroupCard Component
 *
 * A card that groups levels by course, displaying the course title
 * and a list of levels within that course.
 */

import type { ReactNode } from "react";

interface LevelGroupCardProps {
    courseTitle: string;
    children: ReactNode;
    className?: string;
}

export function LevelGroupCard({
    courseTitle,
    children,
    className = "",
}: LevelGroupCardProps) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
        >
            <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {courseTitle}
                </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {children}
            </div>
        </div>
    );
}

export default LevelGroupCard;
