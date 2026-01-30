import { api } from "@/shared/api/client";
import {
    GroupStudent,
    AssignStudentPayload,
    UpdateStudentEnrollmentPayload,
    TransferStudentPayload,
    UpdateStudentEnrollmentResponse,
    TransferStudentResponse,
    DeleteStudentResponse,
} from "../../types/assignStudent.types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/groups";

export const assignStudentApi = {
    // GET /groups/:groupId/students - Get all students in a group
    getGroupStudents: async (
        groupId: number | string
    ): Promise<GroupStudent[]> => {
        const response = await api.get<ApiResponse<GroupStudent[]>>(
            `${BASE_URL}/${groupId}/students`,
            {
                meta: { auth: "required" },
            }
        );

        if (response.error) {
            throw response.error;
        }

        return response.data?.data || [];
    },

    // POST /groups/:groupId/students - Assign a student to a group
    assignStudent: async (
        groupId: number | string,
        payload: AssignStudentPayload
    ): Promise<GroupStudent> => {
        const response = await api.post<ApiResponse<GroupStudent>>(
            `${BASE_URL}/${groupId}/students`,
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

    // PATCH /groups/:groupId/students/:studentId - Update student enrollment
    updateStudentEnrollment: async (
        groupId: number | string,
        studentId: number | string,
        payload: UpdateStudentEnrollmentPayload
    ): Promise<GroupStudent> => {
        const response = await api.patch<
            ApiResponse<UpdateStudentEnrollmentResponse>
        >(`${BASE_URL}/${groupId}/students/${studentId}`, payload, {
            meta: { auth: "required" },
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data.data;
    },

    // POST /groups/:groupId/students/:studentId/transfer - Transfer student to another group
    transferStudent: async (
        groupId: number | string,
        studentId: number | string,
        payload: TransferStudentPayload
    ): Promise<GroupStudent> => {
        const response = await api.post<ApiResponse<TransferStudentResponse>>(
            `${BASE_URL}/${groupId}/students/${studentId}/transfer`,
            payload,
            {
                meta: { auth: "required" },
            }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data.data;
    },

    // DELETE /groups/:groupId/students/:studentId - Remove student from group
    removeStudent: async (
        groupId: number | string,
        studentId: number | string
    ): Promise<void> => {
        const response = await api.delete<ApiResponse<DeleteStudentResponse>>(
            `${BASE_URL}/${groupId}/students/${studentId}`,
            {
                meta: { auth: "required" },
            }
        );

        if (response.error) {
            throw response.error;
        }
    },
};

export default assignStudentApi;
