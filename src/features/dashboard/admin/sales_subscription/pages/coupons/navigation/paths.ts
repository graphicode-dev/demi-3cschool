import { SALES_BASE_PATH } from "@/features/dashboard/admin/sales_subscription/navigation/constants";

/**
 * Purchases paths
 */
export const coupons = {
    list: () => `${SALES_BASE_PATH}/coupons`,
    create: () => `${SALES_BASE_PATH}/coupons/create`,
    edit: (id: string | number) => `${SALES_BASE_PATH}/coupons/edit/${id}`,
    view: (id: string | number) => `${SALES_BASE_PATH}/coupons/view/${id}`,
    usages: (id: string | number) => `${SALES_BASE_PATH}/coupons/usages/${id}`,
};

export const couponsSubscriptionPaths = {
    couponsList: coupons.list,
    couponsCreate: coupons.create,
    couponsEdit: coupons.edit,
    couponsView: coupons.view,
    couponsUsages: coupons.usages,
};
