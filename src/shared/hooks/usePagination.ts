import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

/**
 * Ultra-simple usePagination hook
 *
 * The parent manages the currentPage state
 * This hook provides URL update functions
 *
 * Usage in DynamicTable:
 * const currentPage = Number(searchParams.get("page")) || 1;
 * const { updatePageInURL, goToNextPage, goToPreviousPage, setPageInURL } = useSimplePagination(currentPage, lastPage);
 */
export const useSimplePagination = (
    currentPage: number,
    totalPages: number
) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const updatePageInURL = useCallback(
        (page: number) => {
            setSearchParams({ page: page.toString() });
        },
        [setSearchParams]
    );

    const goToNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            updatePageInURL(currentPage + 1);
        }
    }, [currentPage, totalPages, updatePageInURL]);

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 1) {
            updatePageInURL(currentPage - 1);
        }
    }, [currentPage, updatePageInURL]);

    const setPageInURL = useCallback(
        (page: number) => {
            if (page > 0 && page <= totalPages && page !== currentPage) {
                updatePageInURL(page);
            }
        },
        [totalPages, currentPage, updatePageInURL]
    );

    return {
        goToNextPage,
        goToPreviousPage,
        setPageInURL,
    };
};
