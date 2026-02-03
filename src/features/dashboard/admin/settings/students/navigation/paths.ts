const ADMIN_BASE_PATH = "/admin";

export const studentsPaths = {
    list: `${ADMIN_BASE_PATH}/settings/students`,
    create: `${ADMIN_BASE_PATH}/settings/students/create`,
    view: (id: string | number) =>
        `${ADMIN_BASE_PATH}/settings/students/view/${id}`,
    edit: (id: string | number) =>
        `${ADMIN_BASE_PATH}/settings/students/edit/${id}`,
} as const;
