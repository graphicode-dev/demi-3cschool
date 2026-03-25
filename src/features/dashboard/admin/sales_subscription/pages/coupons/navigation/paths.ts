import { SALES_BASE_PATH } from "../../../navigation/constants";

/**
 * Coupons paths
 */
export const coupons = {
    root: () => `${SALES_BASE_PATH}/coupons`,
    create: () => `${SALES_BASE_PATH}/coupons/create`,
    edit: (id: string | number) => `${SALES_BASE_PATH}/coupons/edit/${id}`,
    view: (id: string | number) => `${SALES_BASE_PATH}/coupons/view/${id}`,
    usages: (id: string | number) => `${SALES_BASE_PATH}/coupons/usages/${id}`,
};

export const couponsPaths = {
    couponsRoot: coupons.root,
    couponsCreate: coupons.create,
    couponsEdit: coupons.edit,
    couponsView: coupons.view,
    couponsUsages: coupons.usages,
};
