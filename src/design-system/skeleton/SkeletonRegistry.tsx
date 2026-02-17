// SkeletonRegistry.tsx

import { Skeleton } from "./Skeleton";
import { SkeletonType } from "./types";

export const SkeletonRegistry: Record<SkeletonType, React.FC> = {
    "student-card": () => (
        <div className="p-4 border rounded-xl space-y-3 animate-pulse">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    ),

    "students-table": () => (
        <div className="space-y-3 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
            ))}
        </div>
    ),

    chart: () => <Skeleton className="h-64 w-full rounded-lg animate-pulse" />,

    "dashboard-card": () => (
        <div className="p-6 rounded-xl border space-y-4 animate-pulse">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-full" />
        </div>
    ),

    "page-header": () => (
        <div className="space-y-3 animate-pulse mb-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    ),

    "program-card": () =>
        Array.from({ length: 3 }).map((_, i) => (
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
        )),
};
