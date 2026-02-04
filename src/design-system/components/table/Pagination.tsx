import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    setPage: (page: number) => void;
    itemsPerPage: number;
    totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setPage,
    itemsPerPage,
    totalItems,
}) => {
    const { t } = useTranslation();
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const pageRange = 2;

        pages.push(1);

        if (currentPage > pageRange + 2) {
            pages.push("...");
        }

        for (
            let i = Math.max(2, currentPage - pageRange);
            i <= Math.min(totalPages - 1, currentPage + pageRange);
            i++
        ) {
            pages.push(i);
        }

        if (currentPage < totalPages - pageRange - 1) {
            pages.push("...");
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-500 dark:text-gray-400">
                {t("designSystem:designSystem.table.showing")}{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    {startItem}
                </span>{" "}
                {t("designSystem:designSystem.table.to")}{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    {endItem}
                </span>{" "}
                {t("designSystem:designSystem.table.of")}{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    {totalItems}
                </span>{" "}
                {t("designSystem:designSystem.table.results")}
            </p>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title={t("designSystem:designSystem.table.previousPage")}
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                            goToPreviousPage();
                        }
                    }}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg rtl:rotate-180 transition-colors ${
                        currentPage === 1
                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    }`}
                >
                    <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
                </button>

                <div className="flex items-center gap-1">
                    {pageNumbers.map((page, index) => (
                        <React.Fragment key={index}>
                            {typeof page === "number" ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page !== currentPage) {
                                            setPage(page);
                                        }
                                    }}
                                    className={`flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg font-medium transition-colors ${
                                        currentPage === page
                                            ? "bg-brand-500 text-white dark:bg-brand-500"
                                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span className="flex items-center justify-center min-w-[36px] h-9 px-2 text-gray-400 dark:text-gray-500">
                                    ...
                                </span>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    type="button"
                    title={t("designSystem:designSystem.table.nextPage")}
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                            goToNextPage();
                        }
                    }}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg rtl:rotate-180 transition-colors ${
                        currentPage === totalPages
                            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    }`}
                >
                    <ChevronRight className="h-5 w-5 rtl:rotate-180" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
