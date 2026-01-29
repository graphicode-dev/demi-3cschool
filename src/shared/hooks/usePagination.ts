import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
    useEffect,
    type Dispatch,
    type SetStateAction,
    useCallback,
} from "react";

type PageSetter = Dispatch<SetStateAction<number>> | ((page: number) => void);

export const usePagination = (
    currentPage: number = 1,
    setCurrentPage: PageSetter,
    totalPages: number = 1
) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Sync currentPage with URL when URL changes (only one direction)
    useEffect(() => {
        const pageFromURL = Number(searchParams.get("page")) || 1;

        // Only update state if URL page is different from current page
        if (pageFromURL !== currentPage) {
            setCurrentPage(pageFromURL);
        }
    }, [searchParams, setCurrentPage]); // Remove currentPage from deps to prevent circular updates

    // Update URL when page changes programmatically
    const updateURL = useCallback(
        (page: number) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", page.toString());

            navigate(`${location.pathname}?${newParams.toString()}`, {
                replace: true,
            });
        },
        [navigate, location.pathname, searchParams]
    );

    const goToNextPage = useCallback(() => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            updateURL(nextPage);
        }
    }, [currentPage, totalPages, setCurrentPage, updateURL]);

    const goToPreviousPage = useCallback(() => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            updateURL(prevPage);
        }
    }, [currentPage, setCurrentPage, updateURL]);

    const setPage = useCallback(
        (page: number) => {
            if (page > 0 && page <= totalPages && page !== currentPage) {
                setCurrentPage(page);
                updateURL(page);
            }
        },
        [totalPages, setCurrentPage, currentPage, updateURL]
    );

    return {
        currentPage,
        totalPages,
        goToNextPage,
        goToPreviousPage,
        setPage,
    };
};
