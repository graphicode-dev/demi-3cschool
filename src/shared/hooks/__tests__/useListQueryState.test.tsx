/**
 * useListQueryState Hook Tests
 *
 * Tests for URL-synced list state management.
 */

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useListQueryState } from "../useListQueryState";
import type { ReactNode } from "react";

// ============================================================================
// Test Wrapper
// ============================================================================

function createWrapper(initialEntries: string[] = ["/"]) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <MemoryRouter initialEntries={initialEntries}>
                {children}
            </MemoryRouter>
        );
    };
}

// ============================================================================
// Params Serialization Tests
// ============================================================================

describe("useListQueryState", () => {
    describe("initial state", () => {
        it("should return default values when URL has no params", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(),
            });

            expect(result.current.page).toBe(1);
            expect(result.current.pageSize).toBe(10);
            expect(result.current.search).toBe("");
            expect(result.current.sort).toBeNull();
            expect(result.current.filters).toEqual({});
            expect(result.current.isFiltered).toBe(false);
        });

        it("should use custom default values", () => {
            const { result } = renderHook(
                () =>
                    useListQueryState({
                        defaultPageSize: 25,
                        defaultSort: { field: "createdAt", order: "desc" },
                    }),
                { wrapper: createWrapper() }
            );

            expect(result.current.pageSize).toBe(25);
            expect(result.current.sort).toEqual({
                field: "createdAt",
                order: "desc",
            });
        });
    });

    describe("URL parsing", () => {
        it("should parse page from URL", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?page=5"]),
            });

            expect(result.current.page).toBe(5);
        });

        it("should parse pageSize from URL", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?pageSize=25"]),
            });

            expect(result.current.pageSize).toBe(25);
        });

        it("should parse search from URL", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?search=react"]),
            });

            expect(result.current.search).toBe("react");
        });

        it("should parse sort from URL", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?sort=title:asc"]),
            });

            expect(result.current.sort).toEqual({
                field: "title",
                order: "asc",
            });
        });

        it("should parse filters from URL", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper([
                    "/?filter[status]=active&filter[category]=tech",
                ]),
            });

            expect(result.current.filters).toEqual({
                status: "active",
                category: "tech",
            });
        });

        it("should parse array filters from URL", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper([
                    "/?filter[tags]=react,typescript,vitest",
                ]),
            });

            expect(result.current.filters).toEqual({
                tags: ["react", "typescript", "vitest"],
            });
        });

        it("should handle invalid page param gracefully", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?page=invalid"]),
            });

            expect(result.current.page).toBe(1);
        });

        it("should handle negative page param gracefully", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?page=-5"]),
            });

            expect(result.current.page).toBe(1);
        });
    });

    describe("setters", () => {
        it("should update page", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.setPage(3);
            });

            expect(result.current.page).toBe(3);
        });

        it("should update search and reset page", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?page=5"]),
            });

            act(() => {
                result.current.setSearch("typescript");
            });

            expect(result.current.search).toBe("typescript");
            expect(result.current.page).toBe(1);
        });

        it("should update filter and reset page", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?page=5"]),
            });

            act(() => {
                result.current.setFilter("status", "active");
            });

            expect(result.current.filters.status).toBe("active");
            expect(result.current.page).toBe(1);
        });

        it("should toggle sort order", () => {
            const { result } = renderHook(
                () =>
                    useListQueryState({
                        defaultSort: { field: "title", order: "asc" },
                    }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.toggleSort("title");
            });

            expect(result.current.sort).toEqual({
                field: "title",
                order: "desc",
            });

            act(() => {
                result.current.toggleSort("title");
            });

            expect(result.current.sort).toEqual({
                field: "title",
                order: "asc",
            });
        });

        it("should reset filters", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper([
                    "/?filter[status]=active&filter[category]=tech",
                ]),
            });

            act(() => {
                result.current.resetFilters();
            });

            expect(result.current.filters).toEqual({});
        });
    });

    describe("queryParams", () => {
        it("should build queryParams object for API", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper([
                    "/?page=2&pageSize=25&search=react&sort=title:desc&filter[status]=active",
                ]),
            });

            expect(result.current.queryParams).toEqual({
                page: 2,
                pageSize: 25,
                search: "react",
                sortBy: "title",
                sortOrder: "desc",
                status: "active",
            });
        });
    });

    describe("isFiltered", () => {
        it("should be true when search is active", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?search=react"]),
            });

            expect(result.current.isFiltered).toBe(true);
        });

        it("should be true when filters are active", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?filter[status]=active"]),
            });

            expect(result.current.isFiltered).toBe(true);
        });

        it("should be false when no search or filters", () => {
            const { result } = renderHook(() => useListQueryState(), {
                wrapper: createWrapper(["/?page=2"]),
            });

            expect(result.current.isFiltered).toBe(false);
        });
    });

    describe("paramPrefix", () => {
        it("should namespace params with prefix", () => {
            const { result } = renderHook(
                () => useListQueryState({ paramPrefix: "courses" }),
                {
                    wrapper: createWrapper([
                        "/?courses_page=3&courses_search=react",
                    ]),
                }
            );

            expect(result.current.page).toBe(3);
            expect(result.current.search).toBe("react");
        });
    });
});
