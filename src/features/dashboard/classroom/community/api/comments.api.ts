/**
 * Comments API Functions
 *
 * Raw API functions for comments domain.
 */

import { api } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api";
import type {
    Comment,
    CommentCreatePayload,
    CommentUpdatePayload,
    ReactPayload,
    ReactResponse,
} from "./community.types";

const POSTS_BASE_URL = "/community/posts";
const COMMENTS_BASE_URL = "/community/comments";

export const commentsApi = {
    /**
     * Get comments for a post
     */
    getByPost: async (
        postId: number,
        signal?: AbortSignal
    ): Promise<Comment[]> => {
        const response = await api.get<ApiResponse<Comment[]>>(
            `${POSTS_BASE_URL}/${postId}/comments`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Create a comment on a post
     */
    create: async (
        postId: number,
        payload: CommentCreatePayload
    ): Promise<Comment> => {
        const response = await api.post<ApiResponse<Comment>>(
            `${POSTS_BASE_URL}/${postId}/comments`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update a comment
     */
    update: async (
        id: number,
        payload: CommentUpdatePayload
    ): Promise<Comment> => {
        const response = await api.patch<ApiResponse<Comment>>(
            `${COMMENTS_BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Delete a comment
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete(`${COMMENTS_BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * React to a comment
     */
    react: async (
        id: number,
        payload: ReactPayload
    ): Promise<ReactResponse> => {
        const response = await api.post<ApiResponse<ReactResponse>>(
            `${COMMENTS_BASE_URL}/${id}/react`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Mark comment as solution
     */
    markSolution: async (id: number): Promise<void> => {
        const response = await api.post(`${COMMENTS_BASE_URL}/${id}/solution`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Unmark comment as solution
     */
    unmarkSolution: async (id: number): Promise<void> => {
        const response = await api.delete(
            `${COMMENTS_BASE_URL}/${id}/solution`
        );

        if (response.error) {
            throw response.error;
        }
    },
};

export default commentsApi;
