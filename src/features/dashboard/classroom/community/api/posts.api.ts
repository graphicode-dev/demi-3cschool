/**
 * Posts API Functions
 *
 * Raw API functions for posts domain.
 */

import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    Post,
    PostDetail,
    PostsListParams,
    PostCreatePayload,
    PostUpdatePayload,
    ReactPayload,
    ReactResponse,
    PollVotePayload,
} from "./community.types";

const BASE_URL = "/community/posts";

export const postsApi = {
    /**
     * Get feed (list of posts)
     */
    getList: async (
        params?: PostsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Post>> => {
        const response = await api.get<ApiResponse<PaginatedData<Post>>>(
            BASE_URL,
            {
                params: params as Record<string, unknown>,
                signal,
            }
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
     * Get saved posts
     */
    getSaved: async (signal?: AbortSignal): Promise<PaginatedData<Post>> => {
        const response = await api.get<ApiResponse<PaginatedData<Post>>>(
            `${BASE_URL}/saved`,
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
     * Get my posts
     */
    getMyPosts: async (signal?: AbortSignal): Promise<PaginatedData<Post>> => {
        const response = await api.get<ApiResponse<PaginatedData<Post>>>(
            `${BASE_URL}/my-posts`,
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
     * Get post by ID (includes comments)
     */
    getById: async (id: number, signal?: AbortSignal): Promise<PostDetail> => {
        const response = await api.get<ApiResponse<PostDetail>>(
            `${BASE_URL}/${id}`,
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
     * Create a new post
     */
    create: async (payload: PostCreatePayload): Promise<Post> => {
        const response = await api.post<ApiResponse<Post>>(BASE_URL, payload);

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update a post
     */
    update: async (id: number, payload: PostUpdatePayload): Promise<Post> => {
        const response = await api.patch<ApiResponse<Post>>(
            `${BASE_URL}/${id}`,
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
     * Delete a post
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * React to a post
     */
    react: async (
        id: number,
        payload: ReactPayload
    ): Promise<ReactResponse> => {
        const response = await api.post<ApiResponse<ReactResponse>>(
            `${BASE_URL}/${id}/react`,
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
     * Save a post
     */
    save: async (id: number): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/save`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Unsave a post
     */
    unsave: async (id: number): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/unsave`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Pin a post (Admin)
     */
    pin: async (id: number): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/pin`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Unpin a post (Admin)
     */
    unpin: async (id: number): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/unpin`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Vote on a poll
     */
    vote: async (id: number, payload: PollVotePayload): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/vote`, payload);

        if (response.error) {
            throw response.error;
        }
    },
};

export default postsApi;
