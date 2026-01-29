import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// ============================================================================
// Auto-discover locale files using Vite glob import
// ============================================================================

type LocaleModule = Record<string, unknown>;

// Global locales: src/i18n/locales/{lang}/{namespace}.json
const globalLocales = import.meta.glob<LocaleModule>("./locales/*/*.json", {
    eager: true,
});

// Feature locales: src/features/*/locales/{lang}.json, src/features/dashboard/*/locales/{lang}.json, src/features/dashboard/shared/*/locales/{lang}.json, and src/features/dashboard/classroom/*/locales/{lang}.json
const featureLocales = import.meta.glob<LocaleModule>(
    [
        "../features/*/locales/*.json",
        "../features/dashboard/*/locales/*.json",
        "../features/dashboard/shared/*/locales/*.json",
        "../features/dashboard/classroom/*/locales/*.json",
    ],
    { eager: true }
);

// Shared component locales: src/shared/components/**/{component}/locales/{lang}.json
const sharedLocales = import.meta.glob<LocaleModule>(
    "../shared/components/**/*/locales/*.json",
    { eager: true }
);

// Design System locales: src/design-system/locales/{lang}.json
const designSystemLocales = import.meta.glob<LocaleModule>(
    "../design-system/locales/*.json",
    { eager: true }
);

// Shared root locales: src/shared/locales/{lang}.json
const sharedRootLocales = import.meta.glob<LocaleModule>(
    "../shared/locales/*.json",
    { eager: true }
);

// Search module locales: src/search/locales/{lang}.json
const searchLocales = import.meta.glob<LocaleModule>(
    "../search/locales/*.json",
    { eager: true }
);

// ============================================================================
// Build resources dynamically
// ============================================================================

type Resources = Record<string, Record<string, LocaleModule>>;

const resources: Resources = {
    en: {},
    ar: {},
};

// Process global locales: ./locales/en/dashboard.json → resources.en.dashboard
Object.entries(globalLocales).forEach(([path, module]) => {
    // Extract: ./locales/{lang}/{namespace}.json
    const match = path.match(/\.\/locales\/(\w+)\/(\w+)\.json$/);
    if (match) {
        const [, lang, namespace] = match;
        if (resources[lang]) {
            resources[lang][namespace] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process feature locales: ../features/{feature}/locales/{lang}.json or ../features/dashboard/{feature}/locales/{lang}.json or ../features/dashboard/shared/{feature}/locales/{lang}.json or ../features/dashboard/classroom/{feature}/locales/{lang}.json → resources.{lang}.{feature}
Object.entries(featureLocales).forEach(([path, module]) => {
    // Extract: ../features/{feature}/locales/{lang}.json or ../features/dashboard/{feature}/locales/{lang}.json or ../features/dashboard/shared/{feature}/locales/{lang}.json or ../features/dashboard/classroom/{feature}/locales/{lang}.json
    const match = path.match(
        /\.\.\/features\/(?:dashboard\/)?(?:shared\/|classroom\/)?([^/]+)\/locales\/(\w+)\.json$/
    );
    if (match) {
        const [, feature, lang] = match;
        if (resources[lang]) {
            resources[lang][feature] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process shared component locales: ../shared/components/**/{component}/locales/{lang}.json → resources.{lang}.{component}
Object.entries(sharedLocales).forEach(([path, module]) => {
    // Extract: component name (folder before /locales/) and language
    const match = path.match(/\/([^/]+)\/locales\/(\w+)\.json$/);
    if (match) {
        const [, component, lang] = match;
        if (resources[lang]) {
            resources[lang][component] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process design system locales: ../design-system/locales/{lang}.json → resources.{lang}.designSystem
Object.entries(designSystemLocales).forEach(([path, module]) => {
    // Extract language from path: ../design-system/locales/{lang}.json
    const match = path.match(/\/design-system\/locales\/(\w+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            // Use "designSystem" as namespace (camelCase to match usage in components)
            resources[lang]["designSystem"] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process shared root locales: ../shared/locales/{lang}.json → resources.{lang}.navbar
Object.entries(sharedRootLocales).forEach(([path, module]) => {
    // Extract language from path: ../shared/locales/{lang}.json
    const match = path.match(/\/shared\/locales\/(\w+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            // Use "navbar" as namespace to match usage in components
            resources[lang]["navbar"] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Process search locales: ../search/locales/{lang}.json → resources.{lang}.search
Object.entries(searchLocales).forEach(([path, module]) => {
    // Extract language from path: ../search/locales/{lang}.json
    const match = path.match(/\/search\/locales\/(\w+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            resources[lang]["search"] =
                (module as { default?: LocaleModule }).default || module;
        }
    }
});

// Extract all namespace keys for i18n config
const namespaces = [
    ...new Set([
        ...Object.keys(resources.en || {}),
        ...Object.keys(resources.ar || {}),
    ]),
];

const applyDocumentLanguage = (lng?: string) => {
    const language = lng || i18n.resolvedLanguage || i18n.language || "en";
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: localStorage.getItem("i18nextLng") || "en",
        defaultNS: "landing",
        ns: namespaces,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    })
    .then(() => {
        applyDocumentLanguage();
    });

i18n.on("languageChanged", (lng) => {
    applyDocumentLanguage(lng);
});

export default i18n;
