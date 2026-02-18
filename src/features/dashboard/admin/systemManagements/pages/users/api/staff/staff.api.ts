import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams } from "@/shared/api";
import type {
    Staff,
    StaffMetadata,
    CreateStaffPayload,
    UpdateStaffPayload,
} from "./types";

// ============================================================================
// Staff API
// ============================================================================

const STAFF_BASE_URL = "/system-managements/staffs";

export const staffApi = {
    /**
     * Get list of all staff
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<Staff[]> => {
        const response = await api.get<ApiResponse<Staff[]>>(
            STAFF_BASE_URL,
            { signal, params }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get a single staff member by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Staff> => {
        const response = await api.get<ApiResponse<Staff>>(
            `${STAFF_BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get staff metadata (filters, operators, field types)
     */
    getMetadata: async (signal?: AbortSignal): Promise<StaffMetadata> => {
        const response = await api.get<ApiResponse<StaffMetadata>>(
            `${STAFF_BASE_URL}/metadata`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Create a new staff member
     */
    create: async (payload: CreateStaffPayload): Promise<Staff> => {
        const response = await api.post<ApiResponse<Staff>>(
            STAFF_BASE_URL,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Update an existing staff member
     */
    update: async (id: number, payload: UpdateStaffPayload): Promise<Staff> => {
        const response = await api.patch<ApiResponse<Staff>>(
            `${STAFF_BASE_URL}/${id}`,
            payload
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Delete a staff member
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${STAFF_BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
