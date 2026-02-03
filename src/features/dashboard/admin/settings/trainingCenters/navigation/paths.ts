const ADMIN_BASE_PATH = "/admin";

export const trainingCentersPaths = {
    list: `${ADMIN_BASE_PATH}/settings/training-centers`,
    create: `${ADMIN_BASE_PATH}/settings/training-centers/create`,
    view: (id: string | number) =>
        `${ADMIN_BASE_PATH}/settings/training-centers/view/${id}`,
    edit: (id: string | number) =>
        `${ADMIN_BASE_PATH}/settings/training-centers/edit/${id}`,
} as const;
