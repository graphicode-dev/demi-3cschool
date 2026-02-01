import React, { ReactElement, useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

type TabItemProps<T extends string> = {
    label: string;
    value: T;
    icon?: React.ReactNode;
    buttonLabel?: string;
    buttonHref?: string;
    entity?: string | string[];
    role?: string | string[];
    children: React.ReactNode;
};

type TabsProps<T extends string> = {
    children: ReactElement<TabItemProps<T>>[];
    hideBorder?: boolean;
    disableTabOnClick?: boolean;
    variant?: "default" | "pills" | "underline";
};

function Tabs<T extends string>({
    children,
    hideBorder = false,
    disableTabOnClick = false,
    variant = "default",
}: TabsProps<T>) {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );

    const visibleTabs = React.useMemo(() => {
        return React.Children.toArray(children).filter((child) => {
            const tab = child as ReactElement<TabItemProps<T>>;
            return true;
        }) as ReactElement<TabItemProps<T>>[];
    }, [children]);

    const firstVisibleTab = useMemo(
        () => (visibleTabs.length > 0 ? visibleTabs[0].props.value : ("" as T)),
        [visibleTabs]
    );

    const activeTab = useMemo(() => {
        const tabFromURL = searchParams.get("tab") as T | null;
        return tabFromURL &&
            visibleTabs.some((tab) => tab.props.value === tabFromURL)
            ? tabFromURL
            : firstVisibleTab;
    }, [searchParams, visibleTabs, firstVisibleTab]);

    useEffect(() => {
        if (!searchParams.get("tab") && firstVisibleTab) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("tab", firstVisibleTab);
            navigate(`${location.pathname}?${newParams.toString()}`, {
                replace: true,
            });
        }
    }, [firstVisibleTab, location.pathname, navigate, searchParams]);

    const updateTab = useCallback(
        (tab: T) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("tab", tab);
            navigate(`${location.pathname}?${newParams.toString()}`, {
                replace: true,
            });
        },
        [location.pathname, navigate, searchParams]
    );

    const activeTabItem = useMemo(
        () => visibleTabs.find((child) => child.props.value === activeTab),
        [visibleTabs, activeTab]
    );

    if (!activeTabItem && firstVisibleTab) {
        return (
            <Navigate
                to={`${location.pathname}?tab=${firstVisibleTab}`}
                replace
            />
        );
    }

    const getTabStyles = (isActive: boolean) => {
        const baseStyles =
            "capitalize whitespace-nowrap font-medium transition-all duration-200 flex items-center gap-2";

        switch (variant) {
            case "pills":
                return `${baseStyles} px-4 py-2.5 rounded-xl text-sm ${
                    isActive
                        ? "bg-brand-500 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`;
            case "underline":
                return `${baseStyles} px-4 py-3 text-sm border-b-2 ${
                    isActive
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                }`;
            default:
                return `${baseStyles} px-5 py-2.5 rounded-xl text-sm ${
                    isActive
                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
                }`;
        }
    };

    return (
        <section
            className={`relative p-4 sm:p-5 md:p-6 antialiased flex-1 w-full bg-white dark:bg-gray-800 rounded-2xl ${
                hideBorder ? "" : "border border-gray-200 dark:border-gray-800"
            }`}
        >
            {/* Tabs Navigation */}
            <div
                className={`w-full ${
                    variant === "underline"
                        ? "border-b border-gray-200 dark:border-gray-800"
                        : ""
                }`}
            >
                <div className="relative">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div
                            className={`flex ${
                                variant === "pills" ? "gap-2" : "gap-1"
                            } ${
                                variant === "underline"
                                    ? ""
                                    : "p-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                            }`}
                        >
                            {visibleTabs.length > 0 ? (
                                visibleTabs.map((child) => (
                                    <button
                                        key={child.props.value}
                                        type="button"
                                        className={getTabStyles(
                                            activeTab === child.props.value
                                        )}
                                        aria-current={
                                            activeTab === child.props.value
                                                ? "page"
                                                : undefined
                                        }
                                        onClick={() =>
                                            !disableTabOnClick &&
                                            updateTab(child.props.value)
                                        }
                                        disabled={disableTabOnClick}
                                    >
                                        {child.props.icon}
                                        {child.props.label}
                                    </button>
                                ))
                            ) : (
                                <div className="w-full p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No tabs available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* linear fade indicators */}
                    {visibleTabs.length > 3 && (
                        <>
                            <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-white dark:from-gray-900 to-transparent pointer-events-none sm:hidden" />
                            <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white dark:from-gray-900 to-transparent pointer-events-none sm:hidden" />
                        </>
                    )}
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6">{activeTabItem}</div>
        </section>
    );
}

Tabs.Item = function TabItem<T extends string>({ children }: TabItemProps<T>) {
    return children;
};

export default Tabs;
