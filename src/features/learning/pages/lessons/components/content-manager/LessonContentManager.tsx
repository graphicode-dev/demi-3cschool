/**
 * Lesson Content Manager Component
 *
 * Main container for managing lesson content (videos, quizzes, assignments, materials).
 * Each tab loads its content lazily when selected.
 * Uses the design-system Tabs component with Tabs.Content and Tabs.Panel.
 */

import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@/design-system";

const VideosTab = lazy(() => import("./tabs/VideosTab"));
const QuizzesTab = lazy(() => import("./tabs/QuizzesTab"));
const AssignmentsTab = lazy(() => import("./tabs/AssignmentsTab"));
const MaterialsTab = lazy(() => import("./tabs/MaterialsTab"));

export type ContentTabType = "videos" | "quizzes" | "assignments" | "materials";

interface LessonContentManagerProps {
    lessonId: string;
}

const tabs: { key: ContentTabType; labelKey: string; fallback: string }[] = [
    {
        key: "videos",
        labelKey: "lessons:content.tabs.videos",
        fallback: "Videos",
    },
    {
        key: "quizzes",
        labelKey: "lessons:content.tabs.quizzes",
        fallback: "Quizzes",
    },
    {
        key: "assignments",
        labelKey: "lessons:content.tabs.assignments",
        fallback: "Assignments",
    },
    {
        key: "materials",
        labelKey: "lessons:content.tabs.materials",
        fallback: "Materials",
    },
];

function TabLoader() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function LessonContentManager({
    lessonId,
}: LessonContentManagerProps) {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = (searchParams.get("tab") as ContentTabType) || "videos";

    const handleTabChange = (value: string) => {
        setSearchParams({ tab: value });
    };

    return (
        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="underline"
            className="space-y-6"
        >
            <Tabs.List>
                {tabs.map((tab) => (
                    <Tabs.Item
                        key={tab.key}
                        value={tab.key}
                        label={t(tab.labelKey, tab.fallback)}
                    />
                ))}
            </Tabs.List>

            <Tabs.Content>
                <Tabs.Panel value="videos">
                    <Suspense fallback={<TabLoader />}>
                        <VideosTab lessonId={lessonId} />
                    </Suspense>
                </Tabs.Panel>
                <Tabs.Panel value="quizzes">
                    <Suspense fallback={<TabLoader />}>
                        <QuizzesTab lessonId={lessonId} />
                    </Suspense>
                </Tabs.Panel>
                <Tabs.Panel value="assignments">
                    <Suspense fallback={<TabLoader />}>
                        <AssignmentsTab lessonId={lessonId} />
                    </Suspense>
                </Tabs.Panel>
                <Tabs.Panel value="materials">
                    <Suspense fallback={<TabLoader />}>
                        <MaterialsTab lessonId={lessonId} />
                    </Suspense>
                </Tabs.Panel>
            </Tabs.Content>
        </Tabs>
    );
}
