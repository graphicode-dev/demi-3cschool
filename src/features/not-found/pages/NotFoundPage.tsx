import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { routeRegistry } from "@/router/routeRegistry";
import type { RouteConfig } from "@/router/routes.types";
import { Home, ArrowLeft, Search } from "lucide-react";

const extractPathsFromRoutes = (
    routes: RouteConfig,
    basePath: string = ""
): string[] => {
    let result: string[] = [];

    const currentPath = routes.path
        ? `${basePath}/${routes.path}`.replace(/\/+/g, "/")
        : basePath;

    if (currentPath && !currentPath.includes(":") && !routes.index) {
        result.push(currentPath);
    }

    if (routes.children?.length) {
        for (const child of routes.children) {
            result = [...result, ...extractPathsFromRoutes(child, currentPath)];
        }
    }

    return result;
};

const getAllPathsFromRegistry = (): string[] => {
    const modules = routeRegistry.getAll();
    let allPaths: string[] = [];

    for (const module of modules) {
        const paths = extractPathsFromRoutes(module.routes, module.basePath);
        allPaths = [...allPaths, ...paths];
    }

    return [...new Set(allPaths)].filter(Boolean);
};

function getSimilarity(a: string, b: string): number {
    a = a.toLowerCase();
    b = b.toLowerCase();
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    const same = longerLength - editDistance(longer, shorter);
    return same / longerLength;
}

function editDistance(a: string, b: string): number {
    const dp = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
    );
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] =
                a[i - 1] === b[j - 1]
                    ? dp[i - 1][j - 1]
                    : Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) +
                      1;
        }
    }
    return dp[a.length][b.length];
}

const NotFoundPage = () => {
    const { t } = useTranslation("not-found");
    const location = useLocation();
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const KNOWN_PATHS = useMemo(() => {
        return getAllPathsFromRegistry();
    }, []);

    const pathSuggestions = useMemo(() => {
        const current = location.pathname;
        return KNOWN_PATHS.map((path) => ({
            path,
            score: getSimilarity(current, path),
        }))
            .filter((s) => s.score > 0.3)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((s) => s.path);
    }, [location.pathname]);

    useEffect(() => {
        console.error("404 Error: Non-existent route:", location.pathname);
        setSuggestions(pathSuggestions);
    }, [location.pathname, pathSuggestions]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-8 text-center">
                    {/* 404 Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-error-100 dark:bg-error-500/20 flex items-center justify-center">
                        <Search className="w-12 h-12 text-error-500" />
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl font-bold text-brand-500 mb-2">
                        404
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {t("pageNotFound")}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-brand-600 dark:text-brand-400">
                            {location.pathname}
                        </code>{" "}
                        {t("thePageDoesntExist")}
                    </p>

                    {/* Suggestions */}
                    {suggestions.length > 0 && (
                        <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 p-4 mb-6 rounded-xl text-left">
                            <p className="text-sm font-medium text-brand-700 dark:text-brand-400 mb-3">
                                {t("didYouMeanOneOfThese")}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((path) => (
                                    <button
                                        key={path}
                                        onClick={() => navigate(path)}
                                        className="px-3 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 text-sm font-medium transition-colors"
                                    >
                                        {path}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-5 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t("goBack")}
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Home className="w-4 h-4" />
                            {t("returnHome")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
