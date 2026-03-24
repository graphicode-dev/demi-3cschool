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
import { scrollToSection } from "../hooks";
import LogoAr from "@/assets/images/logos/ArabicDark.png";
import LogoEn from "@/assets/images/logos/EnglishDark.png";
import { authStore } from "@/auth";
import { useLogout } from "@/features/auth/api";
import { paths } from "@/router";
import { Icons } from "@/constants";
import { useLanguage } from "@/shared/hooks";

const navLinks = [
    { href: paths.site.home(), sectionId: "hero", labelKey: "nav.home" },
    {
        href: paths.site.about(),
        sectionId: "about-us",
        labelKey: "nav.aboutUs",
    },
    {
        href: paths.site.why3C(),
        sectionId: "why-3c",
        labelKey: "nav.why3C",
    },
    {
        href: paths.site.accreditation(),
        sectionId: "accreditation",
        labelKey: "nav.accreditation",
    },
    {
        href: paths.site.plans(),
        sectionId: "plans",
        labelKey: "nav.ourPackages",
    },
];

function LandingNavbar() {
    const { t, i18n } = useLanguage("landing");
    const { user, isAuthenticated } = authStore();
    const logout = useLogout();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
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
            className={`fixed top-0 left-0 right-0 z-100 w-full flex items-center justify-between px-4 sm:px-8 lg:px-16 py-4 lg:py-6 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md"
                    : "bg-transparent"
            }`}
        >
            {/* Logos */}
            <div className="flex items-center gap-6 lg:gap-12">
                {isRTL ? (
                    <img
                        src={LogoAr}
                        alt="Ministry of Communications"
                        className="h-10 w-auto object-fill transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <img
                        src={LogoEn}
                        alt="Ministry of Communications"
                        className="h-10 w-auto object-fill transition-transform duration-300 hover:scale-105"
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
                        className={`relative transition-all duration-300 hover:text-brand-500 text-[16px] ${
                            activeSection === link.sectionId
                                ? "text-brand-500 font-medium"
                                : "text-gray-500"
                        }`}
                        replace
                    >
                        {t(link.labelKey)}

                        {activeSection === link.sectionId && (
                            <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                                <Icons.Landing.NavActiveIcon
                                    size={20}
                                    color="#24ADE3"
                                />
                            </div>
                        )}
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
                        <Icons.Landing.LanguageIcon size={30} color="#393838" />
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
                        className="flex items-center justify-between gap-2 min-w-30 px-1 ps-4 py-1 bg-brand-500 text-white text-[18px] border border-black font-semibold rounded-full hover:bg-brand-600 transition-colors duration-300"
                    >
                        {t("nav.login")}
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <Icons.General.ChevronIcon
                                size={20}
                                color="var(--color-brand-500)"
                            />
                        </div>
                    </Link>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="lg:hidden p-2 transition-transform duration-300 hover:scale-110"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
            >
                {mobileMenuOpen ? (
                    <X className="w-8 h-8 text-brand-500" />
                ) : (
                    <div className="flex flex-col justify-between h-5 w-7">
                        <div className="w-5 h-[3px] bg-brand-500 rounded-full self-start"></div>
                        <div className="w-full h-[3px] bg-brand-500 rounded-full"></div>
                        <div className="w-5 h-[3px] bg-brand-500 rounded-full self-end"></div>
                    </div>
                )}
            </button>

            {/* Mobile Menu */}
            <div
                className={`absolute top-full left-0 right-0 h-dvh bg-[#e9f7fc] lg:hidden transition-all duration-400 overflow-y-auto ${
                    mobileMenuOpen
                        ? "opacity-100 visible translate-x-0"
                        : "opacity-0 invisible -translate-x-full"
                }`}
            >
                <div className="flex flex-col p-8 sm:p-12 gap-6 min-h-full pb-32">
                    {navLinks.map((link, index) => (
                        <div key={link.sectionId} className="flex flex-col items-start gap-0.5">
                            <Link
                                to={link.href}
                                onClick={(e) =>
                                    handleNavClick(e, link.sectionId, link.href)
                                }
                                className={`text-[24px] sm:text-[28px] py-1 transition-all duration-300 ${
                                    activeSection === link.sectionId
                                        ? "text-brand-500 font-bold"
                                        : "text-gray-800 font-bold hover:text-brand-500"
                                }`}
                                replace
                            >
                                {t(link.labelKey)}
                            </Link>

                            {/* Active link squiggly line */}
                            {activeSection === link.sectionId && (
                                <div className="px-2 mt-[-5px]">
                                    <Icons.Landing.NavActiveIcon size={24} color="#24ADE3" />
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Divider & Actions */}
                    <div className="flex flex-col mt-4 gap-8">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => changeLanguage(i18n.language === "ar" ? "en" : "ar")}
                                className="flex items-center gap-3 text-gray-800 font-bold text-[24px] tracking-wide transition-colors duration-300 hover:text-brand-500"
                            >
                                <Icons.Landing.LanguageIcon size={32} color="#393838" />
                                <span>{currentLang}</span>
                            </button>
                        </div>

                        {/* Authenticaton */}
                        {isAuthenticated && user ? (
                            <div className="flex flex-col items-start gap-4">
                                <Link
                                    to={profilePath}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white shadow-sm w-full font-bold"
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-brand-500">
                                        {user.image ? (
                                            <img src={user.image} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <User className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <span className="text-[20px] text-gray-900 truncate">
                                        {user.name?.split(" ")[0] || "User"}
                                    </span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        logout.mutate();
                                    }}
                                    className="flex items-center gap-3 px-6 py-3 w-max text-red-600 font-bold text-[20px] rounded-full hover:bg-red-50 transition-colors duration-200"
                                >
                                    <LogOut className="w-6 h-6" />
                                    {t("nav.logout", "Logout")}
                                </button>
                            </div>
                        ) : (
                            <Link
                                to={loginPath}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between gap-3 w-fit px-1 ps-6 py-1 bg-brand-500 text-white text-[20px] sm:text-[24px] border-[1.5px] border-black font-semibold rounded-full hover:bg-brand-600 transition-colors duration-300 shadow-sm"
                            >
                                {t("nav.login")}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center">
                                    <Icons.General.ChevronIcon
                                        size={24}
                                        color="var(--color-brand-500)"
                                    />
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default LandingNavbar;
