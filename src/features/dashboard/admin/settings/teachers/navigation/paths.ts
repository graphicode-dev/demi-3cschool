const ADMIN_BASE_PATH = "/admin";

export const teachersPaths = {
    list: `${ADMIN_BASE_PATH}/settings/teachers`,
    create: `${ADMIN_BASE_PATH}/settings/teachers/create`,
    view: (id: string | number) => `${ADMIN_BASE_PATH}/settings/teachers/view/${id}`,
    edit: (id: string | number) => `${ADMIN_BASE_PATH}/settings/teachers/edit/${id}`,
} as const;
