/**
 * Resources Page
 *
 * Main page displaying all sessions with their resource counts.
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SessionCard } from "../components";
import { resourcesPaths } from "../navigation/paths";
import type { Session } from "../types";
import { PageWrapper } from "@/design-system";
import { useFoldersList } from "@/features/dashboard/admin/resources/api";

export function ResourcesPage() {
    const { t } = useTranslation("resources");
    const navigate = useNavigate();

    const { data: foldersPage, isLoading } = useFoldersList({ page: 1 });
    const folders = foldersPage?.items ?? [];

    const sessions: Session[] = useMemo(
        () =>
            folders.map((folder, index) => ({
                id: String(folder.id),
                title: folder.name,
                order: index,
                resourceCount: folder.resourcesCount,
                resources: [],
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt,
            })),
        [folders]
    );

    const handleSessionClick = (session: Session) => {
        navigate(resourcesPaths.session(session.id));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full p-4">
                <div className="mb-4">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                    <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-pulse"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("resources.pageTitle", "Learning Resources"),
                subtitle: t(
                    "resources.pageSubtitle",
                    "Find activities and materials for your sessions."
                ),
            }}
        >
            {/* Sessions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onClick={() => handleSessionClick(session)}
                    />
                ))}
            </div>

            {/* Empty State */}
            {sessions.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {t("resources.noSessions", "No sessions available")}
                        </p>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}

export default ResourcesPage;
