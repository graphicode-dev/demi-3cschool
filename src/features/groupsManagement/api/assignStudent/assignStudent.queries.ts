import { useQuery } from "@tanstack/react-query";
import { assignStudentApi } from "./assignStudent.api";
import { assignStudentKeys } from "./assignStudent.keys";

// Queries
export const useGetGroupStudentsQuery = (groupId: number | string) => {
    return useQuery({
        queryKey: assignStudentKeys.groupStudentsById(groupId),
        queryFn: () => assignStudentApi.getGroupStudents(groupId),
        enabled: !!groupId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useGetGroupStudentsWithSearchQuery = (
    groupId: number | string,
    options?: {
        search?: string;
        status?: "active" | "inactive" | "transferred" | "completed";
        sortBy?: "name" | "enrolledAt" | "status";
        sortOrder?: "asc" | "desc";
    }
) => {
    return useQuery({
        queryKey: [
            ...assignStudentKeys.groupStudentsById(groupId),
            "search",
            options?.search,
            options?.status,
            options?.sortBy,
            options?.sortOrder,
        ],
        queryFn: async () => {
            const students = await assignStudentApi.getGroupStudents(groupId);

            let filteredStudents = students;

            // Apply search filter
            if (options?.search) {
                const searchTerm = options.search.toLowerCase();
                filteredStudents = filteredStudents.filter(
                    (student) =>
                        student.student.name
                            .toLowerCase()
                            .includes(searchTerm) ||
                        student.note?.toLowerCase().includes(searchTerm)
                );
            }

            // Apply status filter
            if (options?.status) {
                filteredStudents = filteredStudents.filter(
                    (student) => student.status === options.status
                );
            }

            // Apply sorting
            if (options?.sortBy) {
                filteredStudents.sort((a, b) => {
                    let aValue: string | number;
                    let bValue: string | number;

                    switch (options.sortBy) {
                        case "name":
                            aValue = a.student.name;
                            bValue = b.student.name;
                            break;
                        case "enrolledAt":
                            aValue = new Date(a.enrolledAt).getTime();
                            bValue = new Date(b.enrolledAt).getTime();
                            break;
                        case "status":
                            aValue = a.status;
                            bValue = b.status;
                            break;
                        default:
                            aValue = a.student.name;
                            bValue = b.student.name;
                    }

                    if (options.sortOrder === "desc") {
                        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                    }
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                });
            }

            return filteredStudents;
        },
        enabled: !!groupId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useGetStudentDetailQuery = (
    groupId: number | string,
    studentId: number | string
) => {
    return useQuery({
        queryKey: assignStudentKeys.studentDetailById(studentId),
        queryFn: async () => {
            const students = await assignStudentApi.getGroupStudents(groupId);
            const student = students.find(
                (s) => s.student.id.toString() === studentId.toString()
            );

            if (!student) {
                throw new Error(
                    `Student with ID ${studentId} not found in group ${groupId}`
                );
            }

            return student;
        },
        enabled: !!groupId && !!studentId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
};

export const useGetAvailableStudentsQuery = (groupId: number | string) => {
    return useQuery({
        queryKey: [...assignStudentKeys.all, "available-students", groupId],
        queryFn: () => {
            // This would be a new API endpoint like:
            // return assignStudentApi.getAvailableStudents(groupId);
            // For now, return empty array as placeholder
            return Promise.resolve([]);
        },
        enabled: !!groupId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        placeholderData: [],
    });
};

export const useGetStudentStatisticsQuery = (groupId: number | string) => {
    return useQuery({
        queryKey: [
            ...assignStudentKeys.groupStudentsById(groupId),
            "statistics",
        ],
        queryFn: async () => {
            const students = await assignStudentApi.getGroupStudents(groupId);

            const statistics = {
                total: students.length,
                active: students.filter((s) => s.status === "active").length,
                inactive: students.filter((s) => s.status === "inactive")
                    .length,
                transferred: students.filter((s) => s.status === "transferred")
                    .length,
                completed: students.filter((s) => s.status === "completed")
                    .length,
                recentEnrollments: students.filter((s) => {
                    const enrolledDate = new Date(s.enrolledAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return enrolledDate > weekAgo;
                }).length,
            };

            return statistics;
        },
        enabled: !!groupId,
        staleTime: 2 * 60 * 1000, // 2 minutes for statistics
        gcTime: 5 * 60 * 1000,
    });
};
