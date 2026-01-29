import { API_CONFIG } from "@/shared/api/config/env";
import { useEffect, useRef } from "react";
import { useMatches } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface RouteHandle {
    meta?: {
        title?: string;
        titleKey?: string;
    };
}

/**
 * Sets document title based on current route's meta.title or meta.titleKey
 *
 * Works with the new feature-based routing architecture.
 * Routes define titles via:
 * - `meta: { title: "Page Title" }` for static titles
 * - `meta: { titleKey: "auth.meta.login" }` for i18n translated titles
 */
export const useTitle = () => {
    const matches = useMatches();
    const { t, i18n } = useTranslation();
    const documentDefined = typeof document !== "undefined";
    const originalTitle = useRef(documentDefined ? document.title : null);

    useEffect(() => {
        if (!documentDefined) return;

        // Find the deepest route with a title (most specific)
        let routeTitle: string | undefined;

        // Debug: log all matches and their handles
        if (API_CONFIG.ENV_MODE === "DEV") {
            console.debug(
                "[useTitle] matches:",
                matches.map((m) => ({
                    pathname: m.pathname,
                    handle: m.handle,
                }))
            );
        }

        for (let i = matches.length - 1; i >= 0; i--) {
            const handle = matches[i].handle as RouteHandle | undefined;
            if (handle?.meta?.titleKey) {
                // titleKey format: "featureNamespace:key" or just "key"
                const key = handle.meta.titleKey;
                const translated = t(key);
                // If translation returns the key itself, it wasn't found
                if (translated !== key) {
                    routeTitle = translated;
                    break;
                }
            }
            if (handle?.meta?.title) {
                // title can be a static string or an i18n key
                const title = handle.meta.title;
                const translated = t(title);
                // Use translated if found, otherwise use as-is
                routeTitle = translated !== title ? translated : title;
                break;
            }
        }

        const newTitle = routeTitle
            ? `${API_CONFIG.PROJECT_NAME} | ${routeTitle}`
            : API_CONFIG.PROJECT_NAME;

        if (document.title !== newTitle) {
            document.title = newTitle;
        }

        return () => {
            if (originalTitle.current) {
                document.title = originalTitle.current;
            }
        };
    }, [matches, documentDefined, t, i18n.language]);
};
