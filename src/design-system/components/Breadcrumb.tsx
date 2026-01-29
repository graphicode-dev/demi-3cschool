/**
 * Breadcrumb Component
 *
 * Dynamic breadcrumb navigation connected to the global navigation system.
 * Automatically derives breadcrumb trail from current pathname by matching
 * against navRegistry.
 *
 * @example
 * ```tsx
 * // Auto-generate from current route (used in dashboard layout)
 * <Breadcrumb />
 * ```
 */

import { Link, useLocation } from "react-router-dom";
import { useBreadcrumbs } from "@/navigation";
import type { BaseComponentProps } from "../types";

export interface BreadcrumbItemType {
    label: string;
    labelKey?: string;
    path: string;
    isActive: boolean;
}

interface BreadcrumbProps extends BaseComponentProps {
    /** Include dashboard as first crumb */
    includeDashboard?: boolean;
}

/**
 * Chevron separator icon
 */
function ChevronIcon() {
    return (
        <svg
            className="w-3 h-3 mx-1 text-gray-400 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
            />
        </svg>
    );
}

/**
 * Breadcrumb component with navigation system integration
 */
export function Breadcrumb({
    includeDashboard = true,
    className = "",
    testId,
}: BreadcrumbProps) {
    const { pathname } = useLocation();
    const breadcrumbs = useBreadcrumbs({ includeDashboard });

    if (breadcrumbs.length === 0) {
        return null;
    }

    return (
        <nav
            key={pathname}
            className={`flex p-4 md:p-6 bg-white dark:bg-gray-800 ${className}`}
            aria-label="Breadcrumb"
            data-testid={testId}
        >
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                {breadcrumbs.map((item, index) => {
                    const key = `${pathname}-${item.path}-${index}`;

                    return (
                        <li key={key} className="inline-flex items-center">
                            {index > 0 && <ChevronIcon />}
                            {!item.isActive ? (
                                <Link
                                    to={item.path}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium text-brand-500 dark:text-brand-400">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
