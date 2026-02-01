/**
 * Lesson Video Quiz Options Feature - Query Hooks
 *
 * TanStack Query hooks for fetching lesson video quiz options data.
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { lessonVideoQuizOptionKeys } from "./lesson-video-quiz-options.keys";
import { lessonVideoQuizOptionsApi } from "./lesson-video-quiz-options.api";
import {
    LessonVideoQuizOption,
    LessonVideoQuizOptionsListParams,
    LessonVideoQuizOptionsMetadata,
} from "../../types";

/**
 * Hook to fetch lesson video quiz options metadata
 */
export function useLessonVideoQuizOptionsMetadata(
    options?: Partial<UseQueryOptions<LessonVideoQuizOptionsMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizOptionKeys.metadata(),
        queryFn: ({ signal }) => lessonVideoQuizOptionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

/**
 * Hook to fetch list of lesson video quiz options
 */
export function useLessonVideoQuizOptionsList(
    params?: LessonVideoQuizOptionsListParams,
    options?: Partial<UseQueryOptions<LessonVideoQuizOption[], Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizOptionKeys.list(params),
        queryFn: ({ signal }) =>
            lessonVideoQuizOptionsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch a single lesson video quiz option by ID
 */
export function useLessonVideoQuizOption(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonVideoQuizOption, Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizOptionKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonVideoQuizOptionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
