/**
 * Settings paths - Admin only
 */
const ADMIN_BASE_PATH = "/dashboard/admin";

export const settings = {
    list: () => `${ADMIN_BASE_PATH}/settings`,
} as const;

export const settingsPaths = {
    settingsList: settings.list,
};
