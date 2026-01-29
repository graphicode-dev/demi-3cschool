/**
 * useLanguage Hook
 *
 * Provides translation function and language utilities for components.
 *
 * @example
 * ```tsx
 * const { t, isRTL, toggleLanguage } = useLanguage("landing");
 * ```
 */

import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function useLanguage(namespace?: string) {
    const { t, i18n } = useTranslation(namespace);

    const isRTL = i18n.language === "ar";
    const currentLanguage = i18n.language;

    const toggleLanguage = useCallback(() => {
        const newLang = i18n.language === "ar" ? "en" : "ar";
        i18n.changeLanguage(newLang);
    }, [i18n]);

    const changeLanguage = useCallback(
        (lang: string) => {
            i18n.changeLanguage(lang);
        },
        [i18n]
    );

    return {
        t,
        i18n,
        isRTL,
        currentLanguage,
        toggleLanguage,
        changeLanguage,
    };
}

export default useLanguage;
