import { api } from "@/shared/api/client";
import { ApiResponse, ListQueryParams } from "@/shared/api";
import type {
    Student,
    CreateStudentPayload,
    UpdateStudentPayload,
    StudentUserInformationPayload,
} from "./types";

// ============================================================================
// Students API
// ============================================================================

const STUDENTS_BASE_URL = "/system-managements/students";

/**
 * Convert a student payload to FormData (API expects multipart/form-data)
 */
function toFormData(
    payload: CreateStudentPayload | UpdateStudentPayload
): FormData {
    const fd = new FormData();

    if (payload.name !== undefined) fd.append("name", payload.name);
    if (payload.email !== undefined) fd.append("email", payload.email);
    if ("password" in payload && payload.password !== undefined)
        fd.append("password", payload.password);

    if (payload.user_information) {
        const info = payload.user_information as StudentUserInformationPayload;
        if (info.governorate_id !== undefined)
            fd.append(
                "user_information[governorate_id]",
                String(info.governorate_id)
            );
        if (info.phone_code !== undefined)
            fd.append("user_information[phone_code]", info.phone_code);
        if (info.phone_number !== undefined)
            fd.append("user_information[phone_number]", info.phone_number);
        if (info.date_of_birth !== undefined)
            fd.append("user_information[date_of_birth]", info.date_of_birth);
        if (info.grade_id !== undefined)
            fd.append("user_information[grade_id]", String(info.grade_id));
        if (info.gender !== undefined)
            fd.append("user_information[gender]", info.gender);
    }

    return fd;
}

export const studentsApi = {
    /**
     * Get list of all students
     */
    getList: async (
        params?: ListQueryParams,
        signal?: AbortSignal
    ): Promise<Student[]> => {
        const response = await api.get<ApiResponse<Student[]>>(
            STUDENTS_BASE_URL,
            { signal, params }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Get a single student by ID
     */
    getById: async (id: number, signal?: AbortSignal): Promise<Student> => {
        const response = await api.get<ApiResponse<Student>>(
            `${STUDENTS_BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Create a new student (FormData)
     */
    create: async (payload: CreateStudentPayload): Promise<Student> => {
        const response = await api.post<ApiResponse<Student>>(
            STUDENTS_BASE_URL,
            toFormData(payload)
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Update an existing student (FormData)
     */
    update: async (
        id: number,
        payload: UpdateStudentPayload
    ): Promise<Student> => {
        const response = await api.patch<ApiResponse<Student>>(
            `${STUDENTS_BASE_URL}/${id}`,
            toFormData(payload)
        );

        if (response.error) {
            throw response.error;
        }

        return response.data.data;
    },

    /**
     * Delete a student
     */
    delete: async (id: number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${STUDENTS_BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
