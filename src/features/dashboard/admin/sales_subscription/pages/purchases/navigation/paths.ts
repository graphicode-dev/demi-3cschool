import { SALES_BASE_PATH } from "@/features/dashboard/admin/sales_subscription/navigation/constants";

/**
 * Purchases paths
 */
export const purchases = {
    list: () => `${SALES_BASE_PATH}/purchases`,
    create: () => `${SALES_BASE_PATH}/purchases/create`,
    view: (id: string | number) => `${SALES_BASE_PATH}/purchases/view/${id}`,
};

export const purchaseSubscriptionPaths = {
    purchaseList: purchases.list,
    purchaseCreate: purchases.create,
    purchaseView: purchases.view,
};
