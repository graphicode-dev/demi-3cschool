/**
 * Channels API Functions
 *
 * Raw API functions for channels domain.
 */

import { api } from "@/shared/api/client";
import type { ApiResponse, PaginatedData } from "@/shared/api";
import type {
    Channel,
    ChannelsListParams,
    ChannelCreatePayload,
    ChannelUpdatePayload,
    AddAdminPayload,
} from "./community.types";

const BASE_URL = "/community/channels";

export const channelsApi = {
    /**
     * Get list of channels (paginated)
     */
    getList: async (
        params?: ChannelsListParams,
        signal?: AbortSignal
    ): Promise<PaginatedData<Channel>> => {
        const response = await api.get<ApiResponse<PaginatedData<Channel>>>(
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
     * Get my followed channels
     */
    getMyChannels: async (signal?: AbortSignal): Promise<Channel[]> => {
        const response = await api.get<ApiResponse<Channel[]>>(
            `${BASE_URL}/my-channels`,
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
     * Get channel by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Channel> => {
        const response = await api.get<ApiResponse<Channel>>(
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
     * Create a new channel
     */
    create: async (payload: ChannelCreatePayload): Promise<Channel> => {
        const response = await api.post<ApiResponse<Channel>>(
            BASE_URL,
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
     * Update a channel
     */
    update: async (
        id: number,
        payload: ChannelUpdatePayload
    ): Promise<Channel> => {
        const response = await api.patch<ApiResponse<Channel>>(
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
     * Delete a channel
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Follow a channel
     */
    follow: async (id: number): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/follow`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Unfollow a channel
     */
    unfollow: async (id: number): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/unfollow`);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Add admin to channel
     */
    addAdmin: async (id: number, payload: AddAdminPayload): Promise<void> => {
        const response = await api.post(`${BASE_URL}/${id}/admins`, payload);

        if (response.error) {
            throw response.error;
        }
    },

    /**
     * Remove admin from channel
     */
    removeAdmin: async (
        id: number,
        payload: AddAdminPayload
    ): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}/admins`, {
            data: payload,
        });

        if (response.error) {
            throw response.error;
        }
    },
};

export default channelsApi;
