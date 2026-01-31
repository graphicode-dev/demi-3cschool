import { GROUPS_BASE_PATH } from "@/features/dashboard/admin/groupsManagement/navigation/constant";

/**
 * Eligible Students paths
 */
export const eligibleStudents = {
    list: () => `${GROUPS_BASE_PATH}/eligible-students`,
};

export const eligibleStudentsPaths = {
    list: eligibleStudents.list,
};
