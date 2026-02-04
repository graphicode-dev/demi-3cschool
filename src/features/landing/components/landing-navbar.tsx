import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    ChevronDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { scrollToSection } from "../hooks";
import LogoAr from "@/assets/images/logos/ArabicDark.png";
import LogoEn from "@/assets/images/logos/EnglishDark.png";
import { authStore } from "@/auth";
import { useLogout } from "@/features/auth/api";
import { paths } from "@/router";

const navLinks = [
    { href: paths.site.home(), sectionId: "home", labelKey: "nav.home" },
    { href: paths.site.about(), sectionId: "about", labelKey: "nav.about" },
    {
        href: paths.site.howItWorks(),
        sectionId: "how-it-works",
        labelKey: "nav.howItWorks",
    },
    { href: paths.site.faq(), sectionId: "faq", labelKey: "nav.faq" },
    {
        href: paths.site.contact(),
        sectionId: "contact",
        labelKey: "nav.contact",
    },
];

function LandingNavbar() {
    const { t, i18n } = useTranslation("landing");
    const { user, isAuthenticated } = authStore();
    const logout = useLogout();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isScrolled, setIsScrolled] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    const profilePath = paths.dashboard.classroom.profile();
    const loginPath = paths.auth.login();
    const currentLang = i18n.language === "ar" ? "AR" : "EN";
    const isRTL = i18n.language === "ar";

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const changeLanguage = (lng: "en" | "ar") => {
        i18n.changeLanguage(lng);
        setLangMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = navLinks.map((link) => link.sectionId);
            for (const section of [...sections].reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string,
        href: string
    ) => {
        setActiveSection(sectionId);
        setMobileMenuOpen(false);

        // If already on landing page, scroll to section and update URL
        if (window.location.pathname === paths.site.home()) {
            e.preventDefault();
            scrollToSection(sectionId);
            // Update URL without navigation
            window.history.pushState(null, "", href);
        }
        // Otherwise, let the Link navigate to the page with hash
    };

    return (
        <nav
            className={`sticky top-0 left-0 right-0 z-100 w-full flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4 lg:py-6 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md"
                    : "bg-brand-50"
            }`}
        >
            {/* Logos */}
            <div className="flex items-center gap-6 lg:gap-12">
                {isRTL ? (
                    <img
                        src={LogoAr}
                        alt="Ministry of Communications"
                        className="h-17 w-auto object-fill transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <img
                        src={LogoEn}
                        alt="Ministry of Communications"
                        className="h-17 w-auto object-fill transition-transform duration-300 hover:scale-105"
                    />
                )}
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-12 font-medium">
                {navLinks.map((link) => (
                    <Link
                        key={link.sectionId}
                        to={link.href}
                        onClick={(e) =>
                            handleNavClick(e, link.sectionId, link.href)
                        }
                        className={`relative transition-all duration-300 hover:text-brand-500 ${
                            activeSection === link.sectionId
                                ? "text-brand-500 text-[18px] font-medium"
                                : "text-gray-500 text-[16px]"
                        }`}
                        replace
                    >
                        {t(link.labelKey)}
                    </Link>
                ))}
            </div>

            {/* Desktop Right Side - Language & Login */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                {/* Language Selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setLangMenuOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-gray-500 font-semibold text-[16px] transition-colors duration-300 hover:text-gray-700"
                        aria-haspopup="menu"
                        aria-expanded={langMenuOpen}
                    >
                        <span>{currentLang}</span>
                        <ChevronDown className="w-6 h-6" />
                    </button>

                    {langMenuOpen && (
                        <div
                            className={`absolute top-full mt-2 min-w-[120px] rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden ${
                                isRTL ? "right-0" : "left-0"
                            }`}
                            role="menu"
                        >
                            <button
                                type="button"
                                onClick={() => changeLanguage("en")}
                                className={`w-full px-4 py-2 text-sm font-semibold transition-colors duration-200 text-left hover:bg-gray-50 ${
                                    i18n.language === "en"
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                }`}
                                role="menuitem"
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                onClick={() => changeLanguage("ar")}
                                className={`w-full px-4 py-2 text-sm font-semibold transition-colors duration-200 text-left hover:bg-gray-50 ${
                                    i18n.language === "ar"
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                }`}
                                role="menuitem"
                            >
                                AR
                            </button>
                        </div>
                    )}
                </div>

                {/* Login / Profile */}
                {isAuthenticated && user ? (
                    <div className="relative" ref={profileMenuRef}>
                        <button
                            type="button"
                            onClick={() => setProfileMenuOpen((v) => !v)}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-brand-100 hover:bg-brand-200 transition-colors duration-300"
                        >
                            <img
                                src={user.image}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                alt=""
                            />
                            <span className="text-[14px] font-medium text-gray-900 max-w-[100px] truncate">
                                {user.name?.split(" ")[0] || "User"}
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                    profileMenuOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {profileMenuOpen && (
                            <div
                                className={`absolute top-full mt-2 min-w-[200px] rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden ${
                                    isRTL ? "left-0" : "right-0"
                                }`}
                                role="menu"
                            >
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <Link
                                    to={profilePath}
                                    onClick={() => setProfileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    role="menuitem"
                                >
                                    <LayoutDashboard className="w-4 h-4 text-gray-500" />
                                    {t("nav.dashboard", "Dashboard")}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        logout.mutate();
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                                    role="menuitem"
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t("nav.logout", "Logout")}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        to={loginPath}
                        className="text-[18px] font-semibold text-gray-900 hover:text-brand-500 transition-colors duration-300"
                    >
                        {t("nav.login")}
                    </Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="lg:hidden p-2 text-gray-700 transition-transform duration-300 hover:scale-110"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Mobile Menu */}
            <div
                className={`absolute top-full left-0 right-0 bg-white shadow-lg z-50 lg:hidden transition-all duration-300 ${
                    mobileMenuOpen
                        ? "max-h-[400px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="flex flex-col p-4 gap-4">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.sectionId}
                            to={link.href}
                            onClick={(e) =>
                                handleNavClick(e, link.sectionId, link.href)
                            }
                            className={`text-base py-2 transition-all duration-300 transform ${
                                activeSection === link.sectionId
                                    ? "text-gray-900 font-medium translate-x-2"
                                    : "text-gray-500 hover:text-gray-700 hover:translate-x-2"
                            }`}
                            style={{
                                transitionDelay: `${index * 50}ms`,
                            }}
                            replace
                        >
                            {t(link.labelKey)}
                        </Link>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setLangMenuOpen((v) => !v)}
                                className="flex items-center gap-1.5 text-gray-500 font-semibold transition-colors duration-300 hover:text-gray-700"
                                aria-haspopup="menu"
                                aria-expanded={langMenuOpen}
                            >
                                <span>{currentLang}</span>
                                <ChevronDown className="w-6 h-6" />
                            </button>

                            {langMenuOpen && (
                                <div
                                    className={`absolute top-full mt-2 min-w-[120px] rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden ${
                                        isRTL ? "right-0" : "left-0"
                                    }`}
                                    role="menu"
                                >
                                    <button
                                        type="button"
                                        onClick={() => changeLanguage("en")}
                                        className={`w-full px-4 py-2 text-sm font-semibold transition-colors duration-200 text-left hover:bg-gray-50 ${
                                            i18n.language === "en"
                                                ? "text-gray-900"
                                                : "text-gray-500"
                                        }`}
                                        role="menuitem"
                                    >
                                        EN
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => changeLanguage("ar")}
                                        className={`w-full px-4 py-2 text-sm font-semibold transition-colors duration-200 text-left hover:bg-gray-50 ${
                                            i18n.language === "ar"
                                                ? "text-gray-900"
                                                : "text-gray-500"
                                        }`}
                                        role="menuitem"
                                    >
                                        AR
                                    </button>
                                </div>
                            )}
                        </div>
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    to={profilePath}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100"
                                >
                                    <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white font-semibold text-xs">
                                        {user.name?.charAt(0).toUpperCase() || (
                                            <User className="w-3 h-3" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {user.name?.split(" ")[0] || "User"}
                                    </span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => logout.mutate()}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to={loginPath}
                                className="text-base font-semibold text-gray-900 hover:text-brand-500 transition-colors duration-300"
                            >
                                {t("nav.login")}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default LandingNavbar;
