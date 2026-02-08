/**
 * Navigation Search Provider
 *
 * Built-in search provider that searches navigation items.
 * Provides instant search results without API calls.
 * Supports searching in both English and Arabic.
 * Results are displayed in the language of the search query.
 * Filters results based on user role and permissions.
 */

import { Navigation2 } from "lucide-react";
import i18n from "@/i18n";
import { navRegistry } from "@/navigation/navRegistry";
import { authStore } from "@/auth/auth.store";
import { permissionStore } from "@/auth/permission.store";
import type { NavItem, NavFilterOptions } from "@/navigation/nav.types";
import type { SearchProvider, SearchableEntity } from "../types";
import type { AcceptanceExamStatus } from "@/features/dashboard/classroom/acceptanceTest/types";

// Admin-only sections that should not appear for classroom users
const ADMIN_ONLY_SECTIONS: string[] = ["Admin"];

// Classroom-only sections
const CLASSROOM_ONLY_SECTIONS: string[] = ["Classroom"];

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
 * Get filtered navigation items based on user role and permissions
 * Mirrors the filtering logic from useNavItems hook
 */
const getFilteredNavItems = (): NavItem[] => {
    const user = authStore.getState().user;
    const userRole = user?.role?.name?.toLowerCase();
    const permissions = permissionStore.getState().permissions ?? [];

    // Build filter options
    const filterOptions: NavFilterOptions = {
        role: userRole as NavFilterOptions["role"],
        permissions,
        includeHidden: false,
    };

    // Determine which dashboard section to show based on user role
    const userDashboardSection =
        userRole === "admin" || userRole === "super_admin"
            ? "Admin"
            : "Classroom";

    // Get acceptance exam status for students (TEMPORARY: Bypassed)
    const acceptanceExamStatus: AcceptanceExamStatus = "accepted";
    const needsAcceptanceExam = acceptanceExamStatus !== "accepted";

    // Get all sections with items
    const allSections = navRegistry.getSectionsWithItems(filterOptions);

    // Filter sections based on role
    const filteredSections = allSections
        .filter((section) => {
            // For classroom users, hide all admin-only sections
            if (userDashboardSection === "Classroom") {
                if (ADMIN_ONLY_SECTIONS.includes(section.id)) {
                    return false;
                }
            }

            // For admin users, hide classroom-only sections
            if (userDashboardSection === "Admin") {
                if (CLASSROOM_ONLY_SECTIONS.includes(section.id)) {
                    return false;
                }
            }

            return true;
        })
        .map((section) => {
            // If student needs acceptance exam, filter items in Classroom section
            if (needsAcceptanceExam && section.id === "Classroom") {
                const allowedKeys = [
                    "acceptanceTest",
                    "profile",
                    "tickets-management",
                ];
                return {
                    ...section,
                    items: section.items.filter((item) =>
                        allowedKeys.includes(item.key)
                    ),
                };
            }

            // If student has passed acceptance exam, hide acceptanceTest item
            if (!needsAcceptanceExam && section.id === "Classroom") {
                return {
                    ...section,
                    items: section.items.filter(
                        (item) => item.key !== "acceptanceTest"
                    ),
                };
            }

            return section;
        })
        .filter((section) => section.items.length > 0);

    // Flatten all items from filtered sections
    return filteredSections.flatMap((section) => section.items);
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

        // Get filtered items based on user role and permissions
        const allowedItems = getFilteredNavItems();
        const flatItems = flattenNavItems(allowedItems);

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
