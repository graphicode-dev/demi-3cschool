/**
 * Lesson Video Quiz Questions Feature - Query Hooks
 *
 * TanStack Query hooks for fetching lesson video quiz questions data.
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { lessonVideoQuizQuestionKeys } from "./lesson-video-quiz-questions.keys";
import { lessonVideoQuizQuestionsApi } from "./lesson-video-quiz-questions.api";
import {
    LessonVideoQuizQuestion,
    LessonVideoQuizQuestionsListParams,
    LessonVideoQuizQuestionsMetadata,
    LessonVideoQuizQuestionsPaginatedResponse,
} from "../../types";
import { PaginatedData } from "@/shared/api";

/**
 * Hook to fetch lesson video quiz questions metadata
 */
export function useLessonVideoQuizQuestionsMetadata(
    options?: Partial<UseQueryOptions<LessonVideoQuizQuestionsMetadata, Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizQuestionKeys.metadata(),
        queryFn: ({ signal }) =>
            lessonVideoQuizQuestionsApi.getMetadata(signal),
        staleTime: 1000 * 60 * 30, // 30 minutes - metadata rarely changes
        ...options,
    });
}

/**
 * Hook to fetch list of lesson video quiz questions (paginated)
 */
export function useLessonVideoQuizQuestionsList(
    params?: LessonVideoQuizQuestionsListParams,
    options?: Partial<
        UseQueryOptions<LessonVideoQuizQuestionsPaginatedResponse, Error>
    >
) {
    return useQuery({
        queryKey: lessonVideoQuizQuestionKeys.list(params),
        queryFn: ({ signal }) =>
            lessonVideoQuizQuestionsApi.getList(params, signal),
        ...options,
    });
}

/**
 * Hook to fetch paginated list of lesson video quiz questions by quiz ID
 */
export function useLessonVideoQuizQuestionsByQuiz(
    quizId: string | undefined | null,
    params?: LessonVideoQuizQuestionsListParams,
    options?: Partial<
        UseQueryOptions<PaginatedData<LessonVideoQuizQuestion>, Error>
    >
) {
    return useQuery({
        queryKey: [
            ...lessonVideoQuizQuestionKeys.all,
            "byQuiz",
            quizId,
            params,
        ] as const,
        queryFn: ({ signal }) =>
            lessonVideoQuizQuestionsApi.getListByQuizId(
                quizId!,
                params,
                signal
            ),
        enabled: !!quizId,
        ...options,
    });
}

/**
 * Hook to fetch a single lesson video quiz question by ID
 */
export function useLessonVideoQuizQuestion(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LessonVideoQuizQuestion, Error>>
) {
    return useQuery({
        queryKey: lessonVideoQuizQuestionKeys.detail(id ?? ""),
        queryFn: ({ signal }) =>
            lessonVideoQuizQuestionsApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
