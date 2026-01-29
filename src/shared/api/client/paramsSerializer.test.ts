/**
 * Params Serializer Tests
 *
 * Tests for the advanced params serializer.
 */

import { describe, it, expect } from "vitest";
import { serializeParams } from "./paramsSerializer";

describe("serializeParams", () => {
    it("should return empty string for undefined params", () => {
        expect(serializeParams(undefined)).toBe("");
    });

    it("should return empty string for empty object", () => {
        expect(serializeParams({})).toBe("");
    });

    it("should serialize simple key-value pairs", () => {
        const result = serializeParams({ page: 1, search: "test" });
        expect(result).toBe("page=1&search=test");
    });

    it("should encode special characters", () => {
        const result = serializeParams({ search: "hello world" });
        expect(result).toBe("search=hello%20world");
    });

    it("should skip null and undefined values by default", () => {
        const result = serializeParams({
            page: 1,
            search: null,
            filter: undefined,
        });
        expect(result).toBe("page=1");
    });

    it("should skip empty strings by default", () => {
        const result = serializeParams({ page: 1, search: "" });
        expect(result).toBe("page=1");
    });

    it("should serialize arrays with brackets format", () => {
        const result = serializeParams({ ids: [1, 2, 3] });
        expect(result).toBe("ids[]=1&ids[]=2&ids[]=3");
    });

    it("should serialize arrays with indices format", () => {
        const result = serializeParams(
            { ids: [1, 2, 3] },
            { arrayFormat: "indices" }
        );
        expect(result).toBe("ids[0]=1&ids[1]=2&ids[2]=3");
    });

    it("should serialize arrays with repeat format", () => {
        const result = serializeParams(
            { ids: [1, 2, 3] },
            { arrayFormat: "repeat" }
        );
        expect(result).toBe("ids=1&ids=2&ids=3");
    });

    it("should serialize nested objects", () => {
        const result = serializeParams({
            filters: { status: "active", type: "user" },
        });
        expect(result).toBe("filters[status]=active&filters[type]=user");
    });

    it("should serialize deeply nested objects", () => {
        const result = serializeParams({
            filters: {
                date: { from: "2024-01-01", to: "2024-12-31" },
            },
        });
        expect(result).toBe(
            "filters[date][from]=2024-01-01&filters[date][to]=2024-12-31"
        );
    });

    it("should serialize nested arrays", () => {
        const result = serializeParams({
            filters: { types: ["a", "b", "c"] },
        });
        expect(result).toBe(
            "filters[types][]=a&filters[types][]=b&filters[types][]=c"
        );
    });

    it("should handle boolean values", () => {
        const result = serializeParams({ active: true, deleted: false });
        expect(result).toBe("active=true&deleted=false");
    });

    it("should handle complex query params", () => {
        const result = serializeParams({
            page: 1,
            perPage: 10,
            search: "test",
            filters: {
                status: "active",
                types: ["a", "b"],
                date: { from: "2024-01-01", to: "2024-12-31" },
            },
            sort: { field: "name", order: "asc" },
        });

        expect(result).toContain("page=1");
        expect(result).toContain("perPage=10");
        expect(result).toContain("search=test");
        expect(result).toContain("filters[status]=active");
        expect(result).toContain("filters[types][]=a");
        expect(result).toContain("filters[types][]=b");
        expect(result).toContain("filters[date][from]=2024-01-01");
        expect(result).toContain("filters[date][to]=2024-12-31");
        expect(result).toContain("sort[field]=name");
        expect(result).toContain("sort[order]=asc");
    });
});
