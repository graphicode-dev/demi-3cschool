/**
 * Session Resources Page
 *
 * Displays resources for a specific session with type filtering.
 */

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import {
    ResourceTypeFilter,
    ResourceItem,
    ResourceEmptyState,
} from "../components";
import { getSessionById, getResourcesByType } from "../mockData";
import { resourcesPaths } from "../navigation/paths";
import type { Session, Resource, ResourceFilter } from "../types";

export function SessionResourcesPage() {
    const { t } = useTranslation("resources");
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    const [session, setSession] = useState<Session | null>(null);
    const [activeFilter, setActiveFilter] = useState<ResourceFilter>("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const loadSession = async () => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (sessionId) {
                const foundSession = getSessionById(sessionId);
                setSession(foundSession || null);
            }
            setIsLoading(false);
        };
        loadSession();
    }, [sessionId]);

    const filteredResources = useMemo(() => {
        if (!sessionId) return [];
        return getResourcesByType(sessionId, activeFilter);
    }, [sessionId, activeFilter]);

    const handleBack = () => {
        navigate(resourcesPaths.root());
    };

    const handleViewResource = (resource: Resource) => {
        // Open resource in new tab or modal
        window.open(resource.url, "_blank");
    };

    const handleDownloadResource = (resource: Resource) => {
        // Trigger download
        const link = document.createElement("a");
        link.href = resource.url;
        link.download = resource.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                        />
                    ))}
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 animate-pulse"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
                                </div>
                                <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex flex-col h-full p-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">
                        {t("resources.actions.back", "Back")}
                    </span>
                </button>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t("resources.sessionNotFound", "Session not found")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header with back button */}
            <div className="mb-4">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-2 text-xs"
                >
                    <ArrowLeft className="w-3 h-3" />
                    <span>{t("resources.actions.backToSessions", "Back to sessions")}</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {session.title}
                </h1>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4">
                <ResourceTypeFilter
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
            </div>

            {/* Resources List */}
            {filteredResources.length === 0 ? (
                <ResourceEmptyState filter={activeFilter} />
            ) : (
                <div className="space-y-3">
                    {filteredResources.map((resource) => (
                        <ResourceItem
                            key={resource.id}
                            resource={resource}
                            onView={handleViewResource}
                            onDownload={
                                resource.type === "file"
                                    ? handleDownloadResource
                                    : undefined
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SessionResourcesPage;
