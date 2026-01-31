import { SALES_BASE_PATH } from "@/features/dashboard/admin/sales_subscription/navigation/constants";

/**
 * Price Lists paths
 */
export const priceLists = {
    list: () => `${SALES_BASE_PATH}/price-lists`,
    create: () => `${SALES_BASE_PATH}/price-lists/create`,
    edit: (id: string | number) => `${SALES_BASE_PATH}/price-lists/edit/${id}`,
    view: (id: string | number) => `${SALES_BASE_PATH}/price-lists/view/${id}`,
};

export const priceListsSubscriptionPaths = {
    priceListsList: priceLists.list,
    priceListsCreate: priceLists.create,
    priceListsEdit: priceLists.edit,
    priceListsView: priceLists.view,
};
