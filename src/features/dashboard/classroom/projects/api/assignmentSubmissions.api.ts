import { api } from "@/shared/api/client";
import { ApiResponse } from "@/shared/api";
import type {
    AssignmentGroup,
    AssignmentSubmissionResponse,
    ReviewAssignmentPayload,
} from "./assignmentSubmissions.types";

// ============================================
// Assignment Submissions API
// ============================================
export const assignmentSubmissionsApi = {
    /**
     * Get assignment groups (optionally filtered by lesson)
     * GET /assignment-submissions/groups/:lessonId
     */
    getAssignmentGroups: async (
        lessonId?: number | string,
        signal?: AbortSignal
    ): Promise<AssignmentGroup[]> => {
        const url = lessonId
            ? `/assignment-submissions/groups/${lessonId}`
            : `/assignment-submissions/groups`;
        const response = await api.get<ApiResponse<AssignmentGroup[]>>(url, {
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        return response.data?.data ?? [];
    },

    /**
     * Submit an assignment
     * POST /assignment-submissions/:assignmentId/submit
     */
    submitAssignment: async (
        assignmentId: number | string,
        payload: { student_notes: string; files: File[] }
    ): Promise<AssignmentSubmissionResponse> => {
        const formData = new FormData();
        formData.append("student_notes", payload.student_notes);
        payload.files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        const response = await api.post<
            ApiResponse<AssignmentSubmissionResponse>
        >(`/assignment-submissions/${assignmentId}/submit`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },

    /**
     * Review an assignment submission
     * POST /assignment-submissions/:assignmentId/review
     */
    reviewAssignment: async (
        assignmentId: number | string,
        payload: ReviewAssignmentPayload
    ): Promise<AssignmentSubmissionResponse> => {
        const response = await api.post<
            ApiResponse<AssignmentSubmissionResponse>
        >(`/assignment-submissions/${assignmentId}/review`, payload);

        if (response.error) {
            throw response.error;
        }

        return response.data!.data;
    },
};
