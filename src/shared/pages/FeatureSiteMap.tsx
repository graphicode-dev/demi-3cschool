/**
 * FeatureSiteMap Component
 *
 * A placeholder page component for missing/intermediate routes in breadcrumbs.
 * Shows a sitemap of available routes within the current feature to help users navigate.
 *
 * @example
 * ```tsx
 * // In routes configuration
 * {
 *     path: "resources/folder",
 *     element: (
 *         <FeatureSiteMap
 *             featureKey="resources"
 *             titleKey="resources:folder.sitemap.title"
 *             routes={[
 *                 { path: "/admin/resources", labelKey: "resources:title" },
 *                 { path: "/admin/resources/folder/create", labelKey: "resources:folder.create" },
 *             ]}
 *         />
 *     ),
 * }
 * ```
 */

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Map, ArrowLeft, Home, ChevronRight, FolderOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SiteMapRoute {
    path: string;
    labelKey: string;
    label?: string;
    description?: string;
    descriptionKey?: string;
    icon?: LucideIcon;
    children?: SiteMapRoute[];
}

interface FeatureSiteMapProps {
    featureKey: string;
    titleKey?: string;
    title?: string;
    descriptionKey?: string;
    description?: string;
    routes: SiteMapRoute[];
    homePath?: string;
}

function FeatureSiteMap({
    featureKey,
    titleKey,
    title,
    descriptionKey,
    description,
    routes,
    homePath = "/admin",
}: FeatureSiteMapProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const displayTitle = titleKey
        ? t(titleKey)
        : title || t("common:sitemap.title");
    const displayDescription = descriptionKey
        ? t(descriptionKey)
        : description || t("common:sitemap.description");

    const renderRoute = (route: SiteMapRoute, depth: number = 0) => {
        const Icon = route.icon || FolderOpen;
        const routeLabel = route.labelKey
            ? t(route.labelKey)
            : route.label || route.path;
        const routeDescription = route.descriptionKey
            ? t(route.descriptionKey)
            : route.description;
        const isCurrentPath = pathname === route.path;

        return (
            <div key={route.path} className={depth > 0 ? "ms-6" : ""}>
                <Link
                    to={route.path}
                    className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                        isCurrentPath
                            ? "bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                    }`}
                >
                    <div
                        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                            isCurrentPath
                                ? "bg-brand-100 dark:bg-brand-500/20"
                                : "bg-gray-100 dark:bg-gray-700 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10"
                        }`}
                    >
                        <Icon
                            className={`w-5 h-5 ${
                                isCurrentPath
                                    ? "text-brand-600 dark:text-brand-400"
                                    : "text-gray-500 dark:text-gray-400 group-hover:text-brand-500"
                            }`}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span
                                className={`font-medium ${
                                    isCurrentPath
                                        ? "text-brand-700 dark:text-brand-300"
                                        : "text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400"
                                }`}
                            >
                                {routeLabel}
                            </span>
                            <ChevronRight
                                className={`w-4 h-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 ${
                                    isCurrentPath
                                        ? "text-brand-500"
                                        : "text-gray-400"
                                }`}
                            />
                        </div>
                        {routeDescription && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {routeDescription}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono">
                            {route.path}
                        </p>
                    </div>
                </Link>
                {route.children && route.children.length > 0 && (
                    <div className="mt-2 space-y-2 border-s-2 border-gray-200 dark:border-gray-700 ms-5">
                        {route.children.map((child) =>
                            renderRoute(child, depth + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">
                                {displayTitle}
                            </h1>
                            <p className="text-brand-100 text-sm">
                                {displayDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Routes List */}
                <div className="p-6">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                        {t("common:sitemap.availableRoutes")}
                    </h2>
                    <div className="space-y-2">
                        {routes.map((route) => renderRoute(route))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("common:sitemap.goBack")}
                        </button>
                        <button
                            onClick={() => navigate(homePath)}
                            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Home className="w-4 h-4" />
                            {t("common:sitemap.goHome")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureSiteMap;
