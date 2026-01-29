/**
 * toFormData Utility Tests
 */

import { describe, it, expect, vi } from "vitest";
import { toFormData, formDataFromRHF } from "./toFormData";

describe("toFormData", () => {
    describe("basic types", () => {
        it("should handle string values", () => {
            const result = toFormData({ title: "Hello World" });
            expect(result.get("title")).toBe("Hello World");
        });

        it("should handle number values", () => {
            const result = toFormData({ count: 42 });
            expect(result.get("count")).toBe("42");
        });

        it("should handle boolean values with numeric format (default)", () => {
            const result = toFormData({ isActive: true, isDeleted: false });
            expect(result.get("isActive")).toBe("1");
            expect(result.get("isDeleted")).toBe("0");
        });

        it("should handle boolean values with string format", () => {
            const result = toFormData(
                { isActive: true, isDeleted: false },
                { booleanFormat: "string" }
            );
            expect(result.get("isActive")).toBe("true");
            expect(result.get("isDeleted")).toBe("false");
        });

        it("should skip null/undefined by default", () => {
            const result = toFormData({ a: "value", b: null, c: undefined });
            expect(result.get("a")).toBe("value");
            expect(result.has("b")).toBe(false);
            expect(result.has("c")).toBe(false);
        });

        it("should include null/undefined when skipNull is false", () => {
            const result = toFormData(
                { a: "value", b: null },
                { skipNull: false }
            );
            expect(result.get("a")).toBe("value");
            expect(result.get("b")).toBe("");
        });
    });

    describe("arrays", () => {
        it("should handle arrays with brackets format (default)", () => {
            const result = toFormData({ tags: ["a", "b", "c"] });
            const values = result.getAll("tags[]");
            expect(values).toEqual(["a", "b", "c"]);
        });

        it("should handle arrays with indices format", () => {
            const result = toFormData(
                { tags: ["a", "b", "c"] },
                { arrayFormat: "indices" }
            );
            expect(result.get("tags[0]")).toBe("a");
            expect(result.get("tags[1]")).toBe("b");
            expect(result.get("tags[2]")).toBe("c");
        });

        it("should handle arrays with flat format", () => {
            const result = toFormData(
                { tags: ["a", "b", "c"] },
                { arrayFormat: "flat" }
            );
            const values = result.getAll("tags");
            expect(values).toEqual(["a", "b", "c"]);
        });

        it("should skip empty arrays by default", () => {
            const result = toFormData({ tags: [] });
            expect(result.has("tags[]")).toBe(false);
            expect(result.has("tags")).toBe(false);
        });

        it("should handle arrays of numbers", () => {
            const result = toFormData({ ids: [1, 2, 3] });
            const values = result.getAll("ids[]");
            expect(values).toEqual(["1", "2", "3"]);
        });
    });

    describe("nested objects", () => {
        it("should handle nested objects", () => {
            const result = toFormData({
                meta: { priority: 1, status: "active" },
            });
            expect(result.get("meta[priority]")).toBe("1");
            expect(result.get("meta[status]")).toBe("active");
        });

        it("should handle deeply nested objects", () => {
            const result = toFormData({
                config: {
                    display: {
                        theme: "dark",
                        fontSize: 14,
                    },
                },
            });
            expect(result.get("config[display][theme]")).toBe("dark");
            expect(result.get("config[display][fontSize]")).toBe("14");
        });

        it("should handle nested arrays", () => {
            const result = toFormData({
                meta: { tags: ["urgent", "review"] },
            });
            const values = result.getAll("meta[tags][]");
            expect(values).toEqual(["urgent", "review"]);
        });
    });

    describe("files and blobs", () => {
        it("should handle File objects", () => {
            const file = new File(["content"], "test.txt", {
                type: "text/plain",
            });
            const result = toFormData({ document: file });
            expect(result.get("document")).toBe(file);
        });

        it("should handle arrays of Files", () => {
            const file1 = new File(["content1"], "test1.txt");
            const file2 = new File(["content2"], "test2.txt");
            const result = toFormData({ attachments: [file1, file2] });
            const files = result.getAll("attachments[]");
            expect(files).toHaveLength(2);
            expect(files[0]).toBe(file1);
            expect(files[1]).toBe(file2);
        });

        it("should handle Blob objects", () => {
            const blob = new Blob(["content"], { type: "text/plain" });
            const result = toFormData({ data: blob });
            expect(result.get("data")).toBe(blob);
        });
    });

    describe("dates", () => {
        it("should handle Date with ISO format (default)", () => {
            const date = new Date("2024-06-15T10:30:00.000Z");
            const result = toFormData({ createdAt: date });
            expect(result.get("createdAt")).toBe("2024-06-15T10:30:00.000Z");
        });

        it("should handle Date with timestamp format", () => {
            const date = new Date("2024-06-15T10:30:00.000Z");
            const result = toFormData(
                { createdAt: date },
                { dateFormat: "timestamp" }
            );
            expect(result.get("createdAt")).toBe(String(date.getTime()));
        });

        it("should handle Date with date-only format", () => {
            const date = new Date("2024-06-15T10:30:00.000Z");
            const result = toFormData(
                { createdAt: date },
                { dateFormat: "date" }
            );
            expect(result.get("createdAt")).toBe("2024-06-15");
        });
    });

    describe("complex example", () => {
        it("should handle the documented example correctly", () => {
            const file1 = new File(["content1"], "file1.pdf");
            const file2 = new File(["content2"], "file2.pdf");

            const result = toFormData({
                title: "My Report",
                attachments: [file1, file2],
                meta: {
                    tags: ["urgent", "review"],
                    priority: 1,
                },
                isActive: true,
            });

            expect(result.get("title")).toBe("My Report");
            expect(result.getAll("attachments[]")).toEqual([file1, file2]);
            expect(result.getAll("meta[tags][]")).toEqual(["urgent", "review"]);
            expect(result.get("meta[priority]")).toBe("1");
            expect(result.get("isActive")).toBe("1");
        });
    });

    describe("circular reference protection", () => {
        it("should handle circular references gracefully", () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});

            const obj: Record<string, unknown> = { name: "test" };
            obj.self = obj; // Create circular reference

            const result = toFormData(obj as Record<string, any>);

            expect(result.get("name")).toBe("test");
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Circular reference detected")
            );

            consoleSpy.mockRestore();
        });
    });

    describe("formDataFromRHF", () => {
        it("should work as a type-safe wrapper", () => {
            const data = { title: "Test", count: 5 };
            const result = formDataFromRHF(data);

            expect(result.get("title")).toBe("Test");
            expect(result.get("count")).toBe("5");
        });
    });

    describe("edge cases", () => {
        it("should skip NaN values with warning", () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});

            const result = toFormData({ value: NaN });

            expect(result.has("value")).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Invalid number value")
            );

            consoleSpy.mockRestore();
        });

        it("should skip Infinity values with warning", () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});

            const result = toFormData({ value: Infinity });

            expect(result.has("value")).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Invalid number value")
            );

            consoleSpy.mockRestore();
        });

        it("should skip invalid Date values with warning", () => {
            const consoleSpy = vi
                .spyOn(console, "warn")
                .mockImplementation(() => {});

            const result = toFormData({ date: new Date("invalid") });

            expect(result.has("date")).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining("Invalid Date value")
            );

            consoleSpy.mockRestore();
        });

        it("should handle valid numbers correctly", () => {
            const result = toFormData({
                zero: 0,
                negative: -42,
                float: 3.14,
            });

            expect(result.get("zero")).toBe("0");
            expect(result.get("negative")).toBe("-42");
            expect(result.get("float")).toBe("3.14");
        });
    });
});
