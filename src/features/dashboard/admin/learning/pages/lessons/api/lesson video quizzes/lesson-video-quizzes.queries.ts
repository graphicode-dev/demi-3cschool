/**
 * Lesson Video Quizzes Feature - Query Hooks
 *
 * TanStack Query hooks for fetching lesson video quizzes data.
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { lessonVideoQuizKeys } from "./lesson-video-quizzes.keys";
import { lessonVideoQuizzesApi } from "./lesson-video-quizzes.api";
import {
    LessonVideoQuiz,
    LessonVideoQuizzesListParams,
    LessonVideoQuizzesMetadata,
    LessonVideoQuizzesPaginatedResponse,
} from "../../types";
import { PaginatedData } from "@/shared/api";

/**
 * Hook to fetch lesson video quizzes metadata
 */
export function useLessonVideoQuizzesMetadata(
    options?: Partial<UseQueryOptions<LessonVideoQuizzesMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizKeys.metadata(),
        queryFn: ({ signal }) => lessonVideoQuizzesApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

/**
 * Hook to fetch list of lesson video quizzes (paginated)
 */
export function useLessonVideoQuizzesList(
    params?: LessonVideoQuizzesListParams,
    options?: Partial<
        UseQueryOptions<LessonVideoQuizzesPaginatedResponse, Error>
    >
) {
    return useQuery({
        queryKey: lessonVideoQuizKeys.list(params),
        queryFn: ({ signal }) => lessonVideoQuizzesApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of lesson video quizzes by video ID
 */
export function useLessonVideoQuizzesByVideo(
    videoId: string | undefined | null,
    params?: LessonVideoQuizzesListParams,
    options?: Partial<UseQueryOptions<PaginatedData<LessonVideoQuiz>, Error>>
) {
    return useQuery({
        queryKey: [
            ...lessonVideoQuizKeys.all,
            "byVideo",
            videoId,
            params,
        ] as const,
        queryFn: ({ signal }) =>
            lessonVideoQuizzesApi.getListByVideoId(videoId!, params, signal),
        enabled: !!videoId,
        ...options,
    });
}

/**
 * Hook to fetch a single lesson video quiz by ID
 */
export function useLessonVideoQuiz(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonVideoQuiz, Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizKeys.detail(id ?? ""),
        queryFn: ({ signal }) => lessonVideoQuizzesApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
