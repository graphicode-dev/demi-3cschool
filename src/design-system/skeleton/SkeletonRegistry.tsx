// SkeletonRegistry.tsx

import { Skeleton } from "./Skeleton";
import { SkeletonType } from "./types";

export const SkeletonRegistry: Record<SkeletonType, React.FC> = {
    "program-card": () => (
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
            <>
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-11 rounded-full" />
                </div>
            </>
        </div>
    ),
    "acceptance-exam-card": () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Quiz Header */}
            <div className="p-5 animate-pulse">
                <div className="flex items-center justify-between">
                    {/* Left — icon + title + meta */}
                    <div className="flex items-center gap-4">
                        {/* Circle icon */}
                        <Skeleton className="w-10 h-10 rounded-full" />

                        <div className="space-y-2">
                            {/* Title */}
                            <Skeleton className="h-5 w-40" />

                            {/* Meta row: time · score · attempts · questions */}
                            <div className="flex items-center gap-4 mt-1">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    </div>

                    {/* Right — action buttons + chevron */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-8 h-8 rounded-md" />
                        <Skeleton className="w-5 h-5 rounded" />
                    </div>
                </div>
            </div>
        </div>
    ),
    "grade-card": () => (
        <>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-start justify-between">
                    {/* Left — icon + title + description */}
                    <div className="flex items-start gap-4 flex-1">
                        {/* Square icon container */}
                        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />

                        <div className="space-y-2 flex-1">
                            {/* Title */}
                            <Skeleton className="h-5 w-1/3" />
                            {/* Description */}
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>

                    {/* Right — optional quiz button + chevron */}
                    <div className="flex items-center gap-2 shrink-0 mt-1">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-5 h-5 rounded" />
                    </div>
                </div>
            </div>
        </>
    ),
    "text-line": () => <Skeleton className="h-5 w-1/3" />,
    header: () => (
        <header className="p-4 md:p-6 bg-white dark:bg-gray-800 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left — back button + title + subtitle */}
                <div className="flex items-center gap-4">
                    <div className="space-y-2">
                        {/* Title */}
                        <Skeleton className="h-7 w-48" />
                        {/* Subtitle */}
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>

                {/* Right — action buttons */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
            </div>
        </header>
    ),
    "view-card": () => (
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800 animate-pulse">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left — back button + title + subtitle */}
                <div className="flex items-center gap-4">
                    <div className="space-y-2">
                        {/* Title */}
                        <Skeleton className="h-7 w-48" />
                        {/* Subtitle */}
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>
        </div>
    ),
    "lesson-content-list-item": () =>
        Array.from({ length: 5 }).map((_, i) => (
            <div className="w-1/3 flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
                {/* Drag handle */}
                <Skeleton className="w-6 h-6 rounded" />

                {/* Type icon */}
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />

                {/* Content — title + meta */}
                <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                </div>

                {/* Quiz button */}
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            </div>
        )),
};
