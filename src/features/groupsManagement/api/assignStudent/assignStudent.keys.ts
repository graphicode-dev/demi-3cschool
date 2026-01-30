/**
 * Assign Student Management Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all student assignment data
 * queryClient.invalidateQueries({ queryKey: assignStudentKeys.all });
 *
 * // Invalidate group students for a specific group
 * queryClient.invalidateQueries({ queryKey: assignStudentKeys.groupStudents(groupId) });
 * ```
 */

/**
 * Query key factory for student assignment
 *
 * Hierarchy:
 * - all: ['assign-student']
 * - groupStudents: ['assign-student', 'group-students']
 * - groupStudents(groupId): ['assign-student', 'group-students', groupId]
 * - studentDetail: ['assign-student', 'student-detail']
 * - studentDetail(studentId): ['assign-student', 'student-detail', studentId]
 */
export const assignStudentKeys = {
    /**
     * Root key for all assign-student queries
     */
    all: ["assign-student"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...assignStudentKeys.all, "list"] as const,

    /**
     * Key for group students queries
     */
    groupStudents: () => [...assignStudentKeys.all, "group-students"] as const,

    /**
     * Key for specific group students
     */
    groupStudentsById: (groupId: number | string) =>
        [...assignStudentKeys.groupStudents(), groupId] as const,

    /**
     * Key for student detail queries
     */
    studentDetail: () => [...assignStudentKeys.all, "student-detail"] as const,

    /**
     * Key for specific student detail
     */
    studentDetailById: (studentId: number | string) =>
        [...assignStudentKeys.studentDetail(), studentId] as const,
};

/**
 * Type for assign-student query keys
 */
export type AssignStudentQueryKey =
    | typeof assignStudentKeys.all
    | ReturnType<typeof assignStudentKeys.groupStudents>
    | ReturnType<typeof assignStudentKeys.groupStudentsById>
    | ReturnType<typeof assignStudentKeys.studentDetail>
    | ReturnType<typeof assignStudentKeys.studentDetailById>;
