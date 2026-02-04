import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import LogoArDark from "@/assets/images/logos/ArabicDark.png";
import LogoEnDark from "@/assets/images/logos/EnglishDark.png";
import LogoArLight from "@/assets/images/logos/ArabicLight.png";
import LogoEnLight from "@/assets/images/logos/EnglishLight.png";
import Logo3CBlack from "@/assets/images/landing/3c-black.png";
import { useSidebar } from "@/shared/context/SidebarContext";
import { useTheme } from "@/shared/context/ThemeContext";
import { useNavItems, type NavItem } from "@/navigation";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { paths } from "@/router";
import { authStore } from "@/auth";

const Sidebar: React.FC = () => {
    const { t, i18n } = useTranslation("sidebar");
    const isArabic = i18n.language === "ar";
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { theme } = useTheme();
    const location = useLocation();
    const { user } = authStore();

    const { sections } = useNavItems();

    // Track open main parent key (accordion - only one at a time)
    const [openMainParent, setOpenMainParent] = useState<string | null>(null);
    // Track open nested menus by their full path key
    const [openNestedMenus, setOpenNestedMenus] = useState<Set<string>>(
        new Set()
    );

    // Check if href exactly matches current path (for active state)
    const isExactMatch = useCallback(
        (href: string) => {
            if (href === "#") return false;
            return location.pathname === href;
        },
        [location.pathname]
    );

    // Check if current path starts with href (for parent highlighting)
    // e.g., /lessons/1 starts with /lessons
    const isPathUnderHref = useCallback(
        (href: string) => {
            if (href === "#" || href === "/") return false;
            // Check if current path starts with href (with proper boundary)
            return (
                location.pathname === href ||
                location.pathname.startsWith(href + "/")
            );
        },
        [location.pathname]
    );

    // Check if any child (recursively) has exact match - used for parent highlighting
    const hasActiveChild = useCallback(
        (item: NavItem): boolean => {
            if (!item.children) return false;
            return item.children.some(
                (child) => isExactMatch(child.href) || hasActiveChild(child)
            );
        },
        [isExactMatch]
    );

    // Check if item or any descendant matches current path - used for auto-expand
    const containsActivePath = useCallback(
        (item: NavItem): boolean => {
            if (isExactMatch(item.href)) return true;
            if (isPathUnderHref(item.href)) return true;
            if (item.children) {
                return item.children.some((child) => containsActivePath(child));
            }
            return false;
        },
        [isExactMatch, isPathUnderHref]
    );

    const getLabel = (item: NavItem): string => {
        const translated = t(item.labelKey);
        return translated !== item.labelKey ? translated : item.label;
    };

    // Find the main parent key that contains the active path
    const findActiveMainParent = useCallback((): string | null => {
        for (const section of sections) {
            for (const item of section.items) {
                if (containsActivePath(item)) {
                    return item.key;
                }
            }
        }
        return null;
    }, [sections, containsActivePath]);

    // Find all nested menu paths that should be expanded to show active item
    const findNestedPathsToActive = useCallback(
        (items: NavItem[], parentPath: string = ""): string[] => {
            const paths: string[] = [];
            for (const item of items) {
                const currentPath = parentPath
                    ? `${parentPath}/${item.key}`
                    : item.key;
                if (item.children && containsActivePath(item)) {
                    paths.push(currentPath);
                    paths.push(
                        ...findNestedPathsToActive(item.children, currentPath)
                    );
                }
            }
            return paths;
        },
        [containsActivePath]
    );

    // Auto-expand to active item on route change
    useEffect(() => {
        const activeMainParent = findActiveMainParent();
        if (activeMainParent) {
            setOpenMainParent(activeMainParent);
            // Find nested paths within the active main parent
            const nestedPaths: string[] = [];
            for (const section of sections) {
                for (const item of section.items) {
                    if (item.key === activeMainParent && item.children) {
                        nestedPaths.push(
                            ...findNestedPathsToActive(item.children, item.key)
                        );
                    }
                }
            }
            setOpenNestedMenus(new Set(nestedPaths));
        }
    }, [
        location.pathname,
        sections,
        findActiveMainParent,
        findNestedPathsToActive,
    ]);

    // Toggle main parent (accordion - closes others)
    const toggleMainParent = (key: string) => {
        setOpenMainParent((prev) => (prev === key ? null : key));
        // Clear nested menus when switching main parent
        if (openMainParent !== key) {
            setOpenNestedMenus(new Set());
        }
    };

    // Toggle nested menu
    const toggleNestedMenu = (menuPath: string) => {
        setOpenNestedMenus((prev) => {
            const next = new Set(prev);
            if (next.has(menuPath)) {
                next.delete(menuPath);
            } else {
                next.add(menuPath);
            }
            return next;
        });
    };

    const isMainParentOpen = (key: string) => openMainParent === key;
    const isNestedMenuOpen = (menuPath: string) =>
        openNestedMenus.has(menuPath);

    const renderIcon = (item: NavItem, size: "sm" | "md" = "md") => {
        if (!item.icon) return null;
        const Icon = item.icon;
        const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
        return <Icon className={sizeClass} />;
    };

    // Recursive nav item renderer for infinite nesting
    const renderNavItemRecursive = (
        item: NavItem,
        depth: number = 0,
        parentPath: string = ""
    ): React.ReactNode => {
        const hasChildren = item.children && item.children.length > 0;
        const isTopLevel = depth === 0;
        const showContent = isExpanded || isHovered || isMobileOpen;
        const currentPath = parentPath ? `${parentPath}/${item.key}` : item.key;

        // Active state: exact match OR path is under this item's href
        const isItemExactActive = isExactMatch(item.href);
        const isItemPathActive = isPathUnderHref(item.href);
        const isItemActive = isItemExactActive || isItemPathActive;
        const hasActiveDescendant =
            hasActiveChild(item) || (hasChildren && containsActivePath(item));

        // For top-level items with children: check if open via accordion
        // For nested items with children: check via nested menu set
        const isOpen = isTopLevel
            ? isMainParentOpen(item.key)
            : isNestedMenuOpen(currentPath);

        // Toggle handler based on depth
        const handleToggle = () => {
            if (isTopLevel) {
                toggleMainParent(item.key);
            } else {
                toggleNestedMenu(currentPath);
            }
        };

        if (hasChildren) {
            return (
                <li key={item.key}>
                    <button
                        onClick={handleToggle}
                        className={`w-full ${
                            isTopLevel
                                ? `menu-item group ${hasActiveDescendant ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`
                                : `menu-dropdown-item flex items-center justify-between ${hasActiveDescendant ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`
                        } text-[500px]`}
                    >
                        {isTopLevel ? (
                            <>
                                <span
                                    className={`menu-item-icon-size ${hasActiveDescendant ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}
                                >
                                    {renderIcon(item)}
                                </span>
                                {showContent && (
                                    <span className="text-base">
                                        {getLabel(item)}
                                    </span>
                                )}
                                {showContent && (
                                    <ChevronDown
                                        className={`ms-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${hasActiveDescendant ? "text-brand-500" : ""}`}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <span className="flex items-center gap-2 text-base">
                                    {item.icon && (
                                        <span className="w-4 h-4">
                                            {renderIcon(item, "sm")}
                                        </span>
                                    )}
                                    {getLabel(item)}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                            </>
                        )}
                    </button>
                    {showContent && (
                        <div
                            className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[2000px]" : "max-h-0"}`}
                        >
                            <ul
                                className={`mt-2 space-y-1 ${depth === 0 ? "ms-9" : "ms-4"}`}
                            >
                                {item.children!.map((child) =>
                                    renderNavItemRecursive(
                                        child,
                                        depth + 1,
                                        currentPath
                                    )
                                )}
                            </ul>
                        </div>
                    )}
                </li>
            );
        }

        // Leaf node (no children) - active if exact match or path is under href
        if (isTopLevel) {
            return (
                <li key={item.key}>
                    <Link
                        to={item.href}
                        className={`menu-item group ${isItemActive ? "menu-item-active" : "menu-item-inactive"}`}
                    >
                        <span
                            className={`menu-item-icon-size ${isItemActive ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}
                        >
                            {renderIcon(item)}
                        </span>
                        {showContent && (
                            <span className="">{getLabel(item)}</span>
                        )}
                    </Link>
                </li>
            );
        }

        return (
            <li key={item.key}>
                <Link
                    to={item.href}
                    className={`menu-dropdown-item flex items-center gap-2 ${isItemActive ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"} text-sm`}
                >
                    {item.icon && (
                        <span className="w-4 h-4">
                            {renderIcon(item, "sm")}
                        </span>
                    )}
                    {getLabel(item)}
                </Link>
            </li>
        );
    };

    const renderSection = (section: (typeof sections)[number]) => (
        <div key={section.id}>
            {section.showHeader && (
                <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                        !isExpanded && !isHovered
                            ? "lg:justify-center"
                            : "justify-start"
                    }`}
                >
                    {isExpanded || isHovered || isMobileOpen
                        ? t(section.labelKey)
                        : "•••"}
                </h2>
            )}
            <ul className="flex flex-col gap-4">
                {section.items.map((item) => renderNavItemRecursive(item, 0))}
            </ul>
        </div>
    );

    return (
        <aside
            className={`fixed flex flex-col lg:mt-0 top-0 px-5 bg-white dark:bg-gray-800 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-40 border-e border-gray-200 
        ${
            isExpanded || isMobileOpen
                ? "w-[290px]"
                : isHovered
                  ? "w-[290px]"
                  : "ltr:-right-100 rtl:-left-100 w-0 lg:w-[90px]"
        }
        ${isMobileOpen ? "ltr:left-0 rtl:right-0" : "translate-x-full"}
        lg:ltr:left-0 lg:rtl:right-0 lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`py-8 flex ${
                    !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                }`}
            >
                <Link to="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <div className="flex justify-center items-center gap-2">
                            {theme === "light" ? (
                                isArabic ? (
                                    <img
                                        src={LogoArDark}
                                        className="w-200 object-contain"
                                        alt="Logo"
                                    />
                                ) : (
                                    <img
                                        src={LogoEnDark}
                                        className="w-200 object-contain"
                                        alt="Logo"
                                    />
                                )
                            ) : isArabic ? (
                                <img
                                    src={LogoArLight}
                                    className="w-200 object-contain"
                                    alt="Logo"
                                />
                            ) : (
                                <img
                                    src={LogoEnLight}
                                    className="w-200 object-contain"
                                    alt="Logo"
                                />
                            )}
                        </div>
                    ) : (
                        <div>
                            <img
                                src={Logo3CBlack}
                                alt="Logo"
                                width={100}
                                height={32}
                            />
                        </div>
                    )}
                </Link>
            </div>

            {user?.role?.name === "admin" && (
                <Link
                    to={paths.dashboard.root.list()}
                    className={`flex items-center gap-3 mb-10 px-3 py-2 rounded-lg transition-colors ${
                        location.pathname === paths.dashboard.root.list()
                            ? "bg-brand-50 dark:bg-brand-500/10"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <LayoutDashboard
                                className={`${
                                    location.pathname ===
                                    paths.dashboard.root.list()
                                        ? "text-brand-500"
                                        : "text-gray-800 dark:text-gray-200"
                                }`}
                            />
                            <h2
                                className={`flex ${
                                    location.pathname ===
                                    paths.dashboard.root.list()
                                        ? "text-brand-500"
                                        : "text-gray-800 dark:text-gray-200"
                                } ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                {t("sidebar.dashboard")}
                            </h2>
                        </>
                    ) : (
                        <LayoutDashboard
                            className={`${
                                location.pathname ===
                                paths.dashboard.root.list()
                                    ? "text-brand-500"
                                    : "text-gray-800 dark:text-gray-200"
                            }`}
                        />
                    )}
                </Link>
            )}

            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-6">
                        {sections.map((section) => renderSection(section))}
                        <span className="px-4 text-xs text-gray-300">
                            © {new Date().getFullYear()} 3C Coding School
                        </span>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
