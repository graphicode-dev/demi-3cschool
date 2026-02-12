const ADMIN_BASE_PATH = "/admin";

export const studentsPaths = {
    list: `${ADMIN_BASE_PATH}/userManagement/students`,
    create: `${ADMIN_BASE_PATH}/userManagement/students/create`,
    view: (id: string | number) =>
        `${ADMIN_BASE_PATH}/userManagement/students/view/${id}`,
    edit: (id: string | number) =>
        `${ADMIN_BASE_PATH}/userManagement/students/edit/${id}`,
} as const;
