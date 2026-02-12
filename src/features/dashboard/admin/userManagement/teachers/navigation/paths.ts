const ADMIN_BASE_PATH = "/admin";

export const teachersPaths = {
    list: `${ADMIN_BASE_PATH}/userManagement/teachers`,
    create: `${ADMIN_BASE_PATH}/userManagement/teachers/create`,
    view: (id: string | number) => `${ADMIN_BASE_PATH}/userManagement/teachers/view/${id}`,
    edit: (id: string | number) => `${ADMIN_BASE_PATH}/userManagement/teachers/edit/${id}`,
} as const;
