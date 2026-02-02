import React from "react";
import PageHeader, { PageHeaderProps } from "./PageHeader";

function PageWrapper({
    children,
    classname,
    pageHeaderProps,
    containerClassname,
}: {
    children: React.ReactNode;
    classname?: string;
    containerClassname?: string;
    pageHeaderProps?: Partial<PageHeaderProps>;
}) {
    return (
        <>
            {pageHeaderProps?.title && (
                <PageHeader {...(pageHeaderProps as PageHeaderProps)} />
            )}
            <div className={`p-4 md:p-6 space-y-6 ${classname ?? ""}`}>
                <div
                    className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6 ${containerClassname ?? ""}`}
                >
                    {children}
                </div>
            </div>
        </>
    );
}
export default PageWrapper;
