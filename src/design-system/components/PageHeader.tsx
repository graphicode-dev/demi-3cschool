/**
 * PageHeader Component
 *
 * Consistent page header with title, subtitle, breadcrumbs, and actions.
 *
 * @example
 * ```tsx
 * <PageHeader
 *     title="Courses"
 *     subtitle="Manage your courses"
 *     breadcrumbs={[
 *         { label: 'Dashboard', href: '/dashboard' },
 *         { label: 'Courses' },
 *     ]}
 *     actions={<Button>Create Course</Button>}
 * />
 * ```
 */

import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { BaseComponentProps } from "../types";

export interface PageHeaderProps extends BaseComponentProps {
    /** Page title */
    title: string;
    /** Optional subtitle */
    subtitle?: string;
    /** Action buttons */
    actions?: ReactNode;
    /** Back button href */
    backHref?: string;
    /** Back button */
    backButton?: boolean;
    /** ID for accessibility (used in aria-labelledby) */
    id?: string;
}

/**
 * Page header component
 */
export function PageHeader({
    title,
    subtitle,
    actions,
    backHref,
    backButton = false,
    className = "",
    testId,
    id,
}: PageHeaderProps) {
    const navigate = useNavigate();
    const headingId =
        id || `page-header-${title.toLowerCase().replace(/\s+/g, "-")}`;

    const handleBack = () => {
        if (backHref) navigate(backHref);
        else navigate(-1);
    };

    return (
        <header
            className={`p-4 md:p-6 bg-white dark:bg-gray-800 ${className}`}
            data-testid={testId}
            aria-labelledby={headingId}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {backButton && (
                        <div
                            onClick={handleBack}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            aria-label="Go back"
                        >
                            <svg
                                className="w-5 h-5 text-gray-600 dark:text-gray-400 rtl:rotate-180"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                    )}

                    <div>
                        <h1
                            id={headingId}
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-2">{actions}</div>
                )}
            </div>
        </header>
    );
}

export default PageHeader;
