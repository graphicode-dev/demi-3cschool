/**
 * Navigation Search Provider
 *
 * Built-in search provider that searches navigation items.
 * Provides instant search results without API calls.
 * Supports searching in both English and Arabic.
 * Results are displayed in the language of the search query.
 */

import { Navigation2 } from "lucide-react";
import i18n from "@/i18n";
import { navRegistry } from "@/navigation/navRegistry";
import type { NavItem } from "@/navigation/nav.types";
import type { SearchProvider, SearchableEntity } from "../types";

/**
 * Detect if text contains Arabic characters
 */
const isArabicText = (text: string): boolean => {
    // Arabic Unicode range: \u0600-\u06FF (Arabic), \u0750-\u077F (Arabic Supplement)
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicRegex.test(text);
};

/**
 * Get label in specific language
 */
const getLabelInLanguage = (item: NavItem, lang: "ar" | "en"): string => {
    if (lang === "en") {
        return item.label;
    }
    // Get Arabic translation
    return i18n.t(item.labelKey, { lng: "ar" }) || item.label;
};

/**
 * Flatten nav items including children
 */
const flattenNavItems = (items: NavItem[]): NavItem[] => {
    const result: NavItem[] = [];
    for (const item of items) {
        result.push(item);
        if (item.children) {
            result.push(...flattenNavItems(item.children));
        }
    }
    return result;
};

/**
 * Check if item matches search query (searches both English and Arabic labels)
 */
const matchesQuery = (item: NavItem, query: string): boolean => {
    const lowerQuery = query.toLowerCase();

    // Get both English and Arabic labels
    const englishLabel = item.label.toLowerCase();
    const arabicLabel = getLabelInLanguage(item, "ar").toLowerCase();

    return (
        englishLabel.includes(lowerQuery) ||
        arabicLabel.includes(lowerQuery) ||
        item.key.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Navigation search provider
 */
export const navigationSearchProvider: SearchProvider = {
    id: "navigation",
    entityType: "navigation",
    labelKey: "search:search.categories.pages",
    label: "Pages",
    icon: Navigation2,
    enabled: true,
    order: 1,

    search: async (query, options) => {
        const limit = options?.limit ?? 10;
        const allItems = navRegistry.getFlatList({ includeHidden: false });
        const flatItems = flattenNavItems(allItems);

        // Detect input language based on query characters
        const inputIsArabic = isArabicText(query);
        const displayLang = inputIsArabic ? "ar" : "en";

        const matchingItems = flatItems
            .filter((item) => matchesQuery(item, query))
            .slice(0, limit);

        const results: SearchableEntity[] = matchingItems.map((item) => {
            // Display label in the same language as the search query
            const displayLabel = getLabelInLanguage(item, displayLang);

            return {
                id: item.key,
                type: "navigation",
                title: displayLabel,
                titleKey: item.labelKey,
                path: item.href,
                icon: item.icon,
                keywords: [
                    item.key,
                    item.label,
                    getLabelInLanguage(item, "ar"),
                ],
            };
        });

        return results;
    },
};

export default navigationSearchProvider;
