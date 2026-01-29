import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sun, Moon, LogOut, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo3CBlack from "@/assets/images/landing/3c-black.png";
import logo3CWhite from "@/assets/images/landing/3c-white.png";
import DEMIar from "@/assets/images/landing/DEMIar.png";
import DEMIen from "@/assets/images/landing/DEMIen.png";
import MCAR from "@/assets/images/landing/MCAR.png";
import MCEN from "@/assets/images/landing/MCEN.png";
import { useTheme } from "@/shared/context/ThemeContext";
import { useLogout } from "@/features/auth/api";
import { paths } from "@/router";

export function QuickActions() {
    const { t, i18n } = useTranslation("acceptanceTest");
    const { theme, toggleTheme } = useTheme();
    const logout = useLogout().mutate;
    const navigate = useNavigate();

    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const currentLang = i18n.language === "ar" ? "AR" : "EN";
    const isRTL = i18n.language === "ar";

    const { mcLogo, demiLogo } = useMemo(() => {
        return isRTL
            ? { mcLogo: MCAR, demiLogo: DEMIar }
            : { mcLogo: MCEN, demiLogo: DEMIen };
    }, [isRTL]);

    const handleSwitchLanguage = (lang: "en" | "ar") => {
        i18n.changeLanguage(lang);
        setLangMenuOpen(false);
        window.location.reload();
    };

    const handleSignOut = () => {
        logout();
        navigate(paths.auth.login());
    };

    // Close on click outside + Esc
    useEffect(() => {
        if (!langMenuOpen) return;

        const onMouseDown = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node))
                setLangMenuOpen(false);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLangMenuOpen(false);
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [langMenuOpen]);

    const actionBtnSurface =
        "bg-white/80 border-gray-200/70 text-gray-700 hover:bg-white " +
        "hover:shadow-md hover:-translate-y-[1px] " +
        "dark:bg-gray-900/60 dark:border-gray-700/60 dark:text-gray-200 dark:hover:bg-gray-900";

    return (
        <nav className="sticky top-0 left-0 right-0 z-100 w-full">
            {/* Outer shell (matches your page cards vibe) */}
            <div className="relative">
                {/* Soft background glow blobs */}
                <div className="pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -top-10 left-0 h-32 w-32 rounded-full bg-brand-400/10 blur-3xl" />

                {/* Glass bar */}
                <div className="bg-linear-to-r from-white/80 via-white/70 to-brand-50/60 dark:from-gray-950/70 dark:via-gray-950/60 dark:to-brand-950/20 backdrop-blur-xl border-b border-brand-100/60 dark:border-gray-800/60">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-8">
                        {/* Logos */}
                        <div className="flex items-center gap-3">
                            {/* 3C Logo */}
                            <img
                                src={
                                    theme === "dark" ? logo3CWhite : logo3CBlack
                                }
                                alt="3C Coding School"
                                className="w-25"
                            />

                            {/* Partner logos */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                {[mcLogo, demiLogo].map((src, idx) => (
                                    <img
                                        src={src}
                                        alt="Partner logo"
                                        className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            {/* Sign Out */}
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className={`${actionBtnSurface} hover:border-red-200/80 dark:hover:border-red-500/30`}
                                aria-label={t("signOut")}
                                title={t("signOut")}
                            >
                                <LogOut className="relative h-4 w-4 text-gray-600 group-hover:text-red-600 dark:text-gray-300 dark:group-hover:text-red-400" />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={`${actionBtnSurface} hover:border-brand-200/80 dark:hover:border-brand-500/30`}
                                aria-label="Toggle theme"
                                title="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="relative h-4 w-4" />
                                ) : (
                                    <Moon className="relative h-4 w-4" />
                                )}
                            </button>

                            {/* Language Selector */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setLangMenuOpen((v) => !v)}
                                    className={
                                        "group relative inline-flex items-center gap-2 h-10 dark:text-white"
                                    }
                                    aria-haspopup="menu"
                                    aria-expanded={langMenuOpen}
                                    title="Language"
                                >
                                    <span className="relative text-sm font-semibold tracking-wide">
                                        {currentLang}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                <div
                                    className={`absolute top-full mt-2 min-w-[160px] overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-700/60 bg-white/95 dark:bg-gray-950/90 shadow-xl ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-xl z-50 transition-all duration-200 ${
                                        langMenuOpen
                                            ? "opacity-100 translate-y-0 pointer-events-auto"
                                            : "opacity-0 -translate-y-1 pointer-events-none"
                                    } ${isRTL ? "left-0" : "right-0"}`}
                                >
                                    <div className="px-3 pt-3 pb-2">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                            {t("language") ?? "Language"}
                                        </p>
                                    </div>

                                    <div className="px-2 pb-2">
                                        <LangItem
                                            active={i18n.language === "en"}
                                            label="English"
                                            onClick={() =>
                                                handleSwitchLanguage("en")
                                            }
                                        />
                                        <LangItem
                                            active={i18n.language === "ar"}
                                            label="العربية"
                                            onClick={() =>
                                                handleSwitchLanguage("ar")
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* thin highlight line */}
                    <div className="h-px w-full bg-linear-to-r from-transparent via-brand-200/40 to-transparent dark:via-brand-500/15" />
                </div>
            </div>
        </nav>
    );
}

function LangItem({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-start ${
                active
                    ? "bg-linear-to-r from-brand-50 to-brand-100/40 dark:from-brand-500/10 dark:to-brand-600/10 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-500/20"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50/80 dark:hover:bg-gray-900/60"
            }`}
        >
            <span>{label}</span>
            {active ? (
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-lg bg-brand-500 text-white shadow-sm">
                    <Check className="h-4 w-4" strokeWidth={3} />
                </span>
            ) : (
                <span className="h-6 w-6 rounded-lg border border-gray-200/70 dark:border-gray-700/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </button>
    );
}

export { QuickActions as LanguageSwitch };
